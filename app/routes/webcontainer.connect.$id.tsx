import { type LoaderFunction } from '@remix-run/cloudflare';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const editorOrigin = url.searchParams.get('editorOrigin') || 'https://stackblitz.com';
  console.log('editorOrigin', editorOrigin);

  const cookieHeader = request.headers.get('Cookie') ?? '';
  const locale = /(?:^|;\s*)bolt_locale=en(?:;|$)/.test(cookieHeader) ? 'en' : 'ar';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${locale}" dir="${dir}">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Connect to WebContainer</title>
      </head>
      <body>
        <script type="module">
          (async () => {
            const { setupConnect } = await import('https://cdn.jsdelivr.net/npm/@webcontainer/api@latest/dist/connect.js');
            setupConnect({
              editorOrigin: '${editorOrigin}'
            });
          })();
        </script>
      </body>
    </html>
  `;

  return new Response(htmlContent, {
    headers: { 'Content-Type': 'text/html' },
  });
};
