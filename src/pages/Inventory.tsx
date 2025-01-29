import React, { useState } from "react";
import { PlusCircle, Search, Pencil, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const initialProducts = [
  {
    id: 1,
    name: "Pollo Entero",
    category: "Pollo",
    stock: 45,
    unit: "Unidades",
    minStock: 20,
    lastUpdated: "2025-01-15",
  },
  {
    id: 2,
    name: "Masa para Tortillas",
    category: "Insumos",
    stock: 15,
    unit: "Kilos",
    minStock: 25,
    lastUpdated: "2025-01-15",
  },
];
interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  lastUpdated: string;
}
export function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const handleAddProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: products.length + 1,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    setProducts([...products, newProduct]);
    setIsDialogOpen(false);
  };
  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
    setIsDialogOpen(false);
    setEditingProduct(null);
  };
  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };
  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || product.category === selectedCategory),
  );
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Gestión de Inventario</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <ProductForm
              onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
              initialData={editingProduct}
              onClose={() => {
                setIsDialogOpen(false);
                setEditingProduct(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar producto..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Pollo">Pollo</SelectItem>
            <SelectItem value="Insumos">Insumos</SelectItem>
            <SelectItem value="Complementos">Complementos</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Ordenar por
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Nombre</DropdownMenuItem>
            <DropdownMenuItem>Stock</DropdownMenuItem>
            <DropdownMenuItem>Última actualización</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Stock Actual</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Stock Mínimo</TableHead>
              <TableHead>Último Movimiento</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>{product.minStock}</TableCell>
                <TableCell>{product.lastUpdated}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingProduct(product);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Mostrando {filteredProducts.length} de {products.length} productos
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Anterior
          </Button>
          <Button variant="outline" size="sm">
            Siguiente
          </Button>
        </div>
      </div>
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function ProductForm({
  onSubmit,
  initialData,
  onClose,
}: {
  onSubmit: (product: any) => void;
  initialData?: Product | null;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      category: "",
      stock: 0,
      unit: "",
      minStock: 0,
    },
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {initialData ? "Editar Producto" : "Nuevo Producto"}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre del Producto</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                category: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pollo">Pollo</SelectItem>
              <SelectItem value="Insumos">Insumos</SelectItem>
              <SelectItem value="Complementos">Complementos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="stock">Stock Actual</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({
                ...formData,
                stock: Number(e.target.value),
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="unit">Unidad</Label>
          <Select
            value={formData.unit}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                unit: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar unidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unidades">Unidades</SelectItem>
              <SelectItem value="Kilos">Kilos</SelectItem>
              <SelectItem value="Litros">Litros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="minStock">Stock Mínimo</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.minStock}
            onChange={(e) =>
              setFormData({
                ...formData,
                minStock: Number(e.target.value),
              })
            }
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? "Guardar Cambios" : "Crear Producto"}
        </Button>
      </DialogFooter>
    </form>
  );
}
