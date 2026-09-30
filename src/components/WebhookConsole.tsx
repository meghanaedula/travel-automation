import React, { useState } from 'react';
import {
  Activity,
  Terminal,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  X,
} from 'lucide-react';
import {
  DEFAULT_PRODUCTION_URL,
  DEFAULT_TEST_URL,
  SubmissionRecord,
  WebhookCheckResult,
} from '../types';
import { checkN8nEndpoint, submitToN8n } from '../services/n8nService';

interface WebhookConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: SubmissionRecord[];
  onNewSubmission: (record: SubmissionRecord) => void;
}

export const WebhookConsole: React.FC<WebhookConsoleProps> = ({
  isOpen,
  onClose,
  submissions,
  onNewSubmission,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<'production' | 'test'>('production');
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<WebhookCheckResult | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testResponse, setTestResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = selectedTarget === 'production' ? DEFAULT_PRODUCTION_URL : DEFAULT_TEST_URL;

  const handlePing = async () => {
    setChecking(true);
    setCheckResult(null);
    const result = await checkN8nEndpoint(currentUrl);
    setCheckResult(result);
    setChecking(false);
  };

  const curlCommand = `curl -X POST "${currentUrl}" \\
  -F "field-0=Meghana Edula" \\
  -F "field-1=meghanaedula19@gmail.com" \\
  -F "field-2=2026-10-15" \\
  -F "field-3=2026-10-22" \\
  -F "field-4=3500" \\
  -F "field-5=2"`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleSendSampleTest = async () => {
    setTestSending(true);
    setTestResponse(null);

    const sampleData = {
      name: 'Test Automation Agent',
      email: 'meghanaedula19@gmail.com',
      startDate: '2026-11-01',
      returnDate: '2026-11-08',
      budget: 2500,
      travelers: 2,
      destination: 'Tokyo & Kyoto Test Route',
      travelStyle: 'Cultural Immersion',
      notes: 'Diagnostic test trigger from VoyageAI developer console.',
    };

    const res = await submitToN8n(currentUrl, sampleData);
    const now = new Date().toLocaleTimeString();

    const record: SubmissionRecord = {
      id: `diag_${Date.now().toString(36)}`,
      timestamp: now,
      targetUrl: currentUrl,
      mode: selectedTarget,
      status: res.success ? 'success' : res.isWaiting ? 'waiting' : 'error',
      fields: sampleData,
      message: res.message,
      statusCode: res.status,
    };

    onNewSubmission(record);
    setTestResponse(
      res.success
        ? `HTTP ${res.status}: Workflow successfully acknowledged by n8n cloud!`
        : res.isWaiting
        ? `HTTP ${res.status}: Form Trigger is in test mode. Click "Execute step" in your n8n workflow canvas.`
        : `HTTP ${res.status}: ${res.message}`
    );
    setTestSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-stone-100">
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                n8n Webhook Diagnostics & Monitor
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                edulameghana19.app.n8n.cloud · Node: travelling agent
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Target Selector & Live Ping */}
          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 font-mono">Target Endpoint:</span>
                <div className="inline-flex p-1 bg-stone-900 rounded-lg text-xs font-mono">
                  <button
                    onClick={() => {
                      setSelectedTarget('production');
                      setCheckResult(null);
                    }}
                    className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                      selectedTarget === 'production'
                        ? 'bg-amber-400 text-stone-950 font-semibold'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Live Production (/form/)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTarget('test');
                      setCheckResult(null);
                    }}
                    className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                      selectedTarget === 'test'
                        ? 'bg-amber-400 text-stone-950 font-semibold'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Test Webhook (/form-test/)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePing}
                  disabled={checking}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-xs font-mono rounded text-stone-200 flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
                  <span>{checking ? 'Checking Endpoint...' : 'Ping n8n Endpoint'}</span>
                </button>

                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-stone-400 hover:text-white transition-colors"
                  title="Open directly in n8n Cloud"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="text-xs font-mono text-stone-400 break-all bg-stone-900/60 p-2.5 rounded border border-stone-800/80">
              {currentUrl}
            </div>

            {/* Check Result Display */}
            {checkResult && (
              <div
                className={`p-3 rounded-lg text-xs font-mono flex items-start gap-2.5 ${
                  checkResult.ok
                    ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-300'
                    : checkResult.isWaitingExecution
                    ? 'bg-amber-950/60 border border-amber-800/80 text-amber-300'
                    : 'bg-red-950/60 border border-red-800/80 text-red-300'
                }`}
              >
                {checkResult.ok ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                ) : checkResult.isWaitingExecution ? (
                  <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                )}
                <div className="space-y-1">
                  <div className="font-semibold">
                    Status: {checkResult.status} · Checked at {checkResult.checkedAt}
                  </div>
                  {checkResult.ok && (
                    <div>
                      Endpoint is active and receptive. Ready for production client intake.
                    </div>
                  )}
                  {checkResult.isWaitingExecution && (
                    <div>
                      Form Trigger is currently waiting. Open your n8n canvas and click "Execute step"
                      to capture test events, or use Live Production mode.
                    </div>
                  )}
                  {checkResult.error && <div>{checkResult.error}</div>}
                </div>
              </div>
            )}
          </div>

          {/* cURL Command Generator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                Direct cURL Terminal Test
              </span>
              <button
                onClick={handleCopyCurl}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono cursor-pointer"
              >
                {copiedCurl ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy cURL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-stone-950 rounded-xl border border-stone-800 font-mono text-xs text-stone-300 overflow-x-auto">
              {curlCommand}
            </pre>
          </div>

          {/* 1-Click Test Trigger */}
          <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-xs text-stone-200">
                Fire Sample Diagnostic Payload
              </p>
              <p className="text-[11px] text-stone-400">
                Transmits a sample 2-person journey intake to verify n8n response.
              </p>
            </div>

            <button
              onClick={handleSendSampleTest}
              disabled={testSending}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {testSending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test to n8n</span>
                </>
              )}
            </button>
          </div>

          {testResponse && (
            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 text-xs font-mono text-stone-300">
              <span className="text-amber-400 font-semibold">Test Response: </span>
              {testResponse}
            </div>
          )}

          {/* Submission History */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-3">
              Session Submissions ({submissions.length})
            </h4>

            {submissions.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 border border-dashed border-stone-800 rounded-xl">
                No submissions sent in this browser session yet. Submit via the Trip Planner to log executions.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 bg-stone-950 rounded-lg border border-stone-800 text-xs flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          sub.status === 'success'
                            ? 'bg-emerald-400'
                            : sub.status === 'waiting'
                            ? 'bg-amber-400'
                            : 'bg-red-400'
                        }`}
                      />
                      <span className="font-mono text-stone-300">{sub.fields['field-0'] || sub.fields.name}</span>
                      <span className="text-stone-500">·</span>
                      <span className="text-stone-400 font-mono">${sub.fields['field-4'] || sub.fields.budget} USD</span>
                      <span className="text-stone-500">·</span>
                      <span className="text-stone-400 font-mono">{sub.fields['field-5'] || sub.fields.travelers} pax</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-stone-500">{sub.timestamp}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          sub.status === 'success'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {sub.statusCode ? `HTTP ${sub.statusCode}` : sub.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 font-mono">
          <span>Workflow Trigger: 9feb2c3f-6958-4f91-8288-c8930a165587</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
