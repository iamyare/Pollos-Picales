import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StockAlertCardProps {
  items: LowStockItem[];
}

export function StockAlertCard({ items }: StockAlertCardProps) {
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
