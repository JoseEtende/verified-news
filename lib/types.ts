export type BadgeColor = 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'gray';

export type ClaimStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type TrackContext = 'consumer' | 'track1_gtm' | 'track3_security';

export type CredibilityTier = 'high' | 'medium' | 'low' | 'unverified';

export interface Claim {
  id: string;
  input_type: 'url' | 'text' | 'topic';
  input_content: string;
  extracted_claim?: string;
  category?: string;
  track_context: TrackContext;
  status: ClaimStatus;
  agent_progress: string;
  created_at: string;
  updated_at: string;
  verification?: Verification;
}

export interface Verification {
  id: string;
  claim_id: string;
  badge: BadgeColor;
  confidence_score: number;
  verdict_summary: string;
  detailed_analysis: string;
  primary_sources_count: number;
  secondary_sources_count: number;
  contradictions_found: number;
  fact_checks_found: number;
  processing_time_ms: number;
  model_used: string;
  created_at: string;
  sources?: Source[];
}

export interface Source {
  id: string;
  verification_id: string;
  url: string;
  title: string;
  domain: string;
  source_type: 'news' | 'official' | 'fact_check' | 'social' | 'academic' | 'regulatory' | 'competitor';
  credibility_tier: CredibilityTier;
  publication_date?: string;
  author?: string;
  extracted_snippet: string;
  relevance_score: number;
  bright_data_tool_used: string;
}

export interface Alert {
  id: string;
  monitor_id: string;
  alert_type: 'status_change' | 'new_source' | 'contradiction' | 'fact_check_update';
  old_badge?: BadgeColor;
  new_badge?: BadgeColor;
  description: string;
  is_read: boolean;
  created_at: string;
}

export interface BadgeConfig {
  color: BadgeColor;
  hex: string;
  label: string;
  shortLabel: string;
  description: string;
}

export const BADGE_CONFIG: Record<BadgeColor, BadgeConfig> = {
  blue:   { color: 'blue',   hex: '#3B82F6', label: 'Verified',      shortLabel: 'VRF', description: '3+ independent credible sources, no contradictions' },
  green:  { color: 'green',  hex: '#22C55E', label: 'Confirmed',     shortLabel: 'CFM', description: 'Official primary source directly confirms' },
  yellow: { color: 'yellow', hex: '#EAB308', label: 'Partially True', shortLabel: 'PTR', description: 'Core fact true but outdated or missing context' },
  orange: { color: 'orange', hex: '#F97316', label: 'Misleading',    shortLabel: 'MIS', description: 'Framing exaggerates or cherry-picks data' },
  red:    { color: 'red',    hex: '#EF4444', label: 'False',         shortLabel: 'FLS', description: 'Directly contradicted by credible sources' },
  gray:   { color: 'gray',   hex: '#6B7280', label: 'Unverifiable',  shortLabel: 'UNV', description: 'Insufficient public data to render verdict' },
};