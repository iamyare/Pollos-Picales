import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./ui/button";

interface RecentTransactionsCardProps {
  transactions: any[];
}

export function RecentTransactionsCard({ transactions }: RecentTransactionsCardProps) {
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
