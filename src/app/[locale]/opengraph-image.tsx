import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'The World Ambassador'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2b48 50%, #0d1929 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Accent line top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #00E5E8, #38bdf8, #00E5E8)',
          }}
        />

        {/* TWA text logo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              display: 'flex',
            }}
          >
            The World Ambassador
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#00E5E8',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            News &bull; Articles &bull; Insights
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: 'rgba(255,255,255,0.5)',
            display: 'flex',
          }}
        >
          theworldambassador.com
        </div>
      </div>
    ),
    { ...size },
  )
}
