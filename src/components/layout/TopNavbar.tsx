import { Bell, HelpCircle, Search, User, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Deals", href: "/" },
  { label: "FirstPass", href: "/first-pass" },
  { label: "Shared Deals", href: "/shared" },
  { label: "Comps", href: "/comps" },
  { label: "Research", href: "/research" },
];

export function TopNavbar() {
  const location = useLocation();

  return (
    <header className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="text-primary-foreground font-bold text-lg">J</span>
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-foreground">
            Just<span className="text-primary">Deal</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? location.pathname === "/" || location.pathname.startsWith("/deals") : location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center bg-secondary/50 border border-border/50 rounded-full px-3 py-1.5 gap-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search deals..." 
            className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2 border-l border-border/50 pl-4 ml-2">
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors relative">
            <Bell className="h-5 w-5" strokeWidth={1.5} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-2 cursor-pointer group">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground shadow-md group-hover:shadow-primary/20 transition-all">
              <User className="h-5 w-5" />
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-semibold text-foreground leading-none">Sonali M.</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Admin</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
