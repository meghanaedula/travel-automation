import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// n8n status check endpoint
app.get('/api/n8n-check', async (req: Request, res: Response) => {
  try {
    const targetUrl = (req.query.url as string) || 'https://edulameghana19.app.n8n.cloud/form/9feb2c3f-6958-4f91-8288-c8930a165587';
    const resp = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'VoyageAI-Client/1.0' },
    });
    const text = await resp.text();
    const isWaiting = text.includes("Form Trigger isn't listening yet") || text.includes('Execute step');
    res.json({
      ok: resp.ok,
      status: resp.status,
      isWaitingExecution: isWaiting,
      targetUrl,
      detectedTitle: text.match(/<title>(.*?)<\/title>/)?.[1] || 'n8n Form',
    });
  } catch (err: any) {
    res.json({ ok: false, status: 0, error: err?.message || 'Network error' });
  }
});

// n8n form submission proxy endpoint
app.post('/api/n8n-submit', async (req: Request, res: Response) => {
  try {
    const { targetUrl = 'https://edulameghana19.app.n8n.cloud/form/9feb2c3f-6958-4f91-8288-c8930a165587', fields } = req.body;
    const formData = new FormData();

    if (fields && typeof fields === 'object') {
      for (const [key, value] of Object.entries(fields)) {
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

    res.json({
      success: n8nResp.ok,
      status: n8nResp.status,
      isWaitingExecution: isWaiting,
      data: respJson || respText,
      message: n8nResp.ok
        ? 'Workflow triggered successfully!'
        : isWaiting
        ? 'n8n Form Trigger is in test mode and awaiting "Execute step". Click "Execute step" in your n8n workflow or use the Live Production URL.'
        : `Received response code ${n8nResp.status} from n8n`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Submission proxy error' });
  }
});

// Serve static assets from dist in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
