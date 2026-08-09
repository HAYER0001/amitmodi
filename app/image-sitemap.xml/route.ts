import { IMAGE_CAPTIONS } from '@/data/image-seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.complianceincheck.com';

export async function GET() {
  const images = Object.entries(IMAGE_CAPTIONS).map(([key, caption]) => {
    const ext = (key.startsWith('spread-') || key.startsWith('cover-')) ? 'jpg' : 'png';
    const imageUrl = `${SITE_URL}/images/${key}.${ext}`;
    // Since we don't have a rigid URL map, we assign these to the homepage for indexing
    const pageUrl = `${SITE_URL}/`; 
    
    return `
      <url>
        <loc>${pageUrl}</loc>
        <image:image>
          <image:loc>${imageUrl}</image:loc>
          <image:title><![CDATA[${key.replace(/-/g, ' ')}]]></image:title>
          <image:caption><![CDATA[${caption}]]></image:caption>
        </image:image>
      </url>
    `;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
