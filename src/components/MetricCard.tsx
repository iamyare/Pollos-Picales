import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  positive?: boolean;
  alert?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  positive,
  alert,
}: MetricCardProps) {
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
