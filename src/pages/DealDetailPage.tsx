import { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { DealHeader } from "@/components/dealDetails/DealHeader";
import { DealTabs } from "@/components/dealDetails/DealTabs";
import { DealSummaryCard } from "@/components/dealDetails/DealSummaryCard";
import { DealInfoCard } from "@/components/dealDetails/DealInfoCard";
import { DealActionsCard } from "@/components/dealDetails/DealActionsCard";
import { DealDetailsForm } from "@/components/dealDetails/DealDetailsForm";
import { RentRollModule } from "@/features/rentRoll/RentRollModule";
import { FirstPassTab } from "@/components/dealDetails/FirstPassTab";
import { LocationCard } from "@/components/dealDetails/LocationCard";
import { CharacteristicsCard } from "@/components/dealDetails/CharacteristicsCard";
import { AmenitiesCard } from "@/components/dealDetails/AmenitiesCard";
import { ValuationCard } from "@/components/dealDetails/ValuationCard";
import { TransactionInfoCard } from "@/components/dealDetails/TransactionInfoCard";
import { PreviousSaleCard } from "@/components/dealDetails/PreviousSaleCard";
import { CommentsCard } from "@/components/dealDetails/CommentsCard";
import { useDeal } from "@/hooks/useDeals";
import { cn } from "@/lib/utils";
import { ChevronRight, Layout, FileText, BarChart3 } from "lucide-react";

export default function DealDetailPage() {
  const { dealId } = useParams<{ dealId: string }>();
  const [searchParams] = useSearchParams();
  const defaultSection = searchParams.get("section") || "summary";
  const [activeTab, setActiveTab] = useState("overview");
  const [overviewSection, setOverviewSection] = useState(defaultSection);

  const { data: deal, isLoading } = useDeal(dealId);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm font-medium">Loading deal details...</p>
        </div>
      </AppLayout>
    );
  }

  if (!deal) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-card p-12 rounded-3xl border border-border/50 shadow-xl">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
              <Layout className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-2">Deal Not Found</h2>
            <p className="text-muted-foreground mb-6">The deal you're looking for doesn't exist or has been moved.</p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              Back to Pipeline
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const overviewSections = [
    { id: "summary", label: "Deal Summary", icon: Layout },
    { id: "details", label: "Deal Details", icon: FileText },
    { id: "comps", label: "Sales Comps", icon: BarChart3 },
  ];

  const isRentRollView = activeTab.startsWith("rent-roll");

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col min-w-0 bg-background/50" id="page-top">
        <DealHeader deal={deal} />
        <div className="px-6">
          <DealTabs active={activeTab} onSelect={setActiveTab} />
        </div>

        {activeTab === "overview" && (
          <div className="flex-1 flex min-h-0">
            <div className="w-64 border-r border-border/50 pt-8 px-4 flex-shrink-0 bg-card/30">
              <div className="px-4 mb-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sections</span>
              </div>
              <nav className="space-y-1">
                {overviewSections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setOverviewSection(s.id)}
                    className={cn(
                      "flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                      overviewSection === s.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <s.icon className={cn("h-4 w-4", overviewSection === s.id ? "text-primary-foreground" : "text-muted-foreground")} />
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 overflow-auto bg-background/30">
              {overviewSection === "summary" && (
                <div className="p-8 max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 mb-8">
                    <div className="space-y-8">
                      <DealSummaryCard deal={deal} />
                      <LocationCard deal={deal} />
                      <CharacteristicsCard deal={deal} />
                      <AmenitiesCard deal={deal} />
                      <ValuationCard />
                      <TransactionInfoCard deal={deal} />
                      <PreviousSaleCard />
                      <CommentsCard deal={deal} />
                    </div>
                    <div className="space-y-8">
                      <DealInfoCard deal={deal} />
                      <DealActionsCard />
                      
                      <div className="bg-gradient-to-br from-primary to-primary/80 p-6 rounded-3xl text-primary-foreground shadow-xl shadow-primary/20">
                        <h3 className="text-lg font-bold mb-2">AI Insights</h3>
                        <p className="text-xs opacity-90 leading-relaxed">
                          Based on current market trends in {deal.properties?.market || "this area"}, this property shows a 12% higher potential yield compared to similar assets in the pipeline.
                        </p>
                        <button className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all">
                          View Full Analysis
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {overviewSection === "details" && (
                <div className="p-8 max-w-5xl mx-auto">
                  <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-xl">
                    <DealDetailsForm deal={deal} />
                  </div>
                </div>
              )}
              {overviewSection === "comps" && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                    <BarChart3 className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2">Sales Comps Pending</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">We're currently aggregating market data for this location. Check back soon.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {isRentRollView && dealId && (
          <div className="flex-1 flex flex-col overflow-hidden bg-background/30">
            <RentRollModule
              dealId={dealId}
              subView={activeTab}
              onNavigate={setActiveTab}
            />
          </div>
        )}

        {activeTab === "firstpass" && dealId && (
          <FirstPassTab dealId={dealId} />
        )}

        {!isRentRollView && activeTab !== "overview" && activeTab !== "firstpass" && (
          <div className="flex-1 flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">Module Coming Soon</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              {activeTab === "operating-statement" && "Operating Statement analysis is currently in development."}
              {activeTab === "sharing" && "Collaboration and sharing features are being finalized."}
            </p>
            <button onClick={() => setActiveTab("overview")} className="mt-6 text-primary font-bold hover:underline">
              Return to Overview
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
