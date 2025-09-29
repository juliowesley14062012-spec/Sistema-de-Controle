import React, { useState } from 'react';
import { Plus, Trash2, Calendar, DollarSign } from 'lucide-react';
import Header from './Header';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import FirebaseStatus from './FirebaseStatus';

interface DeliverySalesProps {
  onBack: () => void;
  type: 'whatsapp' | 'ifood';
  title: string;
}

interface DeliverySale {
  id: string;
  total: number;
  notes: string;
  date: Date;
}

export default function DeliverySales({ onBack, type, title }: DeliverySalesProps) {
  const { 
    data: sales, 
    updateData: updateSales, 
    loading, 
    error, 
    connected 
  } = useFirebaseSync<DeliverySale[]>('sales', `${type}-sales`, []);
  
  const [newTotal, setNewTotal] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const addSale = () => {
    const total = parseFloat(newTotal);
    if (isNaN(total) || total <= 0) {
      alert('Digite um valor válido');
      return;
    }

    const sale: DeliverySale = {
      id: Date.now().toString(),
      total,
      notes: newNotes,
      date: new Date()
    };

    updateSales([...sales, sale]);
    setNewTotal('');
    setNewNotes('');
  };

  const deleteSale = (saleId: string) => {
    updateSales(sales.filter(sale => sale.id !== saleId));
  };

  const clearAllSales = () => {
    if (confirm('Tem certeza que deseja apagar todas as vendas?')) {
      updateSales([]);
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);

  const formatDate = (date: Date) => {
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
          <div className="text-purple-200 text-sm">{sales.length} entregas registradas</div>
        </div>

        {/* Add New Sale */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nova Entrega</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Total
              </label>
              <input
                type="number"
                value={newTotal}
                onChange={(e) => setNewTotal(e.target.value)}
                className="w-full p-3 border rounded-lg text-lg"
                placeholder="0,00"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                placeholder="Detalhes do pedido..."
              />
            </div>
            
            <button
              onClick={addSale}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar Entrega
            </button>
          </div>
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
              <p className="text-gray-500 text-lg">Nenhuma entrega registrada</p>
            </div>
          ) : (
            sales.map((sale) => (
              <div key={sale.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-gray-800">
                      Entrega #{sale.id.slice(-4)}
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

                {sale.notes && (
                  <div className="border-t pt-3">
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