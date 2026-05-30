import { useState, useEffect } from 'react';
import { Claim } from '@/lib/types';

// STUB: returns mock data
// TODO: wire to Supabase Realtime in TASK 7
export function useVerification() {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for one completed verification (blue badge, 0.94 confidence)
  const MOCK_CLAIM: Claim = {
    id: 'mock-123',
    input_type: 'url',
    input_content: 'https://example.com/article',
    extracted_claim: 'Scientists have discovered a new species of butterfly in the Amazon rainforest.',
    category: 'Science',
    track_context: 'consumer',
    status: 'completed',
    agent_progress: 'Verification completed',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T14:20:00Z',
    verification: {
      id: 'v-mock-123',
      claim_id: 'mock-123',
      badge: 'blue' as const,
      confidence_score: 0.94,
      verdict_summary: 'Verified: Multiple independent sources confirm the discovery.',
      detailed_analysis: 'Three scientific journals and two official biodiversity databases confirm the existence of this new species.',
      primary_sources_count: 2,
      secondary_sources_count: 3,
      contradictions_found: 0,
      fact_checks_found: 2,
      processing_time_ms: 1250,
      model_used: 'veritas-large-v1',
      created_at: '2024-01-15T14:20:00Z',
    },
  };

  // Simulate fetching verification data
  const fetchVerification = async (input: string, type: 'url' | 'text' | 'topic') => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return mock data
      setClaim(MOCK_CLAIM);
    } catch (err) {
      setError('Failed to fetch verification data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    claim,
    loading,
    error,
    fetchVerification,
  };
}