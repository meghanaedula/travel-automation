import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TripFormSection } from './components/TripFormSection';
import { DestinationsGrid } from './components/DestinationsGrid';
import { WorkflowExplainer } from './components/WorkflowExplainer';
import { Testimonials } from './components/Testimonials';
import { WebhookConsole } from './components/WebhookConsole';
import { Footer } from './components/Footer';
import {
  SubmissionRecord,
  WebhookCheckResult,
  DEFAULT_PRODUCTION_URL,
} from './types';
import { checkN8nEndpoint } from './services/n8nService';

export default function App() {
  const [monitorOpen, setMonitorOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<'production' | 'test' | 'custom'>('production');
  const [endpointStatus, setEndpointStatus] = useState<WebhookCheckResult | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<{
    name: string;
    budget: number;
    style: string;
  } | null>(null);

  // Check n8n endpoint on mount
  useEffect(() => {
    let isMounted = true;
    checkN8nEndpoint(DEFAULT_PRODUCTION_URL).then((res) => {
      if (isMounted) {
        setEndpointStatus(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleScrollToForm = () => {
    const el = document.getElementById('planner');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewSubmission = (record: SubmissionRecord) => {
    setSubmissions((prev) => [record, ...prev]);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Navigation */}
      <Navbar
        endpointStatus={endpointStatus}
        currentMode={currentMode}
        onOpenMonitor={() => setMonitorOpen(true)}
        onScrollToForm={handleScrollToForm}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onScrollToForm={handleScrollToForm}
          onOpenMonitor={() => setMonitorOpen(true)}
          isN8nLive={Boolean(endpointStatus?.ok)}
        />

        <TripFormSection
          onSubmissionSuccess={handleNewSubmission}
          selectedDestination={selectedDestination}
        />

        <DestinationsGrid
          onSelectDestination={(dest) => {
            setSelectedDestination(dest);
          }}
        />

        <WorkflowExplainer />

        <Testimonials />
      </main>

      {/* Footer */}
      <Footer
        onOpenMonitor={() => setMonitorOpen(true)}
        onScrollToTop={handleScrollToTop}
      />

      {/* Webhook & Payload Diagnostic Modal */}
      <WebhookConsole
        isOpen={monitorOpen}
        onClose={() => setMonitorOpen(false)}
        submissions={submissions}
        onNewSubmission={handleNewSubmission}
      />
    </div>
  );
}
