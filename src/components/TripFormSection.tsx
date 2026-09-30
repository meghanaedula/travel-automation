import React, { useState, useId } from 'react';
import {
  Send,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Compass,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  RefreshCw,
  ExternalLink,
  Code2,
} from 'lucide-react';
import {
  TripFormData,
  DEFAULT_PRODUCTION_URL,
  DEFAULT_TEST_URL,
  SubmissionRecord,
} from '../types';
import { mapTripFormToN8nPayload, submitToN8n } from '../services/n8nService';

interface TripFormSectionProps {
  onSubmissionSuccess: (record: SubmissionRecord) => void;
  selectedDestination?: { name: string; budget: number; style: string } | null;
}

export const TripFormSection: React.FC<TripFormSectionProps> = ({
  onSubmissionSuccess,
  selectedDestination,
}) => {
  const [mode, setMode] = useState<'production' | 'test' | 'custom'>('production');
  const [customUrl, setCustomUrl] = useState('');
  const [showPayloadPreview, setShowPayloadPreview] = useState(false);

  // Form State
  const [formData, setFormData] = useState<TripFormData>({
    name: 'Meghana Edula',
    email: 'meghanaedula19@gmail.com',
    startDate: '2026-10-15',
    returnDate: '2026-10-22',
    budget: 3500,
    travelers: 2,
    destination: 'Kyoto & Tokyo, Japan',
    travelStyle: 'Cultural Immersion',
    notes: 'Prefer boutique ryokans and scenic Shinkansen train routes.',
  });

  // Track if props changed
  React.useEffect(() => {
    if (selectedDestination) {
      setFormData((prev) => ({
        ...prev,
        destination: selectedDestination.name,
        budget: selectedDestination.budget,
        travelStyle: selectedDestination.style,
      }));
    }
  }, [selectedDestination]);

  // Submission Status
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    status: number;
    message: string;
    isWaiting?: boolean;
    timestamp?: string;
  } | null>(null);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const targetUrl =
    mode === 'production'
      ? DEFAULT_PRODUCTION_URL
      : mode === 'test'
      ? DEFAULT_TEST_URL
      : customUrl || DEFAULT_PRODUCTION_URL;

  // Validation
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email is required for itinerary delivery';
    }
    if (!formData.startDate) errs.startDate = 'Starting date is required';
    if (!formData.returnDate) errs.returnDate = 'Return date is required';
    if (formData.startDate && formData.returnDate && formData.startDate > formData.returnDate) {
      errs.returnDate = 'Return date must be on or after starting date';
    }
    if (!formData.budget || Number(formData.budget) <= 0) {
      errs.budget = 'Please specify a trip budget';
    }
    if (!formData.travelers || Number(formData.travelers) < 1) {
      errs.travelers = 'Must be at least 1 traveler';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitResult(null);

    const res = await submitToN8n(targetUrl, formData);
    const now = new Date().toLocaleTimeString();

    const record: SubmissionRecord = {
      id: `sub_${Date.now().toString(36)}`,
      timestamp: now,
      targetUrl,
      mode,
      status: res.success ? 'success' : res.isWaiting ? 'waiting' : 'error',
      fields: mapTripFormToN8nPayload(formData),
      message: res.message,
      statusCode: res.status,
    };

    setSubmitResult({
      success: res.success,
      status: res.status,
      message: res.message,
      isWaiting: res.isWaiting,
      timestamp: now,
    });

    setSubmitting(false);
    onSubmissionSuccess(record);
  };

  // Quick Preset Loader
  const handleLoadSample = (sampleType: 'luxury' | 'adventure' | 'quick') => {
    if (sampleType === 'luxury') {
      setFormData({
        name: 'Meghana Edula',
        email: 'meghanaedula19@gmail.com',
        startDate: '2026-11-01',
        returnDate: '2026-11-09',
        budget: 5200,
        travelers: 2,
        destination: 'Amalfi Coast & Capri, Italy',
        travelStyle: 'Luxury & Wellness',
        notes: 'Cliffside sea-view suite, private boat transfer to Capri, Michelin dining guide.',
      });
    } else if (sampleType === 'adventure') {
      setFormData({
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        startDate: '2026-10-20',
        returnDate: '2026-10-28',
        budget: 2800,
        travelers: 1,
        destination: 'Reykjavik & Golden Circle, Iceland',
        travelStyle: 'Adventure & Nature',
        notes: 'Glacier hiking, geothermal hot springs, and Northern Lights chasing.',
      });
    } else {
      setFormData({
        name: 'Jordan Chen',
        email: 'jordan.chen@example.com',
        startDate: '2026-12-10',
        returnDate: '2026-12-17',
        budget: 4000,
        travelers: 3,
        destination: 'Swiss Alps & Zermatt, Switzerland',
        travelStyle: 'Scenic Exploration',
        notes: 'Glacier Express train journey and panoramic alpine lodges.',
      });
    }
  };

  // Calculate duration
  const calculateDays = () => {
    if (!formData.startDate || !formData.returnDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.returnDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return null;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const tripDays = calculateDays();
  const perPersonBudget =
    formData.budget && formData.travelers
      ? Math.round(Number(formData.budget) / Number(formData.travelers))
      : 0;

  const mappedPayload = mapTripFormToN8nPayload(formData);

  return (
    <section id="planner" className="py-16 lg:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-3 uppercase tracking-wider">
            <span>01</span>
            <span>/</span>
            <span>n8n Intake Portal</span>
            <span>/</span>
            <span className="text-amber-700 font-semibold">Active Webhook</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mb-4 [text-wrap:balance]">
            Configure Your Journey Parameters
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Fill in your trip criteria below. Submissions directly trigger Meghana's n8n Travelling
            Agent workflow, evaluating schedule constraints, flights, and curated accommodations.
          </p>
        </div>

        {/* Endpoint Switcher & Preset Bar */}
        <div className="mb-8 p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider font-mono">
              Target Node:
            </span>
            <div className="inline-flex p-1 bg-stone-100 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setMode('production')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  mode === 'production'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Production (Live 200 OK)
              </button>
              <button
                type="button"
                onClick={() => setMode('test')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  mode === 'test'
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Test Mode (form-test)
              </button>
              <button
                type="button"
                onClick={() => setMode('custom')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  mode === 'custom'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Custom URL
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 hidden sm:inline">Quick Templates:</span>
            <button
              type="button"
              onClick={() => handleLoadSample('luxury')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors cursor-pointer"
            >
              Capri Luxury
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('adventure')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors cursor-pointer"
            >
              Iceland Adventure
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('quick')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors cursor-pointer"
            >
              Swiss Express
            </button>
          </div>
        </div>

        {mode === 'custom' && (
          <div className="mb-6 p-3 bg-stone-100 rounded-lg border border-stone-200">
            <label className="block text-xs font-mono text-stone-600 mb-1">
              Custom n8n Webhook / Form URL:
            </label>
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://your-instance.app.n8n.cloud/form/..."
              className="w-full text-xs font-mono px-3 py-2 bg-white rounded border border-stone-300 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        )}

        {/* Current Endpoint Notice */}
        {mode === 'test' && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-950">Form is in n8n Test Mode</p>
              <p className="text-amber-800 leading-relaxed">
                When sending to <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">/form-test/...</code>,
                ensure you have opened your n8n workflow canvas and clicked <strong>"Execute step"</strong> on the Form Trigger node.
                Alternatively, switch to <strong>Production Mode</strong> above to trigger the live automated workflow directly!
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: The Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* field-0: Name */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                    Full Name <span className="text-amber-600 font-mono text-[11px]">(field-0)</span> *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Meghana Edula"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none transition-colors ${
                      errors.name
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-stone-300 focus:border-amber-500'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                {/* field-1: Email */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                    Email Address <span className="text-amber-600 font-mono text-[11px]">(field-1)</span> *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. traveler@domain.com"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none transition-colors ${
                      errors.email
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-stone-300 focus:border-amber-500'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                {/* field-2: Starting Date */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                    Starting Date <span className="text-amber-600 font-mono text-[11px]">(field-2)</span> *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none transition-colors ${
                        errors.startDate
                          ? 'border-red-500 ring-1 ring-red-500'
                          : 'border-stone-300 focus:border-amber-500'
                      }`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>
                  )}
                </div>

                {/* field-3: Return Date */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                    Return Date <span className="text-amber-600 font-mono text-[11px]">(field-3)</span> *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none transition-colors ${
                        errors.returnDate
                          ? 'border-red-500 ring-1 ring-red-500'
                          : 'border-stone-300 focus:border-amber-500'
                      }`}
                    />
                  </div>
                  {errors.returnDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.returnDate}</p>
                  )}
                </div>

                {/* field-4: Budget */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                    Total Budget (USD) <span className="text-amber-600 font-mono text-[11px]">(field-4)</span> *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-400 font-mono text-sm">$</span>
                    <input
                      type="number"
                      min="100"
                      step="100"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="3500"
                      className={`w-full pl-8 pr-4 py-2.5 rounded-lg border text-sm font-mono tabular-nums text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none transition-colors ${
                        errors.budget
                          ? 'border-red-500 ring-1 ring-red-500'
                          : 'border-stone-300 focus:border-amber-500'
                      }`}
                    />
                  </div>
                  {/* Budget Presets */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {[1500, 3000, 5000, 8000].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setFormData({ ...formData, budget: preset })}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                          Number(formData.budget) === preset
                            ? 'bg-amber-100 border-amber-400 text-amber-900 font-medium'
                            : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>
                  {errors.budget && <p className="mt-1 text-xs text-red-600">{errors.budget}</p>}
                </div>

                {/* field-5: Number of Travels (Travelers) */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                    Number of Travelers <span className="text-amber-600 font-mono text-[11px]">(field-5)</span> *
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50/50">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            travelers: Math.max(1, Number(formData.travelers) - 1),
                          })
                        }
                        className="px-3.5 py-2.5 text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.travelers}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            travelers: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                        className="w-14 text-center py-2.5 text-sm font-mono font-bold text-stone-900 bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            travelers: Number(formData.travelers) + 1,
                          })
                        }
                        className="px-3.5 py-2.5 text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-stone-500">
                      {formData.travelers === 1 ? 'Solo Adventurer' : `${formData.travelers} Persons`}
                    </span>
                  </div>
                  {errors.travelers && (
                    <p className="mt-1 text-xs text-red-600">{errors.travelers}</p>
                  )}
                </div>
              </div>

              {/* Enrichment Fields: Destination & Travel Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pt-4 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                    Target Destination / Region
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 text-stone-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="e.g. Kyoto, Japan or Mediterranean Coast"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                    Travel Vibe & Style
                  </label>
                  <select
                    value={formData.travelStyle}
                    onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="Cultural Immersion">Cultural & Historic Immersion</option>
                    <option value="Luxury & Wellness">Luxury & Wellness Retreat</option>
                    <option value="Adventure & Nature">Adventure & Wilderness</option>
                    <option value="Culinary & Wine">Culinary, Wine & Markets</option>
                    <option value="Scenic Exploration">Scenic Rail & Coastal Drives</option>
                  </select>
                </div>
              </div>

              {/* Notes & Special Inquiries */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                  Special Notes & Travel Preferences
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Detail any flight departure preferences, hotel categories, dietary constraints, or pacing..."
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowPayloadPreview(!showPayloadPreview)}
                  className="text-xs font-mono text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{showPayloadPreview ? 'Hide n8n Payload' : 'Preview n8n Payload'}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer font-sans"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Triggering n8n Agent...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Itinerary Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Submitting Feedback State */}
              {submitResult && (
                <div
                  className={`mt-6 p-4 rounded-xl border text-sm transition-all ${
                    submitResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : submitResult.isWaiting
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : 'bg-red-50 border-red-200 text-red-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {submitResult.success ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : submitResult.isWaiting ? (
                      <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs font-mono tracking-wide uppercase">
                          {submitResult.success
                            ? 'Webhook Dispatched · HTTP 200 OK'
                            : submitResult.isWaiting
                            ? 'n8n Test Mode Waiting'
                            : 'Submission Notice'}
                        </span>
                        <span className="text-[11px] font-mono opacity-70">
                          {submitResult.timestamp}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed">{submitResult.message}</p>

                      {submitResult.isWaiting && (
                        <div className="mt-3 pt-2 border-t border-amber-200/80 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setMode('production');
                              setTimeout(() => {
                                const btn = document.querySelector('button[type="submit"]');
                                (btn as HTMLButtonElement)?.click();
                              }, 100);
                            }}
                            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded text-xs font-medium transition-colors cursor-pointer"
                          >
                            Switch to Live Production & Resend Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* Collapsible Payload Preview */}
            {showPayloadPreview && (
              <div className="mt-6 p-4 bg-stone-900 rounded-xl text-stone-100 text-xs font-mono overflow-x-auto border border-stone-800">
                <div className="flex items-center justify-between mb-2 text-stone-400">
                  <span>POST Payload to n8n ({targetUrl})</span>
                  <span>Multipart / URL-Encoded</span>
                </div>
                <pre className="text-amber-400">
                  {JSON.stringify(mappedPayload, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Right Column: Live Calculation & Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="font-display text-lg font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100 flex items-center justify-between">
                <span>Trip Overview</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>

              <div className="space-y-4 text-xs">
                {/* Destination */}
                <div className="flex items-start justify-between py-1">
                  <span className="text-stone-500">Destination</span>
                  <span className="font-semibold text-stone-900 text-right max-w-[180px] truncate">
                    {formData.destination || 'Open Exploration'}
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-between py-1 border-t border-stone-50">
                  <span className="text-stone-500">Duration</span>
                  <span className="font-mono font-medium text-stone-900 tabular-nums">
                    {tripDays !== null
                      ? `${tripDays} Days (${Math.max(0, tripDays - 1)} Nights)`
                      : 'Select dates'}
                  </span>
                </div>

                {/* Travelers */}
                <div className="flex items-center justify-between py-1 border-t border-stone-50">
                  <span className="text-stone-500">Travel Party</span>
                  <span className="font-mono font-medium text-stone-900 tabular-nums">
                    {formData.travelers} {formData.travelers === 1 ? 'Traveler' : 'Travelers'}
                  </span>
                </div>

                {/* Style */}
                <div className="flex items-center justify-between py-1 border-t border-stone-50">
                  <span className="text-stone-500">Travel Focus</span>
                  <span className="font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {formData.travelStyle}
                  </span>
                </div>

                {/* Total Budget */}
                <div className="flex items-center justify-between py-1 border-t border-stone-50">
                  <span className="text-stone-500">Total Budget</span>
                  <span className="font-mono font-bold text-stone-950 text-sm tabular-nums">
                    ${Number(formData.budget || 0).toLocaleString()} USD
                  </span>
                </div>

                {/* Per Person Calculation */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between">
                  <span className="text-stone-600 font-medium">Estimated Allocation</span>
                  <span className="font-mono font-bold text-amber-800 tabular-nums">
                    ~${perPersonBudget.toLocaleString()} / person
                  </span>
                </div>
              </div>

              {/* Status Note */}
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-500 leading-relaxed">
                Submitting this form connects to <strong className="text-stone-700">edulameghana19.app.n8n.cloud</strong>.
                Your travel profile is processed in real time by n8n workflow triggers.
              </div>
            </div>

            {/* Direct Form Fallback Link Card */}
            <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-600">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-stone-800">Native n8n Form Link</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
              </div>
              <p className="text-[11px] text-stone-500 mb-2 leading-relaxed">
                Prefer to view or test using the native n8n hosted interface directly?
              </p>
              <a
                href={DEFAULT_PRODUCTION_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-amber-700 hover:text-amber-900 underline truncate max-w-full"
              >
                Open in n8n Cloud ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
