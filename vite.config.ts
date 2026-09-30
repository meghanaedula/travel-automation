import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function n8nProxyPlugin(): Plugin {
  return {
    name: 'n8n-proxy-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/n8n-check')) {
          try {
            const urlObj = new URL(req.url, 'http://localhost:3000');
            const targetUrl = urlObj.searchParams.get('url') || 'https://edulameghana19.app.n8n.cloud/form/9feb2c3f-6958-4f91-8288-c8930a165587';
            const resp = await fetch(targetUrl, {
              method: 'GET',
              headers: { 'User-Agent': 'VoyageAI-Client/1.0' },
            });
            const text = await resp.text();
            const isWaiting = text.includes("Form Trigger isn't listening yet") || text.includes('Execute step');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                ok: resp.ok,
                status: resp.status,
                isWaitingExecution: isWaiting,
                targetUrl,
                detectedTitle: text.match(/<title>(.*?)<\/title>/)?.[1] || 'n8n Form',
              })
            );
            return;
          } catch (err: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ ok: false, status: 0, error: err?.message || 'Network error' }));
            return;
          }
        }

        if (req.url?.startsWith('/api/n8n-submit') && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const targetUrl = data.targetUrl || 'https://edulameghana19.app.n8n.cloud/form/9feb2c3f-6958-4f91-8288-c8930a165587';
              const formData = new FormData();

              if (data.fields && typeof data.fields === 'object') {
                for (const [key, value] of Object.entries(data.fields)) {
                  if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                  }
                }
              }

              const n8nResp = await fetch(targetUrl, {
                method: 'POST',
                body: formData,
                headers: {
                  'User-Agent': 'VoyageAI-Client/1.0',
                },
              });

              const respText = await n8nResp.text();
              let respJson = null;
              try {
                respJson = JSON.parse(respText);
              } catch {}

              const isWaiting = respText.includes("Form Trigger isn't listening yet");

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: n8nResp.ok,
                  status: n8nResp.status,
                  isWaitingExecution: isWaiting,
                  data: respJson || respText,
                  message: n8nResp.ok
                    ? 'Workflow triggered successfully!'
                    : isWaiting
                    ? 'n8n Form Trigger is in test mode and awaiting "Execute step". Click "Execute step" in your n8n workflow or use the Live Production URL.'
                    : `Received response code ${n8nResp.status} from n8n`,
                })
              );
            } catch (parseErr: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: parseErr?.message || 'Bad request' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), n8nProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
