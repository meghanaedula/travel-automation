import { DEFAULT_PRODUCTION_URL, DEFAULT_TEST_URL, TripFormData, WebhookCheckResult } from '../types';

export function mapTripFormToN8nPayload(data: TripFormData): Record<string, string> {
  const fields: Record<string, string> = {
    // Exact n8n form trigger fields
    'field-0': data.name.trim(),
    'field-1': data.email.trim(),
    'field-2': data.startDate,
    'field-3': data.returnDate,
    'field-4': String(data.budget || '0'),
    'field-5': String(data.travelers || '1'),

    // Semantic key names for nodes that inspect by key name
    name: data.name.trim(),
    email: data.email.trim(),
    starting_date: data.startDate,
    return_date: data.returnDate,
    budget: String(data.budget || '0'),
    number_of_travels: String(data.travelers || '1'),
    destination: data.destination ? data.destination.trim() : 'Unspecified',
    travel_style: data.travelStyle || 'Curated',
    notes: data.notes ? data.notes.trim() : '',
  };

  return fields;
}

export async function checkN8nEndpoint(targetUrl: string): Promise<WebhookCheckResult> {
  const now = new Date().toLocaleTimeString();

  // Try local proxy endpoint first to bypass browser CORS
  try {
    const proxyUrl = `/api/n8n-check?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        ok: Boolean(data.ok),
        status: data.status,
        isWaitingExecution: Boolean(data.isWaitingExecution),
        targetUrl: data.targetUrl || targetUrl,
        detectedTitle: data.detectedTitle,
        checkedAt: now,
      };
    }
  } catch {
    // Proxy failed, try direct fetch
  }

  // Fallback direct check
  try {
    const directRes = await fetch(targetUrl, { method: 'GET', mode: 'no-cors' });
    return {
      ok: true,
      status: 200,
      isWaitingExecution: false,
      targetUrl,
      detectedTitle: 'n8n Form Endpoint',
      checkedAt: now,
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      isWaitingExecution: false,
      targetUrl,
      error: err?.message || 'Failed to connect to n8n webhook',
      checkedAt: now,
    };
  }
}

export async function submitToN8n(
  targetUrl: string,
  formData: TripFormData
): Promise<{ success: boolean; status: number; message: string; isWaiting?: boolean; rawData?: any }> {
  const fields = mapTripFormToN8nPayload(formData);

  // 1. Try submitting through our local backend proxy first
  try {
    const proxyRes = await fetch('/api/n8n-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetUrl,
        fields,
      }),
    });

    if (proxyRes.ok) {
      const result = await proxyRes.json();
      return {
        success: Boolean(result.success),
        status: result.status,
        message: result.message || (result.success ? 'Request successfully sent to n8n Travelling Agent!' : 'Submission received with warning'),
        isWaiting: Boolean(result.isWaitingExecution),
        rawData: result.data,
      };
    }
  } catch {
    // Proxy error, fallback to direct fetch
  }

  // 2. Direct browser fetch fallback (FormData)
  try {
    const directFormData = new FormData();
    for (const [k, v] of Object.entries(fields)) {
      directFormData.append(k, v);
    }

    const res = await fetch(targetUrl, {
      method: 'POST',
      body: directFormData,
    });

    const text = await res.text();
    const isWaiting = text.includes("Form Trigger isn't listening yet");

    return {
      success: res.ok,
      status: res.status,
      message: res.ok
        ? 'Workflow triggered successfully in n8n!'
        : isWaiting
        ? 'n8n form is in test mode and not listening. Please click "Execute step" in your n8n workflow.'
        : `Server returned HTTP ${res.status}`,
      isWaiting,
      rawData: text,
    };
  } catch (directErr: any) {
    return {
      success: false,
      status: 0,
      message: directErr?.message || 'Could not reach n8n endpoint. Check network or n8n cloud status.',
    };
  }
}
