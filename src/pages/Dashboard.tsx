import { useState, useEffect } from "react";
import { Bell, ChevronDown, Menu, Package, BarChart3, ShoppingCart, Trash2, Wallet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getDashboardMetrics, getRecentTransactions } from "@/actions";

interface DashboardMetrics {
  dailySales: number;
  chickensProduced: number;
  tortillasProduced: number;
  lowStockItems: LowStockItem[];
}

interface LowStockItem {
  name: string;
  amount: number;
}

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    dailySales: 0,
    chickensProduced: 0,
    tortillasProduced: 0,
    lowStockItems: [],
  });
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const today = new Date().toISOString().split('T')[0];
      const metricsData = await getDashboardMetrics({
        startDate: today,
        endDate: today
      });
      
      const transactionsData = await getRecentTransactions({
        limit: 5,
        startDate: today
      });
      
      setMetrics(metricsData);
      setTransactions(transactionsData);
    };
    loadData();
  }, []);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Pollo & Tortillas</SheetTitle>
          </SheetHeader>
          <nav className="space-y-1 p-4">
            <NavItem icon={BarChart3} label="Dashboard" active />
            <NavItem icon={Package} label="Inventario" />
            <NavItem icon={ShoppingCart} label="Ventas" />
            <NavItem icon={Trash2} label="Control de Sobras" />
            <NavItem icon={Wallet} label="Finanzas" />
            <NavItem icon={FileText} label="Reportes" />
          </nav>
        </SheetContent>
      </Sheet>
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">Pollo & Tortillas</h1>
        </div>
        <nav className="space-y-1 p-4">
          <NavItem icon={BarChart3} label="Dashboard" active />
          <NavItem icon={Package} label="Inventario" />
          <NavItem icon={ShoppingCart} label="Ventas" />
          <NavItem icon={Trash2} label="Control de Sobras" />
          <NavItem icon={Wallet} label="Finanzas" />
          <NavItem icon={FileText} label="Reportes" />
        </nav>
      </aside>
      <main className="flex-1">
        <header className="flex justify-between items-center p-4 border-b bg-white lg:p-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>MP</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configuración</DropdownMenuItem>
                <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Ventas Hoy"
              value={`$${metrics.dailySales.toFixed(2)}`}
              change="+15%"
              positive
            />
            <MetricCard
              title="Pollos Producidos"
              value={`${metrics.chickensProduced}`}
              subtitle={`${metrics.chickensProduced} unidades`}
            />
            <MetricCard
              title="Tortillas Producidas"
              value={`${metrics.tortillasProduced}`}
              subtitle="5 kg de masa"
            />
            <MetricCard
              title="Alertas Stock"
              value={`${metrics.lowStockItems.length}`}
              subtitle="Productos bajo mínimo"
              alert
            />
          </div>

          {metrics.lowStockItems.length ? (
            <StockAlertCard items={metrics.lowStockItems} />
          ) : (
            <p>No hay alertas de stock.</p>
          )}
          
          {transactions.length ? (
            <RecentTransactionsCard transactions={transactions} />
          ) : (
            <p>No hay transacciones recientes.</p>
          )}
        </div>
      </main>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className="w-full justify-start"
    >
      <Icon className="h-5 w-5 mr-3" />
      {label}
    </Button>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  change,
  positive,
  alert,
}: {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  positive?: boolean;
  alert?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          {change && (
            <span
              className={`text-sm ${positive ? "text-green-500" : "text-red-500"}`}
            >
              {change}
            </span>
          )}
        </div>
        <p className={`text-2xl font-semibold ${alert ? "text-red-500" : ""}`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

function StockAlertCard({ items }: { items: LowStockItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Crítico</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <StockItem key={index} label={item.name} amount={`${item.amount} restantes`} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StockItem({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-700">{label}</span>
      <span className="text-gray-500">{amount}</span>
    </div>
  );
}

function RecentTransactionsCard({ transactions }: { transactions: any[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Últimas Transacciones</CardTitle>
        <Button variant="ghost" size="sm">
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TransactionRow
                key={index}
                date={transaction.date}
                product={transaction.product}
                quantity={transaction.quantity}
                total={transaction.total}
                status={transaction.status}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TransactionRow({
  date,
  product,
  quantity,
  total,
  status,
}: {
  date: string;
  product: string;
  quantity: string;
  total: string;
  status: string;
}) {
  return (
    <TableRow>
      <TableCell>{date}</TableCell>
      <TableCell>{product}</TableCell>
      <TableCell>{quantity}</TableCell>
      <TableCell>{total}</TableCell>
      <TableCell>
        <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
          {status}
        </span>
      </TableCell>
    </TableRow>
  );
}