import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Minus, Package, Snowflake } from 'lucide-react';
import Header from './Header';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import FirebaseStatus from './FirebaseStatus';

interface InventoryControlProps {
  onBack: () => void;
}

interface StockItem {
  id: string;
  name: string;
  unitSize: number; // Size of each package (e.g., 1.5 for 1.5kg)
  unit: string; // kg, g, un, ml, L
  quantity: number; // Number of packages
  unitPrice: number; // Price per package
  totalPrice: number;
  costPerUnit?: number;
}

interface FreezerSlot {
  position: number;
  content: string;
  isEmpty: boolean;
}

const INITIAL_STOCK: StockItem[] = [
  { id: '1', name: 'Jujubas', unitSize: 1, unit: 'kg', quantity: 1, unitPrice: 12.95, totalPrice: 12.95, costPerUnit: 0.013 },
  { id: '2', name: 'Chocoball', unitSize: 1, unit: 'kg', quantity: 1, unitPrice: 21.49, totalPrice: 21.49, costPerUnit: 0.021 },
  { id: '3', name: 'Amendoim', unitSize: 1, unit: 'kg', quantity: 1, unitPrice: 14.49, totalPrice: 14.49, costPerUnit: 0.014 },
  { id: '4', name: 'Disquete', unitSize: 1, unit: 'kg', quantity: 5, unitPrice: 25.10, totalPrice: 125.49, costPerUnit: 0.025 },
  { id: '5', name: 'Granulado', unitSize: 1, unit: 'kg', quantity: 1, unitPrice: 18.49, totalPrice: 18.49, costPerUnit: 0.018 },
  { id: '6', name: 'Paçoca', unitSize: 1, unit: 'kg', quantity: 1, unitPrice: 14.49, totalPrice: 14.49, costPerUnit: 0.014 },
  { id: '7', name: 'Leite em Pó', unitSize: 1, unit: 'kg', quantity: 1, unitPrice: 24.41, totalPrice: 24.41, costPerUnit: 0.024 },
  { id: '8', name: 'Sucrilhos', unitSize: 1, unit: 'kg', quantity: 1, unitPrice: 20.49, totalPrice: 20.49, costPerUnit: 0.020 },
  { id: '9', name: 'Flocos de Arroz', unitSize: 1, unit: 'kg', quantity: 1, unitPrice: 17.39, totalPrice: 17.39, costPerUnit: 0.017 },
  { id: '10', name: 'Ovomaltine', unitSize: 750, unit: 'g', quantity: 1, unitPrice: 28.99, totalPrice: 28.99, costPerUnit: 0.039 },
  { id: '11', name: 'Granola', unitSize: 1, unit: 'kg', quantity: 1, unitPrice: 17.49, totalPrice: 17.49, costPerUnit: 0.017 },
  { id: '12', name: 'Guardanapo', unitSize: 2000, unit: 'un', quantity: 1, unitPrice: 16.59, totalPrice: 16.59, costPerUnit: 0.008 },
  { id: '13', name: 'Tampas 330ml', unitSize: 1000, unit: 'un', quantity: 1, unitPrice: 271.36, totalPrice: 271.36, costPerUnit: 0.271 },
  { id: '14', name: 'Tampas 440/550ml', unitSize: 1000, unit: 'un', quantity: 1, unitPrice: 285.95, totalPrice: 285.95, costPerUnit: 0.286 },
  { id: '15', name: 'Tampas 770ml', unitSize: 600, unit: 'un', quantity: 1, unitPrice: 204.10, totalPrice: 204.10, costPerUnit: 0.340 },
  { id: '16', name: 'Copos 200ml', unitSize: 2500, unit: 'un', quantity: 1, unitPrice: 94.90, totalPrice: 94.90, costPerUnit: 0.038 },
  { id: '17', name: 'Copos 300ml', unitSize: 2000, unit: 'un', quantity: 1, unitPrice: 142.99, totalPrice: 142.99, costPerUnit: 0.071 },
  { id: '18', name: 'Copos 330ml', unitSize: 1000, unit: 'un', quantity: 1, unitPrice: 139.95, totalPrice: 139.95, costPerUnit: 0.140 },
  { id: '19', name: 'Copos 400ml', unitSize: 1000, unit: 'un', quantity: 1, unitPrice: 181.95, totalPrice: 181.95, costPerUnit: 0.182 },
  { id: '20', name: 'Copos 440ml', unitSize: 1000, unit: 'un', quantity: 1, unitPrice: 215.90, totalPrice: 215.90, costPerUnit: 0.216 },
  { id: '21', name: 'Copos 500ml', unitSize: 1000, unit: 'un', quantity: 1, unitPrice: 143.49, totalPrice: 143.49, costPerUnit: 0.143 },
  { id: '22', name: 'Copos 550ml', unitSize: 1000, unit: 'un', quantity: 1, unitPrice: 249.49, totalPrice: 249.49, costPerUnit: 0.249 },
  { id: '23', name: 'Copos 770ml', unitSize: 600, unit: 'un', quantity: 1, unitPrice: 252.85, totalPrice: 252.85, costPerUnit: 0.421 },
  { id: '24', name: 'Copos 100ml', unitSize: 2000, unit: 'un', quantity: 1, unitPrice: 76.14, totalPrice: 76.14, costPerUnit: 0.038 },
  { id: '25', name: 'Copos 1L c/ Tampa', unitSize: 150, unit: 'un', quantity: 1, unitPrice: 133.49, totalPrice: 133.49, costPerUnit: 0.890 },
  { id: '26', name: 'Biscoito', unitSize: 343, unit: 'un', quantity: 1, unitPrice: 27.49, totalPrice: 27.49, costPerUnit: 0.080 },
  { id: '27', name: 'Cestinha', unitSize: 120, unit: 'un', quantity: 1, unitPrice: 51.99, totalPrice: 51.99, costPerUnit: 0.433 },
  { id: '28', name: 'Casquinhas', unitSize: 300, unit: 'un', quantity: 1, unitPrice: 62.00, totalPrice: 62.00, costPerUnit: 0.207 },
];

export default function InventoryControl({ onBack }: InventoryControlProps) {
  const [activeTab, setActiveTab] = useState('freezer');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{freezer: number, position: number} | null>(null);
  const [editValue, setEditValue] = useState('');
  
  // Ref for the freezer input field
  const freezerInputRef = useRef<HTMLInputElement>(null);
  
  // Firebase sync for stock items
  const { 
    data: stock, 
    updateData: updateStock, 
    loading: stockLoading, 
    error: stockError, 
    connected: stockConnected 
  } = useFirebaseSync<StockItem[]>('inventory', 'stock-items', INITIAL_STOCK);
  
  // Firebase sync for freezer 1
  const { 
    data: freezer1, 
    updateData: updateFreezer1, 
    loading: freezer1Loading, 
    error: freezer1Error, 
    connected: freezer1Connected 
  } = useFirebaseSync<FreezerSlot[]>('inventory', 'freezer-1', 
    Array.from({ length: 8 }, (_, i) => ({ position: i + 1, content: '', isEmpty: true }))
  );
  
  // Firebase sync for freezer 2
  const { 
    data: freezer2, 
    updateData: updateFreezer2, 
    loading: freezer2Loading, 
    error: freezer2Error, 
    connected: freezer2Connected 
  } = useFirebaseSync<FreezerSlot[]>('inventory', 'freezer-2',
    Array.from({ length: 8 }, (_, i) => ({ position: i + 1, content: '', isEmpty: true }))
  );

  // Overall connection status
  const connected = stockConnected && freezer1Connected && freezer2Connected;
  const loading = stockLoading || freezer1Loading || freezer2Loading;
  const error = stockError || freezer1Error || freezer2Error;

  // Custom calculator states for each item
  const [customCalculators, setCustomCalculators] = useState<{[key: string]: {amount1: number, amount2: number}}>({});

  // Effect to focus the input when selectedSlot changes
  useEffect(() => {
    if (selectedSlot && freezerInputRef.current) {
      // Use setTimeout to ensure the DOM has been updated
      setTimeout(() => {
        freezerInputRef.current?.focus();
      }, 100);
    }
  }, [selectedSlot]);

  const updateFreezerSlot = (freezerNum: number, position: number, content: string) => {
    const updateSlot = (slots: FreezerSlot[]) => 
      slots.map(slot => 
        slot.position === position 
          ? { ...slot, content, isEmpty: !content.trim() }
          : slot
      );

    if (freezerNum === 1) {
      updateFreezer1(updateSlot(freezer1));
    } else {
      updateFreezer2(updateSlot(freezer2));
    }
    
    // Clear selection after update
    setSelectedSlot(null);
    setEditValue('');
  };

  const selectSlot = (freezerNum: number, position: number) => {
    const slots = freezerNum === 1 ? freezer1 : freezer2;
    const slot = (Array.isArray(slots) ? slots : []).find(s => s.position === position);
    setSelectedSlot({ freezer: freezerNum, position });
    setEditValue(slot?.content || '');
  };

  const saveSlotContent = () => {
    if (selectedSlot) {
      updateFreezerSlot(selectedSlot.freezer, selectedSlot.position, editValue);
    }
  };

  const clearSlotContent = () => {
    if (selectedSlot) {
      updateFreezerSlot(selectedSlot.freezer, selectedSlot.position, '');
    }
  };
  const updateStockQuantity = (id: string, change: number) => {
    const updatedStock = (Array.isArray(stock) ? stock : []).map(item => 
      item.id === id 
        ? { 
            ...item, 
            quantity: Math.max(0, item.quantity + change),
            totalPrice: Math.max(0, item.quantity + change) * item.unitPrice
          }
        : item
    );
    updateStock(updatedStock);
  };

  const addNewStockItem = () => {
    const newItem: StockItem = {
      id: Date.now().toString(),
      name: 'Novo Item',
      unitSize: 1,
      unit: 'kg',
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
      costPerUnit: 0
    };
    updateStock([...(Array.isArray(stock) ? stock : []), newItem]);
  };

  const updateStockItem = (id: string, field: keyof StockItem, value: string | number) => {
    const updatedStock = (Array.isArray(stock) ? stock : []).map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // Recalculate total price when quantity or unitPrice changes
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = updated.quantity * updated.unitPrice;
        }
        
        // Calculate cost per unit based on unit type
        if (field === 'quantity' || field === 'unitPrice' || field === 'unitSize' || field === 'unit') {
          if (updated.unit === 'kg' && updated.unitSize > 0 && updated.unitPrice > 0) {
            updated.costPerUnit = updated.unitPrice / (updated.unitSize * 1000); // cost per gram
          } else if (updated.unit === 'g' && updated.unitSize > 0 && updated.unitPrice > 0) {
            updated.costPerUnit = updated.unitPrice / updated.unitSize; // cost per gram
          } else if (updated.unit === 'un' && updated.unitSize > 0 && updated.unitPrice > 0) {
            updated.costPerUnit = updated.unitPrice / updated.unitSize; // cost per unit
          } else if ((updated.unit === 'ml' || updated.unit === 'L') && updated.unitSize > 0 && updated.unitPrice > 0) {
            const mlSize = updated.unit === 'L' ? updated.unitSize * 1000 : updated.unitSize;
            updated.costPerUnit = updated.unitPrice / mlSize; // cost per ml
          }
        }
        
        return updated;
      }
      return item;
    });
    updateStock(updatedStock);
  };

  const updateCustomCalculator = (itemId: string, field: 'amount1' | 'amount2', value: number) => {
    setCustomCalculators(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const getCustomCalculator = (itemId: string) => {
    return customCalculators[itemId] || { amount1: 1, amount2: 1 };
  };

  const calculateCustomCost = (item: StockItem, amount: number) => {
    if (!item.costPerUnit) return 0;
    return item.costPerUnit * amount;
  };

  const filteredStock = (Array.isArray(stock) ? stock : []).filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInventoryValue = (Array.isArray(stock) ? stock : []).reduce((sum, item) => sum + item.totalPrice, 0);

  const FreezerGrid = ({ freezerNum, slots, onUpdate }: { 
    freezerNum: number; 
    slots: FreezerSlot[]; 
    onUpdate: (freezerNum: number, position: number) => void;
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Snowflake className="w-5 h-5 text-blue-500" />
        Freezer {freezerNum}
      </h3>
      
      <div className="grid grid-cols-4 gap-2 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
        {/* Top row: positions 1,3,5,7 */}
        <div className="grid grid-cols-4 gap-3 col-span-4 mb-2">
          {[1, 3, 5, 7].map(pos => {
            const slot = (Array.isArray(slots) ? slots : []).find(s => s.position === pos);
            const isSelected = selectedSlot?.freezer === freezerNum && selectedSlot?.position === pos;
            return (
              <div key={pos} className="relative">
                <div className="text-sm text-center font-bold text-blue-600 mb-2">{pos}</div>
                <button
                  onClick={() => onUpdate(freezerNum, pos)}
                  className={`w-full p-3 text-sm rounded border-2 text-center transition-all ${
                    isSelected
                      ? 'bg-yellow-200 border-yellow-500 text-yellow-800 font-bold'
                      : slot?.isEmpty 
                        ? 'bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200' 
                        : 'bg-blue-100 border-blue-400 text-blue-800 font-medium hover:bg-blue-200'
                  }`}
                >
                  {slot?.content || 'Vazio'}
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Bottom row: positions 2,4,6,8 */}
        <div className="grid grid-cols-4 gap-3 col-span-4">
          {[2, 4, 6, 8].map(pos => {
            const slot = (Array.isArray(slots) ? slots : []).find(s => s.position === pos);
            const isSelected = selectedSlot?.freezer === freezerNum && selectedSlot?.position === pos;
            return (
              <div key={pos} className="relative">
                <div className="text-sm text-center font-bold text-blue-600 mb-2">{pos}</div>
                <button
                  onClick={() => onUpdate(freezerNum, pos)}
                  className={`w-full p-3 text-sm rounded border-2 text-center transition-all ${
                    isSelected
                      ? 'bg-yellow-200 border-yellow-500 text-yellow-800 font-bold'
                      : slot?.isEmpty 
                        ? 'bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200' 
                        : 'bg-blue-100 border-blue-400 text-blue-800 font-medium hover:bg-blue-200'
                  }`}
                >
                  {slot?.content || 'Vazio'}
                </button>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Estoque" onBack={onBack} />
      
      <FirebaseStatus connected={connected} loading={loading} error={error} />
      
      <div className="p-4 max-w-md mx-auto">
        {/* Tabs */}
        <div className="flex bg-white rounded-lg shadow-md mb-6">
          <button
            onClick={() => setActiveTab('freezer')}
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'freezer'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Snowflake className="w-4 h-4" />
            Freezers
          </button>
          <button
            onClick={() => setActiveTab('supplies')}
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'supplies'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Package className="w-4 h-4" />
            Guloseimas
          </button>
        </div>

        {/* Freezer Tab */}
        {activeTab === 'freezer' && (
          <div className="space-y-6">
            {/* Freezer Editor */}
            {selectedSlot && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-400">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Snowflake className="w-5 h-5 text-yellow-500" />
                  Editando Freezer {selectedSlot.freezer} - Posição {selectedSlot.position}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conteúdo da Posição
                    </label>
                    <input
                      type="text"
                      ref={freezerInputRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full p-3 border-2 border-yellow-400 rounded-lg text-lg"
                      placeholder="Digite o conteúdo..."
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={saveSlotContent}
                      className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={clearSlotContent}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                      Limpar
                    </button>
                    <button
                      onClick={() => setSelectedSlot(null)}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <FreezerGrid 
              freezerNum={1} 
              slots={freezer1} 
              onUpdate={(freezerNum, pos) => selectSlot(freezerNum, pos)} 
            />
            <FreezerGrid 
              freezerNum={2} 
              slots={freezer2} 
              onUpdate={(freezerNum, pos) => selectSlot(freezerNum, pos)} 
            />
          </div>
        )}

        {/* Supplies Tab */}
        {activeTab === 'supplies' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Procurar item..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
              />
            </div>

            {/* Add Item Button */}
            <button
              onClick={addNewStockItem}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar Produto
            </button>

            {/* Total Inventory Value */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-sm opacity-90 mb-1">Valor Total do Estoque</div>
                <div className="text-3xl font-bold">R$ {totalInventoryValue.toFixed(2)}</div>
              </div>
            </div>

            {/* Stock Items */}
            <div className="space-y-6">
              {filteredStock.map(item => {
                const calculator = getCustomCalculator(item.id);
                return (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
                    {/* Product Name */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Produto</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateStockItem(item.id, 'name', e.target.value)}
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>

                    {/* Unit Size and Unit Type */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unidade</label>
                        <input
                          type="number"
                          value={item.unitSize}
                          onChange={(e) => updateStockItem(item.id, 'unitSize', parseFloat(e.target.value) || 0)}
                          className="w-full p-3 border rounded-lg"
                          step="0.01"
                          placeholder="1.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                        <select
                          value={item.unit}
                          onChange={(e) => updateStockItem(item.id, 'unit', e.target.value)}
                          className="w-full p-3 border rounded-lg"
                        >
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="un">un</option>
                          <option value="L">L</option>
                          <option value="ml">ml</option>
                        </select>
                      </div>
                    </div>

                    {/* Quantity and Unit Price */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateStockQuantity(item.id, -1)}
                            className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateStockItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="flex-1 p-3 border rounded-lg text-center"
                            min="0"
                          />
                          <button
                            onClick={() => updateStockQuantity(item.id, 1)}
                            className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preço Unit.</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateStockItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full p-3 border rounded-lg"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                      <div className="p-3 bg-purple-50 rounded-lg font-semibold text-purple-600 text-lg">
                        R$ {item.totalPrice.toFixed(2)}
                      </div>
                    </div>

                    {/* Custom Unit Cost Calculator */}
                    <div className="border-t pt-4">
                      <div className="text-sm font-medium text-gray-700 mb-3">Calculadora de Custo por Unidade</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={calculator.amount1}
                              onChange={(e) => updateCustomCalculator(item.id, 'amount1', parseFloat(e.target.value) || 1)}
                              className="w-16 p-2 border rounded text-center text-sm"
                              min="1"
                            />
                            <span className="text-sm text-gray-600">
                              {item.unit === 'kg' || item.unit === 'g' ? 'g' : item.unit} =
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              R$ {calculateCustomCost(item, calculator.amount1).toFixed(4)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-16 text-center text-sm text-gray-600">100g =</span>
                            <span className="text-sm font-semibold text-green-600">
                              R$ {calculateCustomCost(item, 100).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={calculator.amount2}
                              onChange={(e) => updateCustomCalculator(item.id, 'amount2', parseFloat(e.target.value) || 1)}
                              className="w-16 p-2 border rounded text-center text-sm"
                              min="1"
                            />
                            <span className="text-sm text-gray-600">un =</span>
                            <span className="text-sm font-semibold text-blue-600">
                              R$ {calculateCustomCost(item, calculator.amount2).toFixed(3)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-16 text-center text-sm text-gray-600">5 un =</span>
                            <span className="text-sm font-semibold text-blue-600">
                              R$ {calculateCustomCost(item, 5).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
