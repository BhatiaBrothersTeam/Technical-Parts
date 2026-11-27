import { getContact } from "@/lib/contact";

/** Floating chat button. Renders nothing until WHATSAPP_NUMBER is set. */
export function WhatsAppButton() {
  const { whatsapp } = getContact();
  if (!whatsapp) return null;

  const text = encodeURIComponent("Hello, I have an enquiry about your packages.");
  return (
    <a
      href={`https://wa.me/${whatsapp}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 end-5 z-40 h-14 w-14 rounded-full bg-[#25d366] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16.04 3C9.4 3 4 8.4 4 15.03c0 2.12.55 4.19 1.6 6.01L4 28l7.13-1.87a12.02 12.02 0 0 0 4.9 1.04h.01C22.68 27.17 28 21.77 28 15.14 28 8.5 22.67 3 16.04 3zm0 21.97h-.01a9.97 9.97 0 0 1-5.08-1.39l-.36-.22-4.23 1.11 1.13-4.12-.24-.38a9.94 9.94 0 0 1-1.53-5.3C5.72 9.5 10.2 5.03 15.7 5.03h.34c5.5 0 9.96 4.48 9.96 9.98 0 5.5-4.47 9.96-9.96 9.96zm5.46-7.46c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
      </svg>
    </a>
  );
}
