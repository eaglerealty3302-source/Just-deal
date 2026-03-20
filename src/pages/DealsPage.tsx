import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Filter, Download, Plus, LayoutGrid, List, ArrowUpRight, TrendingUp, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout/AppLayout";
import { DealsPageSidebar } from "@/components/deals/DealsPageSidebar";
import { DealsTable } from "@/components/deals/DealsTable";
import { AddDealModal } from "@/components/deals/AddDealModal";
import { useDeals } from "@/hooks/useDeals";
import { cn } from "@/lib/utils";

export default function DealsPage() {
  const [search, setSearch] = useState("");
  const [sidebarActive, setSidebarActive] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { data: deals = [], isLoading } = useDeals();

  const filteredDeals = useMemo(() => {
    if (!search) return deals;
    const q = search.toLowerCase();
    return deals.filter(
      (d) => d.deal_name.toLowerCase().includes(q) || d.deal_id.includes(q)
    );
  }, [search, deals]);

  const stats = [
    { label: "Total Deals", value: deals.length, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Pipeline", value: "$124.5M", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Team Members", value: "12", icon: Users, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Avg. Yield", value: "6.8%", icon: ArrowUpRight, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <AppLayout>
      <DealsPageSidebar active={sidebarActive} onSelect={setSidebarActive} />
      <div className="flex-1 flex flex-col min-w-0 bg-background/50">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 pt-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card border border-border/50 p-4 rounded-2xl card-hover">
              <div className="flex items-center justify-between mb-2">
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold font-mono">{stat.value}</span>
                <span className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Pipeline Overview</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage and track your real estate investment opportunities.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-secondary/50 p-1 rounded-lg border border-border/50 mr-2">
              <button 
                onClick={() => setViewMode("list")}
                className={cn("p-1.5 rounded-md transition-all", viewMode === "list" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                <List className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 rounded-md transition-all", viewMode === "grid" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            <Button variant="outline" size="sm" className="rounded-full border-border/50 hover:bg-secondary">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="rounded-full border-border/50 hover:bg-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => setModalOpen(true)} className="rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4 mr-2" />
              New Deal
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 mb-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={1.5} />
            <Input
              placeholder="Search by Deal Name, ID, or Location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 bg-card border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Table/Content */}
        <div className="flex-1 px-6 pb-6 overflow-hidden">
          <div className="h-full bg-card border border-border/50 rounded-2xl overflow-hidden shadow-xl shadow-black/5">
            {isLoading ? (
              <div className="flex-1 h-full flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground text-sm font-medium">Analyzing deals...</p>
              </div>
            ) : (
              <div className="h-full overflow-auto">
                <DealsTable deals={filteredDeals} />
              </div>
            )}
          </div>
        </div>
      </div>

      <AddDealModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AppLayout>
  );
}
