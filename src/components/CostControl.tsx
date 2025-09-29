import React, { useState, useEffect } from 'react';
import { Calculator, RotateCcw, DollarSign, Plus, Trash2 } from 'lucide-react';
import Header from './Header';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import FirebaseStatus from './FirebaseStatus';

interface CostControlProps {
  onBack: () => void;
}

interface CostItem {
  id: string;
  name: string;
  cost: number;
  quantity: number;
  multiplier?: number;
  editable: boolean;
  isCustom?: boolean;
}

const INITIAL_STORE_COSTS: CostItem[] = [
  { id: '1', name: 'Copo 100ml', cost: 0.04, quantity: 0, editable: true },
  { id: '2', name: 'Copo 200ml', cost: 0.04, quantity: 0, editable: true },
  { id: '3', name: 'Copo 300ml', cost: 0.08, quantity: 0, editable: true },
  { id: '4', name: 'Copo 400ml', cost: 0.19, quantity: 0, editable: true },
  { id: '5', name: 'Copo 500ml', cost: 0.15, quantity: 0, editable: true },
  { id: '6', name: 'Copo 770ml', cost: 0.43, quantity: 0, editable: true },
  { id: '7', name: 'Copo 1 Litro', cost: 0.89, quantity: 0, editable: true },
  { id: '8', name: 'Coberturas', cost: 0.25, quantity: 0, editable: true },
  { id: '9', name: 'Coberturas Fini', cost: 0.50, quantity: 0, editable: true },
  { id: '10', name: 'Cremes Especiais', cost: 3.80, quantity: 0, editable: true },
];

const INITIAL_WHATSAPP_COSTS: CostItem[] = [
  { id: '1', name: 'Copo+tampa 330ml', cost: 0.41, quantity: 0, editable: true },
  { id: '2', name: 'Copo+tampa 440ml', cost: 0.50, quantity: 0, editable: true },
  { id: '3', name: 'Copo+tampa 550ml', cost: 0.54, quantity: 0, editable: true },
  { id: '4', name: 'Copo+tampa 770ml', cost: 0.76, quantity: 0, editable: true },
  { id: '5', name: 'Copo+tampa 1 Litro', cost: 0.89, quantity: 0, editable: true },
  { id: '6', name: 'Coberturas', cost: 0.25, quantity: 0, editable: true },
  { id: '7', name: 'Coberturas Fini', cost: 0.50, quantity: 0, editable: true },
  { id: '8', name: 'Cremes Especiais', cost: 3.80, quantity: 0, editable: true },
  { id: '9', name: 'Sonho de Valsa', cost: 1.00, quantity: 0, editable: true },
  { id: '10', name: 'Ouro Branco', cost: 1.00, quantity: 0, editable: true },
  { id: '11', name: 'Biscoito Óreo', cost: 2.33, quantity: 0, editable: true },
  { id: '12', name: 'Picolé Normal', cost: 1.20, quantity: 0, editable: true },
  { id: '13', name: 'Picolé Promoção', cost: 1.20, quantity: 0, editable: true },
  { id: '14', name: 'Casquinha Pura', cost: 0.21, quantity: 0, editable: true },
  { id: '15', name: 'Cestinha Pura', cost: 0.43, quantity: 0, editable: true },
  { id: '16', name: 'Sorvete', cost: 8.90, quantity: 0, multiplier: 1, editable: true },
  { id: '17', name: 'Amendoim (g)', cost: 0.015, quantity: 0, multiplier: 1, editable: true },
  { id: '18', name: 'Paçoca (g)', cost: 0.015, quantity: 0, multiplier: 1, editable: true },
  { id: '19', name: 'Chocoball (g)', cost: 0.023, quantity: 0, multiplier: 1, editable: true },
  { id: '20', name: 'Sucrilhos (g)', cost: 0.022, quantity: 0, multiplier: 1, editable: true },
  { id: '21', name: 'Flocos de Arroz (g)', cost: 0.018, quantity: 0, multiplier: 1, editable: true },
  { id: '22', name: 'Leite Ninho (g)', cost: 0.0245, quantity: 0, multiplier: 1, editable: true },
  { id: '23', name: 'Granola (g)', cost: 0.0177, quantity: 0, multiplier: 1, editable: true },
  { id: '24', name: 'Granulado (g)', cost: 0.0186, quantity: 0, multiplier: 1, editable: true },
  { id: '25', name: 'Ovomaltine (g)', cost: 0.0427, quantity: 0, multiplier: 1, editable: true },
  { id: '26', name: 'Biscoito (un)', cost: 0.08, quantity: 0, multiplier: 1, editable: true },
  { id: '27', name: 'Disquete (g)', cost: 0.025, quantity: 0, multiplier: 1, editable: true },
  { id: '28', name: 'Jujuba (g)', cost: 0.013, quantity: 0, multiplier: 1, editable: true },
];

const INITIAL_IFOOD_COSTS: CostItem[] = [
  { id: '1', name: 'Copo+tampa 330ml', cost: 0.41, quantity: 0, editable: true },
  { id: '2', name: 'Copo+tampa 440ml', cost: 0.50, quantity: 0, editable: true },
  { id: '3', name: 'Copo+tampa 550ml', cost: 0.54, quantity: 0, editable: true },
  { id: '4', name: 'Copo+tampa 770ml', cost: 0.76, quantity: 0, editable: true },
  { id: '5', name: 'Copo+tampa 1 Litro', cost: 0.89, quantity: 0, editable: true },
  { id: '6', name: 'Coberturas', cost: 0.25, quantity: 0, editable: true },
  { id: '7', name: 'Coberturas Fini', cost: 0.50, quantity: 0, editable: true },
  { id: '8', name: 'Cremes Especiais', cost: 3.80, quantity: 0, editable: true },
  { id: '9', name: 'Sonho de Valsa', cost: 1.00, quantity: 0, editable: true },
  { id: '10', name: 'Ouro Branco', cost: 1.00, quantity: 0, editable: true },
  { id: '11', name: 'Biscoito Óreo', cost: 2.33, quantity: 0, editable: true },
  { id: '12', name: 'Sorvete/Açaí', cost: 8.90, quantity: 0, multiplier: 1, editable: true },
  { id: '13', name: 'Amendoim (g)', cost: 0.015, quantity: 0, multiplier: 1, editable: true },
  { id: '14', name: 'Paçoca (g)', cost: 0.015, quantity: 0, multiplier: 1, editable: true },
  { id: '15', name: 'Chocoball (g)', cost: 0.023, quantity: 0, multiplier: 1, editable: true },
  { id: '16', name: 'Sucrilhos (g)', cost: 0.022, quantity: 0, multiplier: 1, editable: true },
  { id: '17', name: 'Flocos de Arroz (g)', cost: 0.018, quantity: 0, multiplier: 1, editable: true },
  { id: '18', name: 'Leite Ninho (g)', cost: 0.0245, quantity: 0, multiplier: 1, editable: true },
  { id: '19', name: 'Granola (g)', cost: 0.0177, quantity: 0, multiplier: 1, editable: true },
  { id: '20', name: 'Granulado (g)', cost: 0.0186, quantity: 0, multiplier: 1, editable: true },
  { id: '21', name: 'Ovomaltine (g)', cost: 0.0427, quantity: 0, multiplier: 1, editable: true },
  { id: '22', name: 'Biscoito (un)', cost: 0.08, quantity: 0, multiplier: 1, editable: true },
  { id: '23', name: 'Disquete (g)', cost: 0.025, quantity: 0, multiplier: 1, editable: true },
  { id: '24', name: 'Jujuba (g)', cost: 0.013, quantity: 0, multiplier: 1, editable: true },
];

export default function CostControl({ onBack }: CostControlProps) {
  const [activeTab, setActiveTab] = useState('store');
  const [deleteMode, setDeleteMode] = useState(false);
  
  // Firebase sync for different cost categories
  const { 
    data: storeCosts, 
    updateData: updateStoreCosts, 
    loading: storeLoading, 
    error: storeError, 
    connected: storeConnected 
  } = useFirebaseSync<CostItem[]>('costs', 'store-costs', INITIAL_STORE_COSTS);
  
  const { 
    data: whatsappCosts, 
    updateData: updateWhatsappCosts, 
    loading: whatsappLoading, 
    error: whatsappError, 
    connected: whatsappConnected 
  } = useFirebaseSync<CostItem[]>('costs', 'whatsapp-costs', INITIAL_WHATSAPP_COSTS);
  
  const { 
    data: ifoodCosts, 
    updateData: updateIfoodCosts, 
    loading: ifoodLoading, 
    error: ifoodError, 
    connected: ifoodConnected 
  } = useFirebaseSync<CostItem[]>('costs', 'ifood-costs', INITIAL_IFOOD_COSTS);
  
  const { 
    data: otherCosts, 
    updateData: updateOtherCosts, 
    loading: otherLoading, 
    error: otherError, 
    connected: otherConnected 
  } = useFirebaseSync('costs', 'other-costs', {
    cardFee: 0,
    motoKm: 0,
    rent: 0,
    electricity: 0,
    mei: 0,
    internet: 0
  });
  
  const { 
    data: customOtherCosts, 
    updateData: updateCustomOtherCosts, 
    loading: customLoading, 
    error: customError, 
    connected: customConnected 
  } = useFirebaseSync<CostItem[]>('costs', 'custom-other-costs', []);
  
  const { 
    data: revenue, 
    updateData: updateRevenue, 
    loading: revenueLoading, 
    error: revenueError, 
    connected: revenueConnected 
  } = useFirebaseSync('costs', 'revenue', {
    store: 0,
    whatsapp: 0,
    ifood: 0,
    ifoodFee: 0
  });

  // Overall connection status
  const connected = storeConnected && whatsappConnected && ifoodConnected && otherConnected && customConnected && revenueConnected;
  const loading = storeLoading || whatsappLoading || ifoodLoading || otherLoading || customLoading || revenueLoading;
  const error = storeError || whatsappError || ifoodError || otherError || customError || revenueError;

  const updateCostQuantity = (id: string, quantity: number, section: string) => {
    if (section === 'store') {
      const updated = storeCosts.map(cost => 
        cost.id === id ? { ...cost, quantity } : cost
      );
      updateStoreCosts(updated);
    } else if (section === 'whatsapp') {
      const updated = whatsappCosts.map(cost => 
        cost.id === id ? { ...cost, quantity } : cost
      );
      updateWhatsappCosts(updated);
    } else if (section === 'ifood') {
      const updated = ifoodCosts.map(cost => 
        cost.id === id ? { ...cost, quantity } : cost
      );
      updateIfoodCosts(updated);
    }
  };

  const updateCostPrice = (id: string, price: number, section: string) => {
    if (section === 'store') {
      const updated = storeCosts.map(cost => 
        cost.id === id ? { ...cost, cost: price } : cost
      );
      updateStoreCosts(updated);
    } else if (section === 'whatsapp') {
      const updated = whatsappCosts.map(cost => 
        cost.id === id ? { ...cost, cost: price } : cost
      );
      updateWhatsappCosts(updated);
    } else if (section === 'ifood') {
      const updated = ifoodCosts.map(cost => 
        cost.id === id ? { ...cost, cost: price } : cost
      );
      updateIfoodCosts(updated);
    }
  };

  const addCustomCostItem = (section: string) => {
    const newItem: CostItem = {
      id: Date.now().toString(),
      name: 'Novo Produto',
      cost: 0,
      quantity: 0,
      editable: true,
      isCustom: true
    };

    if (section === 'store') {
      updateStoreCosts([...storeCosts, newItem]);
    } else if (section === 'whatsapp') {
      updateWhatsappCosts([...whatsappCosts, newItem]);
    } else if (section === 'ifood') {
      updateIfoodCosts([...ifoodCosts, newItem]);
    } else if (section === 'other') {
      updateCustomOtherCosts([...customOtherCosts, newItem]);
    }
  };

  const removeCustomCostItem = (id: string, section: string) => {
    if (section === 'store') {
      updateStoreCosts(storeCosts.filter(item => item.id !== id));
    } else if (section === 'whatsapp') {
      updateWhatsappCosts(whatsappCosts.filter(item => item.id !== id));
    } else if (section === 'ifood') {
      updateIfoodCosts(ifoodCosts.filter(item => item.id !== id));
    } else if (section === 'other') {
      updateCustomOtherCosts(customOtherCosts.filter(item => item.id !== id));
    }
  };

  const updateCustomCostName = (id: string, name: string, section: string) => {
    if (section === 'store') {
      const updated = storeCosts.map(item => 
        item.id === id ? { ...item, name } : item
      );
      updateStoreCosts(updated);
    } else if (section === 'whatsapp') {
      const updated = whatsappCosts.map(item => 
        item.id === id ? { ...item, name } : item
      );
      updateWhatsappCosts(updated);
    } else if (section === 'ifood') {
      const updated = ifoodCosts.map(item => 
        item.id === id ? { ...item, name } : item
      );
      updateIfoodCosts(updated);
    } else if (section === 'other') {
      const updated = customOtherCosts.map(item => 
        item.id === id ? { ...item, name } : item
      );
      updateCustomOtherCosts(updated);
    }
  };

  const updateCustomCostMultiplier = (id: string, multiplier: number, section: string) => {
    if (section === 'store') {
      const updated = storeCosts.map(item => 
        item.id === id ? { ...item, multiplier } : item
      );
      updateStoreCosts(updated);
    } else if (section === 'whatsapp') {
      const updated = whatsappCosts.map(item => 
        item.id === id ? { ...item, multiplier } : item
      );
      updateWhatsappCosts(updated);
    } else if (section === 'ifood') {
      const updated = ifoodCosts.map(item => 
        item.id === id ? { ...item, multiplier } : item
      );
      updateIfoodCosts(updated);
    } else if (section === 'other') {
      const updated = customOtherCosts.map(item => 
        item.id === id ? { ...item, multiplier } : item
      );
      updateCustomOtherCosts(updated);
    }
  };

  const resetSection = (section: string) => {
    if (section === 'store') {
      const reset = storeCosts.map(cost => ({ ...cost, quantity: 0 }));
      updateStoreCosts(reset);
    } else if (section === 'whatsapp') {
      const reset = whatsappCosts.map(cost => ({ ...cost, quantity: 0 }));
      updateWhatsappCosts(reset);
    } else if (section === 'ifood') {
      const reset = ifoodCosts.map(cost => ({ ...cost, quantity: 0 }));
      updateIfoodCosts(reset);
    } else if (section === 'other') {
      updateOtherCosts({
        cardFee: 0,
        motoKm: 0,
        rent: 0,
        electricity: 0,
        mei: 0,
        internet: 0
      });
      updateCustomOtherCosts([]);
    }
  };

  const calculateSectionTotal = (section: string) => {
    if (section === 'store') {
      return storeCosts.reduce((sum, cost) => sum + (cost.cost * cost.quantity), 0);
    } else if (section === 'whatsapp') {
      return whatsappCosts.reduce((sum, cost) => sum + (cost.cost * cost.quantity), 0);
    } else if (section === 'ifood') {
      return ifoodCosts.reduce((sum, cost) => sum + (cost.cost * cost.quantity), 0);
    } else if (section === 'other') {
      const fixedCosts = Object.values(otherCosts).reduce((sum, value) => sum + value, 0) + (otherCosts.motoKm * 0.4);
      const customCosts = customOtherCosts.reduce((sum, cost) => sum + (cost.cost * cost.quantity), 0);
      return fixedCosts + customCosts;
    }
    return 0;
  };

  const totalRevenue = revenue.store + revenue.whatsapp + revenue.ifood;
  const totalExpenses = calculateSectionTotal('store') + calculateSectionTotal('whatsapp') + calculateSectionTotal('ifood') + calculateSectionTotal('other');
  const profit = totalRevenue - totalExpenses;

  const tabs = [
    { id: 'store', label: 'Loja', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp Delivery', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'ifood', label: 'iFood', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'other', label: 'Outros Custos', icon: <Calculator className="w-4 h-4" /> },
    { id: 'revenue', label: 'Faturamento', icon: <DollarSign className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Controle de Custos" onBack={onBack} />
      
      <FirebaseStatus connected={connected} loading={loading} error={error} />
      
      <div className="p-4 max-w-md mx-auto">
        {/* Tabs */}
        <div className="flex bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Store Costs */}
        {activeTab === 'store' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Custo Venda na Loja</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => addCustomCostItem('store')}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteMode(!deleteMode)}
                    className={`p-2 rounded-lg transition-colors ${
                      deleteMode 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => resetSection('store')}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {storeCosts.map(cost => (
                  <div key={cost.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    {deleteMode && cost.isCustom && (
                      <button
                        onClick={() => removeCustomCostItem(cost.id, 'store')}
                        className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="flex-1 min-w-0">
                      {cost.isCustom ? (
                        <input
                          type="text"
                          value={cost.name}
                          onChange={(e) => updateCustomCostName(cost.id, e.target.value, 'store')}
                          className="w-full p-2 border rounded text-sm font-medium truncate"
                          placeholder="Nome do produto"
                        />
                      ) : (
                        <div className="font-medium text-gray-800 text-sm truncate">{cost.name}</div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <input
                        type="number"
                        value={cost.quantity}
                        onChange={(e) => updateCostQuantity(cost.id, parseInt(e.target.value) || 0, 'store')}
                        className="w-14 p-2 border rounded text-center text-sm"
                        min="0"
                      />
                      <span className="text-sm text-gray-600">x</span>
                      <input
                        type="number"
                        value={cost.cost}
                        onChange={(e) => updateCostPrice(cost.id, parseFloat(e.target.value) || 0, 'store')}
                        className="w-16 p-2 border rounded text-sm"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="text-sm font-semibold text-purple-600 w-20 text-right flex-shrink-0">
                      R$ {(cost.cost * cost.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-purple-600">
                    R$ {calculateSectionTotal('store').toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Delivery Costs */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Custo WhatsApp Delivery</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => addCustomCostItem('whatsapp')}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteMode(!deleteMode)}
                    className={`p-2 rounded-lg transition-colors ${
                      deleteMode 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => resetSection('whatsapp')}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {whatsappCosts.map(cost => (
                  <div key={cost.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    {deleteMode && cost.isCustom && (
                      <button
                        onClick={() => removeCustomCostItem(cost.id, 'whatsapp')}
                        className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="flex-1 min-w-0">
                      {cost.isCustom ? (
                        <input
                          type="text"
                          value={cost.name}
                          onChange={(e) => updateCustomCostName(cost.id, e.target.value, 'whatsapp')}
                          className="w-full p-2 border rounded text-sm font-medium truncate"
                          placeholder="Nome do produto"
                        />
                      ) : (
                        <div className="font-medium text-gray-800 text-sm truncate">{cost.name}</div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <input
                        type="number"
                        value={cost.quantity}
                        onChange={(e) => updateCostQuantity(cost.id, parseInt(e.target.value) || 0, 'whatsapp')}
                        className="w-14 p-2 border rounded text-center text-sm"
                        min="0"
                      />
                      <span className="text-sm text-gray-600">x</span>
                      <input
                        type="number"
                        value={cost.cost}
                        onChange={(e) => updateCostPrice(cost.id, parseFloat(e.target.value) || 0, 'whatsapp')}
                        className="w-16 p-2 border rounded text-sm"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="text-sm font-semibold text-purple-600 w-20 text-right flex-shrink-0">
                      R$ {(cost.cost * cost.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-purple-600">
                    R$ {calculateSectionTotal('whatsapp').toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* iFood Costs */}
        {activeTab === 'ifood' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Custo iFood</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => addCustomCostItem('ifood')}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteMode(!deleteMode)}
                    className={`p-2 rounded-lg transition-colors ${
                      deleteMode 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => resetSection('ifood')}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {ifoodCosts.map(cost => (
                  <div key={cost.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    {deleteMode && cost.isCustom && (
                      <button
                        onClick={() => removeCustomCostItem(cost.id, 'ifood')}
                        className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="flex-1 min-w-0">
                      {cost.isCustom ? (
                        <input
                          type="text"
                          value={cost.name}
                          onChange={(e) => updateCustomCostName(cost.id, e.target.value, 'ifood')}
                          className="w-full p-2 border rounded text-sm font-medium truncate"
                          placeholder="Nome do produto"
                        />
                      ) : (
                        <div className="font-medium text-gray-800 text-sm truncate">{cost.name}</div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <input
                        type="number"
                        value={cost.quantity}
                        onChange={(e) => updateCostQuantity(cost.id, parseInt(e.target.value) || 0, 'ifood')}
                        className="w-14 p-2 border rounded text-center text-sm"
                        min="0"
                      />
                      <span className="text-sm text-gray-600">x</span>
                      <input
                        type="number"
                        value={cost.cost}
                        onChange={(e) => updateCostPrice(cost.id, parseFloat(e.target.value) || 0, 'ifood')}
                        className="w-16 p-2 border rounded text-sm"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="text-sm font-semibold text-purple-600 w-20 text-right flex-shrink-0">
                      R$ {(cost.cost * cost.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-purple-600">
                    R$ {calculateSectionTotal('ifood').toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Costs */}
        {activeTab === 'other' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Outros Custos</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => addCustomCostItem('other')}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteMode(!deleteMode)}
                    className={`p-2 rounded-lg transition-colors ${
                      deleteMode 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => resetSection('other')}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taxa do Cartão
                  </label>
                  <input
                    type="number"
                    value={otherCosts.cardFee}
                    onChange={(e) => updateOtherCosts({ ...otherCosts, cardFee: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 border rounded-lg"
                    step="0.01"
                    placeholder="0,00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custo da Moto (km)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={otherCosts.motoKm}
                      onChange={(e) => updateOtherCosts({ ...otherCosts, motoKm: parseFloat(e.target.value) || 0 })}
                      className="flex-1 p-3 border rounded-lg"
                      placeholder="0"
                    />
                    <span className="text-gray-600">x 0,4</span>
                    <span className="text-purple-600 font-semibold">
                      R$ {(otherCosts.motoKm * 0.4).toFixed(2)}
                    </span>
                  </div>
                </div>

                {['rent', 'electricity', 'mei', 'internet'].map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {key === 'rent' ? 'Aluguel do dia' :
                       key === 'electricity' ? 'Luz' :
                       key === 'mei' ? 'MEI' : 'Internet'}
                    </label>
                    <input
                      type="number"
                      value={otherCosts[key as keyof typeof otherCosts]}
                      onChange={(e) => updateOtherCosts({ ...otherCosts, [key]: parseFloat(e.target.value) || 0 })}
                      className="w-full p-3 border rounded-lg"
                      step="0.01"
                      placeholder="0,00"
                    />
                  </div>
                ))}

                {/* Custom Other Costs */}
                {customOtherCosts.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Custos Personalizados</h4>
                    <div className="space-y-3">
                      {customOtherCosts.map(cost => (
                        <div key={cost.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          {deleteMode && (
                            <button
                              onClick={() => removeCustomCostItem(cost.id, 'other')}
                              className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={cost.name}
                              onChange={(e) => updateCustomCostName(cost.id, e.target.value, 'other')}
                              className="w-full p-2 border rounded text-sm font-medium truncate"
                              placeholder="Nome do produto"
                            />
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <input
                              type="number"
                              value={cost.quantity}
                              onChange={(e) => updateCostQuantity(cost.id, parseInt(e.target.value) || 0, 'other')}
                              className="w-14 p-2 border rounded text-center text-sm"
                              min="0"
                            />
                            <span className="text-sm text-gray-600">x</span>
                            <input
                              type="number"
                              value={cost.cost}
                              onChange={(e) => updateCostPrice(cost.id, parseFloat(e.target.value) || 0, 'other')}
                              className="w-16 p-2 border rounded text-sm"
                              step="0.01"
                            />
                          </div>
                          
                          <div className="text-sm font-semibold text-purple-600 w-20 text-right flex-shrink-0">
                            R$ {(cost.cost * cost.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-purple-600">
                    R$ {calculateSectionTotal('other').toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue */}
        {activeTab === 'revenue' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Faturamento</h3>
              
              <div className="space-y-4">
                {['store', 'whatsapp', 'ifood'].map((type) => (
                  <div key={type}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Faturamento {type === 'store' ? 'Loja' : type === 'whatsapp' ? 'WhatsApp' : 'iFood'}
                    </label>
                    <input
                      type="number"
                      value={revenue[type as keyof typeof revenue]}
                      onChange={(e) => updateRevenue({ ...revenue, [type]: parseFloat(e.target.value) || 0 })}
                      className="w-full p-3 border rounded-lg"
                      step="0.01"
                      placeholder="0,00"
                    />
                  </div>
                ))}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taxa do iFood (informativo)
                  </label>
                  <input
                    type="number"
                    value={revenue.ifoodFee}
                    onChange={(e) => updateRevenue({ ...revenue, ifoodFee: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 border rounded-lg"
                    step="0.01"
                    placeholder="0,00"
                  />
                </div>
              </div>
              
              <div className="border-t pt-4 mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Faturamento Total:</span>
                  <span className="font-bold text-blue-600">R$ {totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Despesas Total:</span>
                  <span className="font-bold text-red-600">R$ {totalExpenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-800">Lucro:</span>
                  <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {profit.toFixed(2)}
                  </span>
                </div>
                {revenue.ifoodFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxa do iFood:</span>
                    <span className="text-gray-600">R$ {revenue.ifoodFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  const message = `*RELATÓRIO DIÁRIO - REI GELADO*\n\n*FATURAMENTO:*\nLoja: R$ ${revenue.store.toFixed(2)}\nWhatsApp: R$ ${revenue.whatsapp.toFixed(2)}\niFood: R$ ${revenue.ifood.toFixed(2)}\nTotal: R$ ${totalRevenue.toFixed(2)}\n\n*DESPESAS:*\nR$ ${totalExpenses.toFixed(2)}\n\n*LUCRO:*\nR$ ${profit.toFixed(2)}\n\nTaxa iFood: R$ ${revenue.ifoodFee.toFixed(2)}`;
                  
                  const whatsappUrl = `https://wa.me/5521995813444?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors mt-6"
              >
                Gerar Relatório WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}