export type BracesObservation = {
  timestamp?: string;
  upperArchVisible: boolean;
  lowerArchVisible: boolean;
  confidence: number;
  visibleBrackets: number;
};

export type BracesMetrics = {
  score: number;
  visibility: number;
  confidence: number;
  visibleBrackets: number;
  status: 'needs-review' | 'steady' | 'strong-signal';
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function calculateBracesMetrics(observation: BracesObservation): BracesMetrics {
  const confidence = clamp(observation.confidence, 0, 1);
  const visibility = clamp(
    ((observation.upperArchVisible ? 0.5 : 0) + (observation.lowerArchVisible ? 0.5 : 0) + Math.min(observation.visibleBrackets / 12, 0.5))
      / 1.5,
    0,
    1
  );
  const score = Math.round((confidence * 0.65 + visibility * 0.35) * 100);

  const status = score >= 74 ? 'strong-signal' : score >= 46 ? 'steady' : 'needs-review';

  return {
    score,
    visibility: Number(visibility.toFixed(2)),
    confidence: Number(confidence.toFixed(2)),
    visibleBrackets: Math.max(0, Math.round(observation.visibleBrackets)),
    status
  };
}

export function summarizeObservation(observations: BracesObservation[]) {
  if (!observations.length) {
    return {
      averageScore: 0,
      averageConfidence: 0,
      averageVisibility: 0,
      totalVisibleBrackets: 0,
      status: 'needs-review' as const
    };
  }

  const metrics = observations.map(calculateBracesMetrics);
  const averageScore = metrics.reduce((sum, item) => sum + item.score, 0) / metrics.length;
  const averageConfidence = metrics.reduce((sum, item) => sum + item.confidence, 0) / metrics.length;
  const averageVisibility = metrics.reduce((sum, item) => sum + item.visibility, 0) / metrics.length;
  const totalVisibleBrackets = metrics.reduce((sum, item) => sum + item.visibleBrackets, 0);
  const status = averageScore >= 74 ? 'strong-signal' : averageScore >= 46 ? 'steady' : 'needs-review';

  return {
    averageScore: Number(averageScore.toFixed(2)),
    averageConfidence: Number(averageConfidence.toFixed(2)),
    averageVisibility: Number(averageVisibility.toFixed(2)),
    totalVisibleBrackets,
    status
  };
}
