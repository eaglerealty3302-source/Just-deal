import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, PieChart, Settings, ShieldCheck, HelpCircle, ChevronRight } from "lucide-react";

const sidebarItems = [
  { label: "All Deals", id: "all", icon: LayoutDashboard },
  { label: "Pipeline Report", id: "pipeline", icon: FileText },
  { label: "Analytics", id: "analytics", icon: PieChart },
];

const bottomItems = [
  { label: "Security", id: "security", icon: ShieldCheck },
  { label: "Settings", id: "settings", icon: Settings },
  { label: "Support", id: "support", icon: HelpCircle },
];

interface DealsPageSidebarProps {
  active: string;
  onSelect: (id: string) => void;
}

export function DealsPageSidebar({ active, onSelect }: DealsPageSidebarProps) {
  return (
    <aside className="w-64 border-r border-border/50 pt-8 px-4 flex-shrink-0 flex flex-col bg-card/30">
      <div className="flex-1">
        <div className="px-4 mb-6">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Main Menu</span>
        </div>
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "group flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                active === item.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5", active === item.id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors")} />
                {item.label}
              </div>
              {active === item.id && <ChevronRight className="h-4 w-4 opacity-50" />}
            </button>
          ))}
        </nav>
      </div>

      <div className="pb-8 border-t border-border/50 pt-6">
        <div className="px-4 mb-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">System</span>
        </div>
        <nav className="space-y-1">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              className="group flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all duration-200"
            >
              <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="mt-8 px-4 py-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/10">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">Pro Plan</p>
          <p className="text-[10px] text-muted-foreground mt-1">Unlock advanced analytics and unlimited deals.</p>
          <button className="mt-3 w-full py-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-lg hover:bg-primary/90 transition-all">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
