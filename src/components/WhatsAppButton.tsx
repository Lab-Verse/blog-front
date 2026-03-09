const WHATSAPP_NUMBER = '923421910341'
const PREFILLED_MESSAGE = 'Hello, I would like to get in touch with The World Ambassador.'

export default function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" />

      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        className="relative h-7 w-7"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.96A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.35 22.606c-.39 1.1-1.932 2.014-3.17 2.28-.848.18-1.956.324-5.684-1.222-4.772-1.978-7.838-6.816-8.076-7.132-.228-.316-1.916-2.55-1.916-4.862 0-2.312 1.212-3.45 1.642-3.922.39-.43.918-.612 1.224-.612.152 0 .288.008.41.014.43.018.644.042.928.716.354.838 1.216 2.962 1.322 3.178.108.216.216.506.066.802-.14.306-.264.494-.48.76-.216.266-.424.47-.64.756-.196.248-.418.514-.172.944.246.422 1.094 1.8 2.348 2.916 1.614 1.436 2.974 1.882 3.396 2.09.424.208.67.178.916-.108.254-.292 1.086-1.264 1.376-1.698.284-.432.572-.36.96-.216.392.144 2.48 1.17 2.906 1.382.424.216.708.32.812.496.104.178.104 1.028-.286 2.128z" />
      </svg>
    </a>
  )
}
