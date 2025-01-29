import  { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Utensils, BarChart } from "lucide-react";


export function Production() {
  const [productionData, setProductionData] = useState({
    pollosEnteros: "",
    pollosPorciones: "",
    tortillasProducidas: "",
    masaUtilizada: "",
    mermaPollo: "",
    mermaTortillas: "",
  });
  const handleInputChange = (field: string, value: string) => {
    setProductionData({
      ...productionData,
      [field]: value,
    });
  };
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">
          Sistema de Gestión - Producción
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Admin</span>
        </div>
      </header>
      {/* Registro de Producción Diaria */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Registro de Producción Diaria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Producción de Pollo */}
            <div className="space-y-4">
              <h3 className="font-medium">Producción de Pollo</h3>
              <div className="space-y-2">
                <label className="text-sm">Pollos Enteros</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Cantidad"
                    value={productionData.pollosEnteros}
                    onChange={(e) =>
                      handleInputChange("pollosEnteros", e.target.value)
                    }
                  />
                  <Select defaultValue="Unidades">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Unidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unidades">Unidades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm">Porciones</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Cantidad"
                    value={productionData.pollosPorciones}
                    onChange={(e) =>
                      handleInputChange("pollosPorciones", e.target.value)
                    }
                  />
                  <Select defaultValue="Piezas">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Piezas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Piezas">Piezas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {/* Producción de Tortillas */}
            <div className="space-y-4">
              <h3 className="font-medium">Producción de Tortillas</h3>
              <div className="space-y-2">
                <label className="text-sm">Tortillas Producidas</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Cantidad"
                    value={productionData.tortillasProducidas}
                    onChange={(e) =>
                      handleInputChange("tortillasProducidas", e.target.value)
                    }
                  />
                  <Select defaultValue="Unidades">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Unidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unidades">Unidades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm">Masa Utilizada</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Cantidad"
                    value={productionData.masaUtilizada}
                    onChange={(e) =>
                      handleInputChange("masaUtilizada", e.target.value)
                    }
                  />
                  <Select defaultValue="Kilos">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Kilos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kilos">Kilos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          {/* Control de Mermas */}
          <div className="mt-8">
            <h3 className="font-medium mb-4">Control de Mermas</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm">Merma de Pollo</label>
                <Input
                  placeholder="Cantidad en Kg"
                  value={productionData.mermaPollo}
                  onChange={(e) =>
                    handleInputChange("mermaPollo", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Merma de Tortillas</label>
                <Input
                  placeholder="Cantidad en Unidades"
                  value={productionData.mermaTortillas}
                  onChange={(e) =>
                    handleInputChange("mermaTortillas", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-8">
            <Button variant="outline">Cancelar</Button>
            <Button>Guardar Registro</Button>
          </div>
        </CardContent>
      </Card>
      {/* Resumen de Producción */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Producción</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-4" />
                  <h3 className="font-medium">Pollo Total</h3>
                </div>
                <div className="text-2xl font-bold">145 Kg</div>
                <div className="text-sm text-gray-500">32 unidades</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Utensils className="h-4 w-4" />
                  <h3 className="font-medium">Tortillas</h3>
                </div>
                <div className="text-2xl font-bold">1,250</div>
                <div className="text-sm text-gray-500">25 kg de masa</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart className="h-4 w-4" />
                  <h3 className="font-medium">Eficiencia</h3>
                </div>
                <div className="text-2xl font-bold">97%</div>
                <div className="text-sm text-gray-500">3% merma</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
