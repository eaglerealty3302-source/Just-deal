import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Layout, Table, PieChart, Share2, Zap, FileText } from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: Layout },
  {
    id: "rent-roll",
    label: "Rent Roll",
    icon: Table,
    subItems: [
      { id: "rent-roll-dashboard", label: "Rent Roll Dashboard" },
      { id: "rent-roll-floorplan", label: "Floor Plan Summary" },
      { id: "rent-roll-table", label: "Rent Roll" },
      { id: "rent-roll-comps", label: "Rent Roll Comps" },
      { id: "rent-roll-manage", label: "Manage Rent Rolls" },
    ],
  },
  { id: "operating-statement", label: "Operating Statement", icon: FileText },
  { id: "firstpass", label: "FirstPass", icon: Zap },
  { id: "sharing", label: "Sharing", icon: Share2 },
];

interface DealTabsProps {
  active: string;
  onSelect: (id: string) => void;
}

export function DealTabs({ active, onSelect }: DealTabsProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isRentRollActive = active.startsWith("rent-roll");

  return (
    <div className="border-b border-border/50">
      <nav className="flex gap-2 -mb-px">
        {tabs.map((tab) => {
          const isActive = tab.subItems
            ? isRentRollActive
            : active === tab.id;

          return (
            <div key={tab.id} className="relative" ref={tab.subItems ? dropdownRef : undefined}>
              <button
                onClick={() => {
                  if (tab.subItems) {
                    setOpenDropdown(openDropdown === tab.id ? null : tab.id);
                  } else {
                    onSelect(tab.id);
                    setOpenDropdown(null);
                  }
                }}
                className={cn(
                  "px-6 py-4 text-sm font-bold border-b-2 transition-all duration-200 flex items-center gap-2 group",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/50"
                )}
              >
                <tab.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary/70")} />
                {tab.label}
                {tab.subItems && <ChevronDown className={cn("h-3 w-3 transition-transform", openDropdown === tab.id && "rotate-180")} />}
              </button>

              {tab.subItems && openDropdown === tab.id && (
                <div className="absolute left-0 top-full z-50 mt-2 min-w-[240px] bg-card border border-border/50 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 mb-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rent Roll Modules</span>
                  </div>
                  {tab.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        onSelect(sub.id);
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        "flex items-center justify-between w-full text-left px-4 py-2.5 text-sm font-medium transition-all",
                        active === sub.id
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      {sub.label}
                      {active === sub.id && <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
