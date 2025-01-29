import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Receipt, Wallet, CreditCard } from "lucide-react";
interface AccountReceivable {
  id: number;
  client: string;
  amount: number;
  dueDate: string;
  status: "Pendiente" | "Pagado" | "Vencido";
}
interface CashTransaction {
  id: number;
  type: "income" | "expense";
  description: string;
  amount: number;
  timestamp: string;
}
export function Finance() {
  const [accounts, setAccounts] = useState<AccountReceivable[]>([
    {
      id: 1,
      client: "Restaurant El Pollo Feliz",
      amount: 350.0,
      dueDate: "15 Feb 2025",
      status: "Pendiente",
    },
    {
      id: 2,
      client: "Comedor Las Delicias",
      amount: 275.25,
      dueDate: "18 Feb 2025",
      status: "Pendiente",
    },
    {
      id: 3,
      client: "Tortillería San Juan",
      amount: 250.0,
      dueDate: "20 Feb 2025",
      status: "Pendiente",
    },
  ]);
  const [transactions, setTransactions] = useState<CashTransaction[]>([
    {
      id: 1,
      type: "income",
      description: "Venta en efectivo",
      amount: 1350.75,
      timestamp: "2025-01-15 09:30",
    },
    {
      id: 2,
      type: "expense",
      description: "Compra de insumos",
      amount: 645.3,
      timestamp: "2025-01-15 11:45",
    },
  ]);
  const totalSales = 2458.5;
  const cashOnHand = 1850.75;
  const totalReceivables = accounts.reduce(
    (sum, account) => sum + account.amount,
    0,
  );
  const totalExpenses = 645.3;
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Pollo & Tortillas | Finanzas</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Admin</span>
        </div>
      </header>
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Ventas del día"
          value={totalSales}
          icon={DollarSign}
        />
        <MetricCard title="Efectivo en caja" value={cashOnHand} icon={Wallet} />
        <MetricCard
          title="Cuentas por cobrar"
          value={totalReceivables}
          icon={Receipt}
        />
        <MetricCard
          title="Gastos del día"
          value={totalExpenses}
          icon={CreditCard}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cuentas por Cobrar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cuentas por Cobrar</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Nueva Cuenta</Button>
                </DialogTrigger>
                <DialogContent>
                  <NewAccountForm
                    onSubmit={(data) => {
                      setAccounts([
                        ...accounts,
                        {
                          id: accounts.length + 1,
                          ...data,
                        },
                      ]);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha límite</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.client}</TableCell>
                      <TableCell>${account.amount.toFixed(2)}</TableCell>
                      <TableCell>{account.dueDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            account.status === "Pendiente"
                              ? "outline"
                              : "default"
                          }
                        >
                          {account.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        {/* Control de Caja */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Control de Caja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Apertura de caja</span>
                  <span className="font-medium">$500.00</span>
                </div>
                <div className="text-xs text-gray-500">08:00 AM</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ventas en efectivo</span>
                  <span className="font-medium text-green-600">+$1,350.75</span>
                </div>
                <div className="text-xs text-gray-500">12 transacciones</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Gastos</span>
                  <span className="font-medium text-red-600">-$645.30</span>
                </div>
                <div className="text-xs text-gray-500">3 transacciones</div>
              </div>
              <Button className="w-full" variant="default">
                Realizar cierre de caja
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
function MetricCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: any;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">{title}</span>
        </div>
        <div className="text-2xl font-bold">${value.toFixed(2)}</div>
      </CardContent>
    </Card>
  );
}
function NewAccountForm({
  onSubmit,
}: {
  onSubmit: (data: Omit<AccountReceivable, "id">) => void;
}) {
  const [formData, setFormData] = useState({
    client: "",
    amount: "",
    dueDate: "",
    status: "Pendiente" as const,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      client: formData.client,
      amount: Number(formData.amount),
      dueDate: formData.dueDate,
      status: formData.status,
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Nueva Cuenta por Cobrar</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="client">Cliente</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) =>
              setFormData({
                ...formData,
                client: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Monto</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Fecha Límite</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                dueDate: e.target.value,
              })
            }
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Crear Cuenta</Button>
      </DialogFooter>
    </form>
  );
}
