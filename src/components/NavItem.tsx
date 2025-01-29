import { Button } from "@/components/ui/button";

interface NavItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className="w-full justify-start"
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mr-3" />
      {label}
    </Button>
  );
}
