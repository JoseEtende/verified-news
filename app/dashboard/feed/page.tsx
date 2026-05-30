'use client';

import DashboardSidebar from '@/components/layout/DashboardSidebar';
import ClaimCard from '@/components/feed/ClaimCard';
import VerifyModal from '@/components/verification/VerifyModal';
import { Claim, BadgeColor } from '@/lib/types';
import { useState } from 'react';
import { Shield } from 'lucide-react';

const MOCK_CLAIMS: Claim[] = [
  {
    id: '1', input_type: 'url', input_content: 'https://example.com/article1',
    extracted_claim: 'Scientists have discovered a new species of butterfly in the Amazon rainforest.',
    category: 'Science', track_context: 'consumer', status: 'completed',
    agent_progress: 'Verification completed', created_at: '2024-01-15T10:30:00Z', updated_at: '2024-01-15T14:20:00Z',
    verification: {
      id: 'v1', claim_id: '1', badge: 'blue', confidence_score: 0.94,
      verdict_summary: 'Verified: Multiple independent sources confirm the discovery.',
      detailed_analysis: 'Three scientific journals and two official biodiversity databases confirm the existence of this new species.',
      primary_sources_count: 2, secondary_sources_count: 3, contradictions_found: 0,
      fact_checks_found: 2, processing_time_ms: 1250, model_used: 'google/gemma-4-31b-it', created_at: '2024-01-15T14:20:00Z',
    },
  },
  {
    id: '2', input_type: 'text', input_content: 'The new government policy will reduce taxes for all citizens by 20%.',
    extracted_claim: 'The new government policy will reduce taxes for all citizens by 20%.',
    category: 'Politics', track_context: 'consumer', status: 'completed',
    agent_progress: 'Verification completed', created_at: '2024-01-14T09:15:00Z', updated_at: '2024-01-14T16:45:00Z',
    verification: {
      id: 'v2', claim_id: '2', badge: 'green', confidence_score: 0.87,
      verdict_summary: 'Confirmed: Official government document directly confirms the policy details.',
      detailed_analysis: 'The official gazette published by the Ministry of Finance confirms the tax reduction policy.',
      primary_sources_count: 1, secondary_sources_count: 2, contradictions_found: 0,
      fact_checks_found: 1, processing_time_ms: 980, model_used: 'google/gemma-4-31b-it', created_at: '2024-01-14T16:45:00Z',
    },
  },
  {
    id: '3', input_type: 'topic', input_content: 'AI regulation',
    extracted_claim: 'Recent studies show that AI regulation will stifle innovation in the tech sector.',
    category: 'Technology', track_context: 'track1_gtm', status: 'completed',
    agent_progress: 'Verification completed', created_at: '2024-01-13T11:00:00Z', updated_at: '2024-01-13T15:30:00Z',
    verification: {
      id: 'v3', claim_id: '3', badge: 'yellow', confidence_score: 0.65,
      verdict_summary: 'Partially True: While some regulations may impact certain aspects, overall innovation continues.',
      detailed_analysis: 'Academic research shows mixed effects - some compliance costs exist but innovation adapts and continues.',
      primary_sources_count: 1, secondary_sources_count: 4, contradictions_found: 1,
      fact_checks_found: 3, processing_time_ms: 2100, model_used: 'google/gemma-4-31b-it', created_at: '2024-01-13T15:30:00Z',
    },
  },
  {
    id: '4', input_type: 'url', input_content: 'https://example.com/article4',
    extracted_claim: 'A celebrity endorsed a new cryptocurrency that guaranteed 100% returns.',
    category: 'Entertainment', track_context: 'consumer', status: 'completed',
    agent_progress: 'Verification completed', created_at: '2024-01-12T14:20:00Z', updated_at: '2024-01-12T18:10:00Z',
    verification: {
      id: 'v4', claim_id: '4', badge: 'orange', confidence_score: 0.72,
      verdict_summary: 'Misleading: The celebrity did mention the crypto but did not guarantee returns.',
      detailed_analysis: 'The celebrity\'s actual statement was about the technology\'s potential, not a financial guarantee.',
      primary_sources_count: 1, secondary_sources_count: 3, contradictions_found: 2,
      fact_checks_found: 4, processing_time_ms: 1750, model_used: 'google/gemma-4-31b-it', created_at: '2024-01-12T18:10:00Z',
    },
  },
  {
    id: '5', input_type: 'text', input_content: 'The moon landing was faked in a Hollywood studio.',
    extracted_claim: 'The moon landing was faked in a Hollywood studio.',
    category: 'Conspiracy', track_context: 'consumer', status: 'completed',
    agent_progress: 'Verification completed', created_at: '2024-01-11T08:45:00Z', updated_at: '2024-01-11T12:00:00Z',
    verification: {
      id: 'v5', claim_id: '5', badge: 'red', confidence_score: 0.96,
      verdict_summary: 'False: Directly contradicted by multiple independent sources including moon rock samples.',
      detailed_analysis: 'NASA telemetry, third-party tracking data, and lunar samples all confirm the authenticity of the moon landings.',
      primary_sources_count: 3, secondary_sources_count: 5, contradictions_found: 5,
      fact_checks_found: 6, processing_time_ms: 1100, model_used: 'google/gemma-4-31b-it', created_at: '2024-01-11T12:00:00Z',
    },
  },
  {
    id: '6', input_type: 'topic', input_content: 'Ancient alien civilizations',
    extracted_claim: 'There is insufficient evidence to confirm or deny the existence of ancient alien civilizations visiting Earth.',
    category: 'History', track_context: 'consumer', status: 'completed',
    agent_progress: 'Verification completed', created_at: '2024-01-10T16:30:00Z', updated_at: '2024-01-10T16:35:00Z',
    verification: {
      id: 'v6', claim_id: '6', badge: 'gray', confidence_score: 0.30,
      verdict_summary: 'Unverifiable: Insufficient public data to render a verdict on this topic.',
      detailed_analysis: 'While there are intriguing artifacts, no credible scientific evidence supports or refutes the claim.',
      primary_sources_count: 0, secondary_sources_count: 2, contradictions_found: 0,
      fact_checks_found: 0, processing_time_ms: 800, model_used: 'google/gemma-4-31b-it', created_at: '2024-01-10T16:35:00Z',
    },
  },
];

const FILTERS: { value: 'all' | BadgeColor; label: string; color: string; activeColor: string }[] = [
  { value: 'all', label: 'All', color: 'border-[var(--color-border)] text-[var(--color-text-secondary)]', activeColor: 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' },
  { value: 'blue', label: 'Verified', color: 'border-blue-200 text-blue-600 bg-blue-50', activeColor: 'bg-blue-500 text-white border-blue-500' },
  { value: 'green', label: 'Confirmed', color: 'border-green-200 text-green-600 bg-green-50', activeColor: 'bg-green-500 text-white border-green-500' },
  { value: 'yellow', label: 'Partially True', color: 'border-yellow-200 text-yellow-600 bg-yellow-50', activeColor: 'bg-yellow-500 text-white border-yellow-500' },
  { value: 'orange', label: 'Misleading', color: 'border-orange-200 text-orange-600 bg-orange-50', activeColor: 'bg-orange-500 text-white border-orange-500' },
  { value: 'red', label: 'False', color: 'border-red-200 text-red-600 bg-red-50', activeColor: 'bg-red-500 text-white border-red-500' },
  { value: 'gray', label: 'Unverifiable', color: 'border-gray-200 text-gray-600 bg-gray-50', activeColor: 'bg-gray-500 text-white border-gray-500' },
];

export default function FeedPage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | BadgeColor>('all');

  const filteredClaims = activeFilter === 'all' 
    ? MOCK_CLAIMS 
    : MOCK_CLAIMS.filter(c => c.verification?.badge === activeFilter);

  return (
    <>
      <DashboardSidebar activeItem="feed" />
      <div className="flex-1 p-6 overflow-auto">
        {/* Hero */}
        <div className="card p-8 mb-6 text-center bg-gradient-to-br from-[var(--color-primary-light)] to-white">
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
            Is it true?
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            AI agents verify news claims against live web data.
          </p>
          <button
            onClick={() => setModalIsOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Verify a claim
          </button>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              { label: 'Verified', color: 'bg-blue-500' },
              { label: 'Confirmed', color: 'bg-green-500' },
              { label: 'Partially True', color: 'bg-yellow-500' },
              { label: 'Misleading', color: 'bg-orange-500' },
              { label: 'False', color: 'bg-red-500' },
              { label: 'Unverifiable', color: 'bg-gray-400' },
            ].map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                <span className={`w-2 h-2 rounded-full ${b.color}`}></span>
                {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                activeFilter === f.value ? f.activeColor : f.color
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredClaims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>

        {filteredClaims.length === 0 && (
          <div className="text-center py-12 text-[var(--color-muted)]">
            No claims match this filter
          </div>
        )}

        <div className="text-center mt-8">
          <button className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors cursor-pointer">
            Load more
          </button>
        </div>
      </div>

      <VerifyModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
    </>
  );
}
