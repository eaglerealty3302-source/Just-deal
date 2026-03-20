import { FileText, Upload, Share2, MoreHorizontal, ArrowLeft, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { DealWithProperty } from "@/types/deals";
import { cn } from "@/lib/utils";

interface DealHeaderProps {
  deal: DealWithProperty;
}

export function DealHeader({ deal }: DealHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-8 border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex items-start gap-6">
        <Link to="/" className="mt-1 p-2 hover:bg-secondary rounded-full transition-colors group">
          <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
        </Link>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20 uppercase tracking-wider">
              {deal.deal_id}
            </span>
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
              deal.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
              deal.status === "Closed" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
              "bg-amber-500/10 text-amber-500 border-amber-500/20"
            )}>
              {deal.status}
            </span>
          </div>
          
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground flex items-center gap-3">
            {deal.deal_name}
          </h1>
          
          <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-primary/40" />
              <span>{deal.properties?.total_units || 0} Units</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary/40" />
              <span>{deal.properties?.market || "Location pending"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6 md:mt-0">
        <Button variant="outline" size="sm" className="rounded-full border-border/50 hover:bg-secondary">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" size="sm" className="rounded-full border-border/50 hover:bg-secondary">
          <FileText className="h-4 w-4 mr-2" />
          Generate Model
        </Button>
        <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
        <button className="p-2 hover:bg-secondary rounded-full transition-colors ml-2">
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
