import type { EconomicEvent } from "@/data/demo";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type SummaryMetric = {
  label: string;
  value: string;
  trend: string;
  tone: "success" | "accent" | "secondary" | "warning" | "danger";
};

export type AnalysisSummary = {
  metrics: SummaryMetric[];
  totalEstimatedMdp: number;
  activeEvents: number;
  reachablePymes: number;
  topBoroughs: string[];
  source: "synthetic";
};

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchEvents(): Promise<EconomicEvent[] | null> {
  return fetchJson<EconomicEvent[]>("/api/events");
}

export async function fetchAnalysisSummary(): Promise<AnalysisSummary | null> {
  return fetchJson<AnalysisSummary>("/api/analysis/summary");
}
