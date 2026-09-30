export interface TripFormData {
  name: string;
  email: string;
  startDate: string;
  returnDate: string;
  budget: number | string;
  travelers: number;
  destination: string;
  travelStyle: string;
  notes: string;
}

export interface SubmissionRecord {
  id: string;
  timestamp: string;
  targetUrl: string;
  mode: 'production' | 'test' | 'custom';
  status: 'success' | 'waiting' | 'error';
  fields: Record<string, any>;
  message: string;
  statusCode?: number;
}

export interface WebhookCheckResult {
  ok: boolean;
  status: number;
  isWaitingExecution: boolean;
  targetUrl: string;
  detectedTitle?: string;
  error?: string;
  checkedAt: string;
}

export const DEFAULT_PRODUCTION_URL = 'https://edulameghana19.app.n8n.cloud/form/9feb2c3f-6958-4f91-8288-c8930a165587';
export const DEFAULT_TEST_URL = 'https://edulameghana19.app.n8n.cloud/form-test/9feb2c3f-6958-4f91-8288-c8930a165587';
