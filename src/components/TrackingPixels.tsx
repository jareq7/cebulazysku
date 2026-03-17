// @author Claude Code (claude-opus-4-6) | 2026-03-17 — GTM-only (replaces hardcoded GA4/Meta)
// All tags (GA4, Meta Pixel, TikTok, etc.) are now managed through GTM

export function TrackingPixels() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

  return (
    <>
      {/* Google Search Console verification */}
      {gscVerification && (
        <meta name="google-site-verification" content={gscVerification} />
      )}

      {/* Google Tag Manager — with Consent Mode v2 default (denied) */}
      {gtmId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_personalization': 'denied',
                'ad_user_data': 'denied',
                'wait_for_update': 500
              });
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          }}
        />
      )}
    </>
  );
}

/**
 * GTM noscript fallback — render in <body>
 */
export function GTMNoScript() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
