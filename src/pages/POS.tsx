import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePosStore } from "@/stores/usePosStore";
import { Search, ShoppingCart, Trash } from "lucide-react";

export function POS() {
  const { 
    cart, 
    products, 
    isLoading,
    fetchProducts, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    processTransaction,
    calculateTotal
  } = usePosStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Productos */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product, 1)}
            />
          ))}
        </div>
      </div>

      {/* Carrito */}
      <div className="w-96 border-l bg-gray-50 flex flex-col">
        <CardHeader>
          <CardTitle>Carrito</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cant.</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.product_id}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product_id, Number(e.target.value))}
                      className="w-20"
                      min="1"
                    />
                  </TableCell>
                  <TableCell>${item.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.product_id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={cart.length === 0 || isLoading}
            onClick={() => processTransaction("cash")}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Procesar Venta
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart }: { product: any; onAddToCart: () => void }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onAddToCart}>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{product.name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-lg">${product.unit_price}</span>
          <span className="text-sm text-gray-500">Stock: {product.current_stock}</span>
        </div>
      </CardContent>
    </Card>
  );
}
