import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Funkcja pomocnicza do ładowania fontów Google (Geist) dla ImageResponse
async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }
  throw new Error('Failed to load font data');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parametry główne
    const type = searchParams.get('type') || 'default'; // 'offer', 'blog', 'default'
    const title = searchParams.get('title');
    
    // Parametry specyficzne dla typu 'offer'
    const reward = searchParams.get('reward');
    const bank = searchParams.get('bank');
    
    // Parametry specyficzne dla typu 'blog'
    const category = searchParams.get('category') || 'Poradnik Cebularza';
    const author = searchParams.get('author') || 'Zespół CebulaZysku';

    // Kolory i style bazowe (zgodne z brandem emerald)
    const bgGradient = 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)';
    const darkGradient = 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)';
    
    // --------------------------------------------------------
    // Szablon A: Oferta Bankowa (Offer)
    // --------------------------------------------------------
    if (type === 'offer') {
      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              background: bgGradient,
              padding: '60px 80px',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontFamily: 'sans-serif',
              textAlign: 'center',
            }}
          >
            {/* Logo/Badge na górze */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '40px',
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: '0.5px' }}>
                CebulaZysku.pl 🧅
              </span>
            </div>

            {/* Wielki napis Gwarantowana Premia */}
            <div style={{ fontSize: 40, color: '#a7f3d0', fontWeight: 500, marginBottom: '20px' }}>
              Ołup z nami {bank || 'kolejny bank'}!
            </div>
            
            {/* Wielka kwota zysku */}
            <div
              style={{
                fontSize: 140,
                fontWeight: 800,
                color: '#fef08a', // żółto-złoty
                lineHeight: 1,
                marginBottom: '40px',
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              +{reward || '??'} zł
            </div>

            {/* Krótki tytuł */}
            <div style={{ fontSize: 48, fontWeight: 700, opacity: 0.95 }}>
              {title || 'Zgarnij darmową kasę'}
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    // --------------------------------------------------------
    // Szablon B: Artykuł Blogowy (Blog)
    // --------------------------------------------------------
    if (type === 'blog') {
      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              background: darkGradient,
              padding: '80px',
              justifyContent: 'space-between',
              color: 'white',
              fontFamily: 'sans-serif',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: '#34d399',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  marginBottom: '30px',
                }}
              >
                {category}
              </div>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: 'white',
                }}
              >
                {title || 'Poradnik finansowy'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 30,
                    marginRight: '20px',
                  }}
                >
                  🧅
                </div>
                <div style={{ fontSize: 32, fontWeight: 500, color: '#e2e8f0' }}>
                  {author}
                </div>
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#a7f3d0' }}>
                CebulaZysku.pl
              </div>
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    // --------------------------------------------------------
    // Szablon C: Default (Ranking, Strona Główna)
    // --------------------------------------------------------
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            background: bgGradient,
            padding: '80px',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontFamily: 'sans-serif',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 120, marginBottom: '40px' }}>🧅</div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '30px',
            }}
          >
            CebulaZysku.pl
          </div>
          <div style={{ fontSize: 40, fontWeight: 500, color: '#a7f3d0' }}>
            Obieramy banki z premii. Krok po kroku.
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e: any) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
