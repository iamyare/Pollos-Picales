import { Sidebar } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

import { NavItem } from "@/components/NavItem";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, BarChart3, ShoppingCart, Package, Trash2, Wallet, FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const navigation = [
  { path: "/", icon: BarChart3, label: "Dashboard" },
  { path: "/pos", icon: ShoppingCart, label: "Punto de Venta" },
  { path: "/inventory", icon: Package, label: "Inventario" },
  { path: "/waste", icon: Trash2, label: "Control de Sobras" },
  { path: "/finance", icon: Wallet, label: "Finanzas" },
  { path: "/reports", icon: FileText, label: "Reportes" }
];

export function SidebarComponent({ isMobile, isOpen, onOpenChange }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const NavItems = (
    <nav className="space-y-1 p-4">
      {navigation.map((item) => (
        <NavItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          active={location.pathname === item.path}
          onClick={() => {
            navigate(item.path);
            if (isMobile && onOpenChange) {
              onOpenChange(false);
            }
          }}
        />
      ))}
    </nav>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Pollo & Tortillas</SheetTitle>
          </SheetHeader>
          {NavItems}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Pollo & Tortillas</h1>
      </div>
      {NavItems}
    </aside>
  );
}
