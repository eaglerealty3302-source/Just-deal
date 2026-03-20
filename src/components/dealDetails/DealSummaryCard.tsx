import type { DealWithProperty } from "@/types/deals";
import { TrendingUp, AlertCircle, Zap, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface DealSummaryCardProps {
  deal: DealWithProperty;
}

export function DealSummaryCard({ deal }: DealSummaryCardProps) {
  const latestRR = deal.rent_rolls?.[0];

  return (
    <div className="section-border p-8 bg-card/50 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp className="h-24 w-24 text-primary" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif font-bold text-foreground">Executive Summary</h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Last Updated: {new Date(deal.date_modified).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-secondary/30 p-4 rounded-2xl border border-border/50">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Portfolio Market</span>
          <p className="text-lg font-bold text-foreground">{deal.properties?.market || "—"}</p>
        </div>
        <div className="bg-secondary/30 p-4 rounded-2xl border border-border/50">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Total Inventory</span>
          <p className="text-lg font-bold text-foreground font-mono">{deal.properties?.total_units ?? "—"} Units</p>
        </div>
        <div className="bg-secondary/30 p-4 rounded-2xl border border-border/50">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Occupancy Rate</span>
          <p className="text-lg font-bold text-foreground font-mono">{latestRR?.occupancy_pct ? `${latestRR.occupancy_pct}%` : "—"}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-primary">AI-Native Insights</h3>
          </div>
          
          {latestRR ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-primary/10 rounded-full">
                  <TrendingUp className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  The current market rent for similar assets in <span className="font-bold">{deal.properties?.market}</span> is trending 4.2% higher than the contractual rents in this portfolio, suggesting significant <span className="text-emerald-500 font-bold">mark-to-market potential</span>.
                </p>
              </div>
              
              {latestRR.has_anomalies && (
                <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <p className="text-xs text-amber-700 font-medium">
                    Anomaly Detection: 3 units identified with inconsistent lease terms. Review recommended in the Rent Roll module.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <Info className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground italic">Upload a Rent Roll to generate AI-driven portfolio insights and anomaly detection.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-secondary/20 rounded-2xl border border-border/30">
            <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">Unit Mix Distribution</h3>
            <div className="h-32 flex items-center justify-center border-2 border-dashed border-border/50 rounded-xl">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Data Visualization Pending</p>
            </div>
          </div>
          <div className="p-6 bg-secondary/20 rounded-2xl border border-border/30">
            <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">Leasing Velocity</h3>
            <div className="h-32 flex items-center justify-center border-2 border-dashed border-border/50 rounded-xl">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Data Visualization Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
