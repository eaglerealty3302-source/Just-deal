import { MoreVertical, ChevronDown, Building2, MapPin, Calendar, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { DealWithProperty } from "@/types/deals";

interface DealsTableProps {
  deals: DealWithProperty[];
}

export function DealsTable({ deals }: DealsTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-secondary/30">
            <th className="text-left font-semibold text-muted-foreground px-6 py-4 w-[320px] uppercase tracking-wider text-[10px]">Deal Name & Location</th>
            <th className="text-left font-semibold text-muted-foreground px-4 py-4 w-[120px] uppercase tracking-wider text-[10px]">Deal ID</th>
            <th className="text-left font-semibold text-muted-foreground px-4 py-4 w-[140px] uppercase tracking-wider text-[10px]">Status</th>
            <th className="text-left font-semibold text-muted-foreground px-4 py-4 uppercase tracking-wider text-[10px]">Market</th>
            <th className="text-right font-semibold text-muted-foreground px-4 py-4 w-[100px] uppercase tracking-wider text-[10px]">Units</th>
            <th className="text-left font-semibold text-muted-foreground px-4 py-4 w-[120px] uppercase tracking-wider text-[10px]">Fund</th>
            <th className="text-left font-semibold text-muted-foreground px-6 py-4 w-[140px] uppercase tracking-wider text-[10px]">Bid Due Date</th>
            <th className="text-center font-semibold text-muted-foreground px-4 py-4 w-[60px] uppercase tracking-wider text-[10px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {deals.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-24">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-secondary/50 rounded-full">
                    <Building2 className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">No deals found in your pipeline.</p>
                  <button className="text-primary text-xs font-bold hover:underline">Create your first deal</button>
                </div>
              </td>
            </tr>
          ) : (
            deals.map((deal) => (
              <tr
                key={deal.id}
                className="group transition-all duration-200 hover:bg-primary/[0.02] cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform shadow-sm">
                      <Building2 className="h-5 w-5 text-primary/70" />
                    </div>
                    <div className="flex flex-col">
                      <Link
                        to={`/deals/${deal.id}`}
                        className="font-bold text-foreground hover:text-primary transition-colors text-base"
                      >
                        {deal.deal_name}
                      </Link>
                      <div className="flex items-center gap-1 text-muted-foreground text-[11px] mt-0.5">
                        <MapPin className="h-3 w-3" />
                        <span>{deal.properties?.market || "Location pending"}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono text-xs bg-secondary/50 px-2 py-1 rounded-md border border-border/50 text-muted-foreground">
                    {deal.deal_id}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      deal.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                      deal.status === "Closed" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                      "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      {deal.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <Layers className="h-3.5 w-3.5 text-primary/40" />
                    {deal.properties?.market || "—"}
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="font-mono font-bold text-foreground">{deal.properties?.total_units ?? "—"}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-muted-foreground font-medium">{deal.fund || "—"}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="font-medium">{deal.bid_due_date || "—"}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
