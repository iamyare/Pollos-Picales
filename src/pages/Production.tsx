import React, { useEffect } from 'react';
import { ProductionForm } from '../components/ProductionForm';
import { ProductionSummary } from '../components/ProductionSummary';
import { useProductionStore } from '../stores/useProductionStore';

export const Production: React.FC = () => {
  const { fetchDailyStats } = useProductionStore();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    fetchDailyStats(today);
  }, [fetchDailyStats]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Registro de Producción Diaria</h1>
      </div>

      <ProductionForm />
      <ProductionSummary />
    </div>
  );
};