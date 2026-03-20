import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { getProjections, ProjectionResult } from "@/services/rentRollApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, DollarSign, Percent, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FirstPassPage() {
  const { id: paramId } = useParams<{ id: string }>();
  const [id, setId] = useState<string | undefined>(paramId);
  const [marketRent, setMarketRent] = useState<number>(15.0);
  const [annualIncrement, setAnnualIncrement] = useState<number>(3.0);
  const [projections, setProjections] = useState<ProjectionResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const years = [2025, 2026, 2027, 2028, 2029, 2030, 2031];

  useEffect(() => {
    if (!id) {
      // Fetch latest deal if no ID provided
      fetch("/api/v1/deals?limit=1")
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data.length > 0) {
            setId(data.data[0].id);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchProjections();
    }
  }, [id, marketRent, annualIncrement]);

  const fetchProjections = async () => {
    try {
      setLoading(true);
      const data = await getProjections(id!, marketRent, annualIncrement / 100);
      setProjections(data);
    } catch (error) {
      console.error("Failed to fetch projections:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const totals = years.reduce((acc, year) => {
    acc[year] = projections.reduce((sum, p) => sum + (p.projections[year]?.amount || 0), 0);
    return acc;
  }, {} as Record<number, number>);

  const totalSqft = projections.reduce((sum, p) => sum + (p.sqft || 0), 0);

  return (
    <AppLayout>
      <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">FirstPass Analysis</h1>
            <p className="text-muted-foreground mt-2">Interactive multi-year rent roll projections and market sensitivity.</p>
          </div>
          
          <div className="flex items-center gap-6 bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm">
            <div className="space-y-1.5">
              <Label htmlFor="marketRent" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Market Rent ($/SF)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="marketRent"
                  type="number"
                  value={marketRent}
                  onChange={(e) => setMarketRent(parseFloat(e.target.value) || 0)}
                  className="w-32 pl-8 bg-background/50 border-border/50 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="increment" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Annual Increment (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="increment"
                  type="number"
                  value={annualIncrement}
                  onChange={(e) => setAnnualIncrement(parseFloat(e.target.value) || 0)}
                  className="w-32 pl-8 bg-background/50 border-border/50 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/30 border-border/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total NRA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-mono font-bold">{totalSqft.toLocaleString()} SF</p>
            </CardContent>
          </Card>
          <Card className="bg-card/30 border-border/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Year 1 Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-mono font-bold text-emerald-500">{formatCurrency(totals[2025] || 0)}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/30 border-border/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Year 7 Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-mono font-bold text-primary">{formatCurrency(totals[2031] || 0)}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/30 border-border/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">7-Year CAGR</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-mono font-bold">
                {totals[2025] > 0 ? (((totals[2031] / totals[2025]) ** (1/6) - 1) * 100).toFixed(1) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="section-border bg-card/30 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="w-[80px] text-[10px] font-bold uppercase tracking-widest">Suite</TableHead>
                  <TableHead className="min-w-[200px] text-[10px] font-bold uppercase tracking-widest">Tenant</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest">Sq Ft</TableHead>
                  {years.map(year => (
                    <TableHead key={year} className="text-right text-[10px] font-bold uppercase tracking-widest">
                      {year}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={years.length + 3} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground font-medium">Calculating projections...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : projections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={years.length + 3} className="h-64 text-center text-muted-foreground">
                      No rent roll data available for this deal.
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {projections.map((p, idx) => (
                      <TableRow key={idx} className="hover:bg-secondary/20 border-border/30 transition-colors">
                        <TableCell className="font-mono text-xs">{p.suite}</TableCell>
                        <TableCell className="font-medium text-sm">{p.tenant}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{p.sqft.toLocaleString()}</TableCell>
                        {years.map(year => {
                          const proj = p.projections[year];
                          return (
                            <TableCell 
                              key={year} 
                              className={cn(
                                "text-right font-mono text-xs",
                                proj?.type === 'lease' && "text-emerald-500/80 bg-emerald-500/5",
                                proj?.type === 'transition' && "text-amber-500/80 bg-amber-500/5",
                                proj?.type === 'market' && "text-foreground/60"
                              )}
                            >
                              {proj ? formatCurrency(proj.amount) : "—"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                    <TableRow className="bg-secondary/30 font-bold border-t-2 border-border">
                      <TableCell colSpan={2} className="text-[10px] uppercase tracking-widest">Total Base Rent</TableCell>
                      <TableCell className="text-right font-mono text-xs">{totalSqft.toLocaleString()}</TableCell>
                      {years.map(year => (
                        <TableCell key={year} className="text-right font-mono text-sm text-primary">
                          {formatCurrency(totals[year])}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="bg-secondary/10 font-medium">
                      <TableCell colSpan={3} className="text-[10px] uppercase tracking-widest">Average $/SF</TableCell>
                      {years.map(year => (
                        <TableCell key={year} className="text-right font-mono text-xs text-muted-foreground">
                          ${totalSqft > 0 ? (totals[year] / totalSqft).toFixed(2) : "0.00"}
                        </TableCell>
                      ))}
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center gap-8 p-6 bg-secondary/20 rounded-2xl border border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">In-Lease</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Transition / Step</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-foreground/5 border border-foreground/20" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Market / Post-Exp</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
