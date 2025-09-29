import React from 'react';
import { Trash2, Calendar, DollarSign } from 'lucide-react';
import Header from './Header';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import FirebaseStatus from './FirebaseStatus';

interface SalesControlProps {
  onBack: () => void;
  type: 'store' | 'whatsapp' | 'ifood';
  title: string;
}

export default function SalesControl({ onBack, type, title }: SalesControlProps) {
  const { 
    data: sales, 
    updateData: updateSales, 
    loading, 
    error, 
    connected 
  } = useFirebaseSync<any[]>('sales', `${type}-sales`, []);

  const deleteSale = (saleId: string) => {
    updateSales(sales.filter(sale => sale.id !== saleId));
  };

  const clearAllSales = () => {
    if (confirm('Tem certeza que deseja apagar todas as vendas?')) {
      updateSales([]);
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} onBack={onBack} />
      
      <FirebaseStatus connected={connected} loading={loading} error={error} />
      
      <div className="p-4 max-w-md mx-auto">
        {/* Summary */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Total de Vendas</h3>
          </div>
          <div className="text-3xl font-bold">R$ {totalSales.toFixed(2)}</div>
          <div className="text-purple-200 text-sm">{sales.length} vendas registradas</div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={clearAllSales}
            disabled={sales.length === 0}
            className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Limpar Todas
          </button>
        </div>

        {/* Sales List */}
        <div className="space-y-4">
          {sales.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma venda registrada</p>
            </div>
          ) : (
            sales.map((sale, index) => (
              <div key={sale.id || index} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-gray-800">
                      Venda #{sale.id || index + 1}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(sale.date)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-bold text-purple-600">
                      R$ {sale.total.toFixed(2)}
                    </div>
                    <button
                      onClick={() => deleteSale(sale.id)}
                      className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {sale.items && sale.items.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="text-sm text-gray-600 mb-2">Itens:</div>
                    <div className="space-y-1">
                      {sale.items.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity || 1}</span>
                          <span>R$ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sale.notes && (
                  <div className="border-t pt-3 mt-3">
                    <div className="text-sm text-gray-600 mb-1">Observações:</div>
                    <div className="text-sm bg-gray-50 p-2 rounded">
                      {sale.notes}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}