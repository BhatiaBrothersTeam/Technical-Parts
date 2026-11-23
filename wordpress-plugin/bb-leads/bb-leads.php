<?php
/**
 * Plugin Name: BB Leads
 * Description: Lead capture for technicalparts.com. Receives RFQs, price requests and enquiries from the Next.js storefront (server-to-server only), stores them as bb_lead records with private attachments, and notifies the sales team.
 * Version: 1.2.0
 * Author: BB Group
 * Text Domain: bb-leads
 */

if (!defined('ABSPATH')) {
    exit;
}

define('BB_LEADS_VERSION', '1.2.0');
define('BB_LEADS_MAX_FILE_SIZE', 25 * 1024 * 1024);
define('BB_LEADS_MAX_FILES', 10);
define('BB_LEADS_MAX_ITEMS', 100);
define('BB_LEADS_RATE_LIMIT', 10);
define('BB_LEADS_RATE_WINDOW', 10 * MINUTE_IN_SECONDS);
define('BB_LEADS_PRIVATE_DIR', 'bb-leads-private');
define('BB_LEADS_ALLOWED_EXTENSIONS', ['pdf', 'xls', 'xlsx', 'doc', 'docx', 'jpg', 'jpeg', 'png']);

/*
 * Required in wp-config.php (same value as BB_LEADS_PROXY_SECRET in the Next.js env):
 *   define('BB_LEADS_PROXY_SECRET', 'at-least-32-random-characters');
 * Optional:
 *   define('BB_LEADS_NOTIFY_EMAIL', 'sales@example.com'); // defaults to the site admin email
 */

function bb_leads_valid_types() {
    return [
        'price_request',
        'rfq_upload',
        'epc_enquiry',
        'cj_enquiry',
        'general_enquiry',
        // Earlier lead types, kept so older records and submissions remain valid.
        'oil_gas_enquiry',
        'repair_enquiry',
        'equipment_enquiry',
    ];
}

function bb_leads_statuses() {
    return [
        'new' => 'New',
        'assigned' => 'Assigned',
        'contacted' => 'Contacted',
        'quoted' => 'Quoted',
        'follow_up' => 'Follow-up',
        'won' => 'Won',
        'lost' => 'Lost',
    ];
}

function bb_leads_capabilities() {
    return [
        'edit_bb_leads',
        'edit_others_bb_leads',
        'edit_private_bb_leads',
        'edit_published_bb_leads',
        'publish_bb_leads',
        'read_private_bb_leads',
        'delete_bb_leads',
        'delete_others_bb_leads',
        'delete_private_bb_leads',
        'delete_published_bb_leads',
    ];
}

/**
 * Leads can only be created by the API, never from the admin, and are visible
 * only to roles holding the bb_lead capabilities (administrator and shop
 * manager by default). Create extra roles (for example Sales Manager) and
 * grant them these capabilities to control who sees leads.
 */
register_activation_hook(__FILE__, function () {
    foreach (['administrator', 'shop_manager'] as $role_name) {
        $role = get_role($role_name);
        if (!$role) {
            continue;
        }
        foreach (bb_leads_capabilities() as $cap) {
            $role->add_cap($cap);
        }
    }
});

add_action('init', function () {
    register_post_type('bb_lead', [
        'label' => 'Leads',
        'labels' => ['singular_name' => 'Lead', 'edit_item' => 'Lead details'],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => false,
        'menu_icon' => 'dashicons-email-alt',
        'supports' => ['title'],
        'capability_type' => ['bb_lead', 'bb_leads'],
        'map_meta_cap' => true,
        'capabilities' => ['create_posts' => 'do_not_allow'],
    ]);
});

/* ---------------------------------------------------------------------------
 * REST endpoint: POST /wp-json/bb-leads/v1/leads  (server-to-server only)
 * ------------------------------------------------------------------------- */

add_action('rest_api_init', function () {
    register_rest_route('bb-leads/v1', '/leads', [
        'methods' => 'POST',
        'callback' => 'bb_leads_handle_submission',
        'permission_callback' => 'bb_leads_authorize',
    ]);
});

function bb_leads_authorize(WP_REST_Request $request) {
    if (!defined('BB_LEADS_PROXY_SECRET') || strlen(BB_LEADS_PROXY_SECRET) < 32) {
        return new WP_Error('bb_leads_not_configured', 'Lead intake is not configured.', ['status' => 503]);
    }
    $provided = (string) $request->get_header('X-BB-Proxy-Secret');
    if ($provided === '' || !hash_equals(BB_LEADS_PROXY_SECRET, $provided)) {
        return new WP_Error('bb_leads_unauthorized', 'Unauthorized.', ['status' => 401]);
    }
    return true;
}

function bb_leads_client_ip(WP_REST_Request $request) {
    $ip = trim((string) $request->get_header('X-BB-Client-IP'));
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : 'unknown';
}

/**
 * Per-visitor limit. The storefront forwards the visitor's address in
 * X-BB-Client-IP (trusted because the request carries the proxy secret).
 */
function bb_leads_rate_limited($ip) {
    $key = 'bb_leads_rl_' . md5($ip);
    $count = (int) get_transient($key);
    if ($count >= BB_LEADS_RATE_LIMIT) {
        return true;
    }
    set_transient($key, $count + 1, BB_LEADS_RATE_WINDOW);
    return false;
}

function bb_leads_text($value, $max = 5000, $multiline = false) {
    if (!is_scalar($value)) {
        return '';
    }
    $clean = $multiline ? sanitize_textarea_field((string) $value) : sanitize_text_field((string) $value);
    return function_exists('mb_substr') ? mb_substr($clean, 0, $max) : substr($clean, 0, $max);
}

/**
 * Atomic daily counter: the increment and read happen in one connection via
 * LAST_INSERT_ID(), so two simultaneous submissions can never share an ID.
 */
function bb_leads_next_lead_id() {
    global $wpdb;
    $today = current_time('Ymd');
    $key = 'bb_leads_counter_' . $today;
    add_option($key, 0, '', 'no');
    $wpdb->query($wpdb->prepare(
        "UPDATE {$wpdb->options} SET option_value = LAST_INSERT_ID(option_value + 1) WHERE option_name = %s",
        $key
    ));
    $number = (int) $wpdb->get_var('SELECT LAST_INSERT_ID()');
    return sprintf('TP-%s-%04d', $today, $number);
}

function bb_leads_normalize_files($files_field) {
    if (empty($files_field) || !is_array($files_field) || !isset($files_field['name'])) {
        return [];
    }
    if (!is_array($files_field['name'])) {
        return $files_field['name'] === '' ? [] : [$files_field];
    }
    $normalized = [];
    foreach ($files_field['name'] as $i => $name) {
        if ($name === '') {
            continue;
        }
        $normalized[] = [
            'name' => $files_field['name'][$i],
            'type' => $files_field['type'][$i],
            'tmp_name' => $files_field['tmp_name'][$i],
            'error' => $files_field['error'][$i],
            'size' => $files_field['size'][$i],
        ];
    }
    return $normalized;
}

/**
 * Checks every file before anything is saved. Invalid files fail the whole
 * request so a customer is never told an RFQ was received when a file was lost.
 */
function bb_leads_validate_files(array $files) {
    if (count($files) > BB_LEADS_MAX_FILES) {
        return new WP_Error('bb_leads_too_many_files', 'You can attach up to ' . BB_LEADS_MAX_FILES . ' files.', ['status' => 400]);
    }
    foreach ($files as $file) {
        $name = sanitize_file_name($file['name']);
        if ((int) $file['error'] !== UPLOAD_ERR_OK) {
            return new WP_Error('bb_leads_upload_error', $name . ' could not be uploaded.', ['status' => 400]);
        }
        if ((int) $file['size'] <= 0 || (int) $file['size'] > BB_LEADS_MAX_FILE_SIZE) {
            return new WP_Error('bb_leads_file_size', $name . ' must be between 1 byte and 25MB.', ['status' => 400]);
        }
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if (!in_array($ext, BB_LEADS_ALLOWED_EXTENSIONS, true)) {
            return new WP_Error('bb_leads_file_type', $name . ' is not an accepted file type.', ['status' => 400]);
        }
        $check = wp_check_filetype_and_ext($file['tmp_name'], $name);
        if (empty($check['ext']) || empty($check['type'])) {
            return new WP_Error('bb_leads_file_content', $name . ' does not look like a valid ' . $ext . ' file.', ['status' => 400]);
        }
    }
    return true;
}

function bb_leads_private_dir() {
    $uploads = wp_upload_dir();
    $dir = trailingslashit($uploads['basedir']) . BB_LEADS_PRIVATE_DIR;
    if (!file_exists($dir)) {
        wp_mkdir_p($dir);
    }
    $htaccess = $dir . '/.htaccess';
    if (!file_exists($htaccess)) {
        file_put_contents($htaccess, "Require all denied\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
    }
    $index = $dir . '/index.php';
    if (!file_exists($index)) {
        file_put_contents($index, "<?php // Silence is golden.\n");
    }
    return $dir;
}

function bb_leads_store_files($lead_id, array $files) {
    $base = bb_leads_private_dir();
    $folder = sanitize_file_name($lead_id) . '-' . wp_generate_password(16, false, false);
    $target = $base . '/' . $folder;
    wp_mkdir_p($target);

    $stored = [];
    foreach ($files as $file) {
        $name = wp_unique_filename($target, sanitize_file_name($file['name']));
        $destination = $target . '/' . $name;
        if (!@move_uploaded_file($file['tmp_name'], $destination)) {
            bb_leads_delete_folder($target);
            return new WP_Error('bb_leads_store_failed', 'Could not store ' . $name . '.', ['status' => 500]);
        }
        $stored[] = [
            'filename' => $name,
            'path' => $folder . '/' . $name,
            'size' => (int) $file['size'],
        ];
    }
    return $stored;
}

function bb_leads_delete_folder($dir) {
    if (!is_dir($dir)) {
        return;
    }
    foreach (glob($dir . '/*') ?: [] as $path) {
        is_dir($path) ? bb_leads_delete_folder($path) : @unlink($path);
    }
    @rmdir($dir);
}

function bb_leads_parse_items($raw) {
    if (is_string($raw) && $raw !== '') {
        $raw = json_decode($raw, true);
    }
    if (!is_array($raw)) {
        return [];
    }
    $items = [];
    foreach (array_slice($raw, 0, BB_LEADS_MAX_ITEMS) as $item) {
        if (!is_array($item)) {
            continue;
        }
        $items[] = [
            'product' => bb_leads_text($item['product'] ?? '', 300),
            'brand' => bb_leads_text($item['brand'] ?? '', 200),
            'part_number' => bb_leads_text($item['part_number'] ?? '', 200),
            'quantity' => max(1, (int) ($item['quantity'] ?? 1)),
            'required_delivery' => bb_leads_text($item['required_delivery'] ?? '', 200),
            'notes' => bb_leads_text($item['notes'] ?? '', 1000, true),
        ];
    }
    return $items;
}

function bb_leads_handle_submission(WP_REST_Request $request) {
    $ip = bb_leads_client_ip($request);
    if (bb_leads_rate_limited($ip)) {
        return new WP_Error('bb_leads_rate_limited', 'Too many submissions. Please try again later.', ['status' => 429]);
    }

    $params = $request->get_json_params();
    if (!is_array($params)) {
        $params = $request->get_body_params();
    }

    $lead_type = bb_leads_text($params['lead_type'] ?? '', 50);
    if (!in_array($lead_type, bb_leads_valid_types(), true)) {
        return new WP_Error('bb_leads_invalid_type', 'Invalid lead_type.', ['status' => 400]);
    }

    $name = bb_leads_text($params['name'] ?? '', 200);
    $email = sanitize_email((string) ($params['email'] ?? ''));
    $phone = bb_leads_text($params['phone'] ?? '', 50);
    $country = bb_leads_text($params['country'] ?? '', 100);
    if ($name === '' || !is_email($email) || $phone === '' || $country === '') {
        return new WP_Error('bb_leads_missing_fields', 'Name, a valid email, phone and country are required.', ['status' => 400]);
    }

    $files = bb_leads_normalize_files($request->get_file_params()['files'] ?? null);
    $valid = bb_leads_validate_files($files);
    if (is_wp_error($valid)) {
        return $valid;
    }

    $lead_id = bb_leads_next_lead_id();
    $post_id = wp_insert_post([
        'post_type' => 'bb_lead',
        'post_title' => $lead_id,
        'post_status' => 'publish',
    ], true);
    if (is_wp_error($post_id)) {
        return new WP_Error('bb_leads_save_failed', 'Failed to save lead.', ['status' => 500]);
    }

    $attachments = [];
    if ($files) {
        $attachments = bb_leads_store_files($lead_id, $files);
        if (is_wp_error($attachments)) {
            wp_delete_post($post_id, true);
            return $attachments;
        }
    }

    $meta = [
        'lead_id' => $lead_id,
        'site' => 'TP',
        'lead_type' => $lead_type,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'country' => $country,
        'company' => bb_leads_text($params['company'] ?? '', 200),
        'job_title' => bb_leads_text($params['job_title'] ?? '', 200),
        'enquiry_type' => bb_leads_text($params['enquiry_type'] ?? '', 100),
        'project' => bb_leads_text($params['project'] ?? '', 300),
        'end_user' => bb_leads_text($params['end_user'] ?? '', 300),
        'message' => bb_leads_text($params['message'] ?? '', 5000, true),
        'page_url' => esc_url_raw((string) ($params['page_url'] ?? '')),
        'utm_source' => bb_leads_text($params['utm_source'] ?? '', 200),
        'utm_medium' => bb_leads_text($params['utm_medium'] ?? '', 200),
        'utm_campaign' => bb_leads_text($params['utm_campaign'] ?? '', 200),
        'status' => 'new',
        'items' => wp_json_encode(bb_leads_parse_items($params['items'] ?? null)),
        'attachments' => wp_json_encode($attachments),
    ];

    // update_post_meta strips slashes from its input, so slash first to keep
    // backslashes and JSON escapes in customer text intact.
    foreach ($meta as $key => $value) {
        update_post_meta($post_id, $key, wp_slash($value));
    }

    bb_leads_notify($post_id, $lead_id, $meta, count($attachments));

    return rest_ensure_response(['lead_id' => $lead_id]);
}

function bb_leads_notify($post_id, $lead_id, array $meta, $attachment_count) {
    $to = defined('BB_LEADS_NOTIFY_EMAIL') ? BB_LEADS_NOTIFY_EMAIL : get_option('admin_email');
    if (!is_email($to)) {
        return;
    }
    $lines = [
        "New enquiry {$lead_id} ({$meta['lead_type']})",
        '',
        "Name: {$meta['name']}",
        "Company: {$meta['company']}",
        "Email: {$meta['email']}",
        "Phone: {$meta['phone']}",
        "Country: {$meta['country']}",
    ];
    $items = json_decode($meta['items'], true);
    if (!empty($items)) {
        $lines[] = '';
        $lines[] = 'Items:';
        foreach ($items as $item) {
            $lines[] = "- {$item['quantity']} x {$item['product']} ({$item['brand']} {$item['part_number']})";
        }
    }
    if ($meta['message'] !== '') {
        $lines[] = '';
        $lines[] = 'Message: ' . $meta['message'];
    }
    if ($attachment_count > 0) {
        $lines[] = '';
        $lines[] = "Attachments: {$attachment_count} (download from the lead in WP Admin)";
    }
    $lines[] = '';
    $lines[] = 'Open in WP Admin: ' . admin_url('post.php?post=' . (int) $post_id . '&action=edit');

    $sent = wp_mail($to, "New enquiry {$lead_id}", implode("\n", $lines), ['Reply-To: ' . $meta['email']]);
    if (!$sent) {
        error_log("[bb-leads] Notification email failed for {$lead_id}; the lead itself was saved.");
    }
}

/* ---------------------------------------------------------------------------
 * Admin: list columns, detail box, status, private downloads
 * ------------------------------------------------------------------------- */

add_filter('manage_bb_lead_posts_columns', function ($columns) {
    return [
        'cb' => $columns['cb'],
        'title' => 'Lead ID',
        'lead_type' => 'Type',
        'name' => 'Name',
        'company' => 'Company',
        'email' => 'Email',
        'phone' => 'Phone',
        'country' => 'Country',
        'status' => 'Status',
        'date' => $columns['date'],
    ];
});

add_action('manage_bb_lead_posts_custom_column', function ($column, $post_id) {
    if (in_array($column, ['lead_type', 'name', 'company', 'email', 'phone', 'country'], true)) {
        echo esc_html(get_post_meta($post_id, $column, true));
    } elseif ($column === 'status') {
        $statuses = bb_leads_statuses();
        $status = get_post_meta($post_id, 'status', true);
        echo esc_html($statuses[$status] ?? $status);
    }
}, 10, 2);

add_action('add_meta_boxes', function () {
    add_meta_box('bb_lead_details', 'Enquiry details', 'bb_leads_render_details', 'bb_lead', 'normal', 'high');
    add_meta_box('bb_lead_status', 'Follow-up status', 'bb_leads_render_status', 'bb_lead', 'side', 'high');
});

function bb_leads_render_details($post) {
    $fields = [
        'lead_type' => 'Type', 'name' => 'Name', 'company' => 'Company', 'job_title' => 'Job title',
        'email' => 'Email', 'phone' => 'Phone', 'country' => 'Country', 'enquiry_type' => 'Enquiry type',
        'project' => 'Project', 'end_user' => 'End user', 'message' => 'Message', 'page_url' => 'Page',
        'utm_source' => 'UTM source', 'utm_medium' => 'UTM medium', 'utm_campaign' => 'UTM campaign',
    ];
    echo '<table class="widefat striped"><tbody>';
    foreach ($fields as $key => $label) {
        $value = get_post_meta($post->ID, $key, true);
        if ($value === '') {
            continue;
        }
        echo '<tr><th style="width:150px">' . esc_html($label) . '</th><td>' . nl2br(esc_html($value)) . '</td></tr>';
    }
    echo '</tbody></table>';

    $items = json_decode((string) get_post_meta($post->ID, 'items', true), true);
    if (!empty($items)) {
        echo '<h4>Requested items</h4><table class="widefat striped"><thead><tr><th>Product</th><th>Brand</th><th>Part number</th><th>Qty</th><th>Delivery</th><th>Notes</th></tr></thead><tbody>';
        foreach ($items as $item) {
            echo '<tr><td>' . esc_html($item['product']) . '</td><td>' . esc_html($item['brand']) . '</td><td>' . esc_html($item['part_number'])
                . '</td><td>' . (int) $item['quantity'] . '</td><td>' . esc_html($item['required_delivery']) . '</td><td>' . esc_html($item['notes']) . '</td></tr>';
        }
        echo '</tbody></table>';
    }

    $attachments = json_decode((string) get_post_meta($post->ID, 'attachments', true), true);
    if (!empty($attachments)) {
        echo '<h4>Attachments</h4><ul>';
        foreach ($attachments as $index => $file) {
            $url = wp_nonce_url(
                admin_url('admin-post.php?action=bb_leads_download&lead=' . (int) $post->ID . '&file=' . (int) $index),
                'bb_leads_dl_' . $post->ID . '_' . $index
            );
            echo '<li><a href="' . esc_url($url) . '">' . esc_html($file['filename']) . '</a> (' . esc_html(size_format($file['size'])) . ')</li>';
        }
        echo '</ul>';
    }
}

function bb_leads_render_status($post) {
    wp_nonce_field('bb_leads_save_status', 'bb_leads_status_nonce');
    $current = get_post_meta($post->ID, 'status', true) ?: 'new';
    echo '<select name="bb_leads_status" style="width:100%">';
    foreach (bb_leads_statuses() as $value => $label) {
        printf('<option value="%s"%s>%s</option>', esc_attr($value), selected($current, $value, false), esc_html($label));
    }
    echo '</select>';
}

add_action('save_post_bb_lead', function ($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!isset($_POST['bb_leads_status_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['bb_leads_status_nonce'])), 'bb_leads_save_status')) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    $status = sanitize_key(wp_unslash($_POST['bb_leads_status'] ?? ''));
    if (array_key_exists($status, bb_leads_statuses())) {
        update_post_meta($post_id, 'status', $status);
    }
});

add_action('admin_post_bb_leads_download', function () {
    $lead = isset($_GET['lead']) ? (int) $_GET['lead'] : 0;
    $index = isset($_GET['file']) ? (int) $_GET['file'] : -1;

    check_admin_referer('bb_leads_dl_' . $lead . '_' . $index);
    if (!$lead || !current_user_can('edit_post', $lead) || get_post_type($lead) !== 'bb_lead') {
        wp_die('You are not allowed to download this file.', 403);
    }

    $attachments = json_decode((string) get_post_meta($lead, 'attachments', true), true);
    $file = $attachments[$index] ?? null;
    if (!$file) {
        wp_die('File not found.', 404);
    }

    $base = realpath(bb_leads_private_dir());
    $path = realpath($base . '/' . $file['path']);
    if (!$path || strpos($path, $base . DIRECTORY_SEPARATOR) !== 0 || !is_file($path)) {
        wp_die('File not found.', 404);
    }

    nocache_headers();
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . rawurlencode($file['filename']) . '"');
    header('Content-Length: ' . filesize($path));
    header('X-Content-Type-Options: nosniff');
    readfile($path);
    exit;
});
