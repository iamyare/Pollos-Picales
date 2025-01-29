import React from 'react';
import { useProductionStore } from '../stores/useProductionStore';

export const ProductionSummary: React.FC = () => {
  const { dailyStats } = useProductionStore();

  return (
    <div className="grid grid-cols-3 gap-6 mt-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <span className="text-2xl font-semibold text-gray-900">{dailyStats.totalChicken} Kg</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">Pollo Total</p>
        <p className="text-xs text-gray-400">32 unidades</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <span className="text-2xl font-semibold text-gray-900">{dailyStats.totalTortillas}</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">Tortillas</p>
        <p className="text-xs text-gray-400">25 kg de masa</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <span className="text-2xl font-semibold text-gray-900">{dailyStats.efficiency}%</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">Eficiencia</p>
        <p className="text-xs text-gray-400">3% merma</p>
      </div>
    </div>
  );
};