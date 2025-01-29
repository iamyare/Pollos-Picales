import React, { useState } from 'react';
import { useProductionStore } from '../stores/useProductionStore';

export const ProductionForm: React.FC = () => {
  const { registerProduction, isLoading } = useProductionStore();
  const [formData, setFormData] = useState({
    wholeChicken: '',
    portions: '',
    tortillas: '',
    doughUsed: '',
    chickenWaste: '',
    tortillaWaste: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Register chicken production
    if (formData.wholeChicken) {
      await registerProduction({
        date: new Date().toISOString(),
        product_id: 'CHICKEN_PRODUCT_ID', // Replace with actual ID
        quantity_produced: Number(formData.wholeChicken),
        waste_quantity: Number(formData.chickenWaste),
      });
    }

    // Register tortilla production
    if (formData.tortillas) {
      await registerProduction({
        date: new Date().toISOString(),
        product_id: 'TORTILLA_PRODUCT_ID', // Replace with actual ID
        quantity_produced: Number(formData.tortillas),
        waste_quantity: Number(formData.tortillaWaste),
      });
    }

    // Clear form
    setFormData({
      wholeChicken: '',
      portions: '',
      tortillas: '',
      doughUsed: '',
      chickenWaste: '',
      tortillaWaste: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Producción de Pollo</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pollos Enteros
              </label>
              <input
                type="number"
                value={formData.wholeChicken}
                onChange={(e) => setFormData({ ...formData, wholeChicken: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Porciones
              </label>
              <input
                type="number"
                value={formData.portions}
                onChange={(e) => setFormData({ ...formData, portions: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Merma de Pollo (Kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.chickenWaste}
                onChange={(e) => setFormData({ ...formData, chickenWaste: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Producción de Tortillas</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tortillas Producidas
              </label>
              <input
                type="number"
                value={formData.tortillas}
                onChange={(e) => setFormData({ ...formData, tortillas: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Masa Utilizada (Kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.doughUsed}
                onChange={(e) => setFormData({ ...formData, doughUsed: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Merma de Tortillas
              </label>
              <input
                type="number"
                value={formData.tortillaWaste}
                onChange={(e) => setFormData({ ...formData, tortillaWaste: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? 'Guardando...' : 'Guardar Registro'}
        </button>
      </div>
    </form>
  );
};