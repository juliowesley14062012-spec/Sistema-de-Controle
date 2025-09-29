import React, { useState, useEffect } from 'react';
import { Plus, Minus, Calculator, Trash2 } from 'lucide-react';
import Header from './Header';
import { MenuItem } from '../types';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import FirebaseStatus from './FirebaseStatus';

const MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Copo 100ml', price: 3.50 },
  { id: '2', name: 'Copo 200ml', price: 7.00 },
  { id: '3', name: 'Copo 300ml', price: 10.00 },
  { id: '4', name: 'Copo 400ml', price: 13.00 },
  { id: '5', name: 'Copo 500ml', price: 15.00 },
  { id: '6', name: 'Copo 770ml', price: 20.00 },
  { id: '7', name: 'Copo 1 Litro', price: 26.00 },
  { id: '8', name: 'Coberturas Fini', price: 1.00 },
  { id: '9', name: 'Cremes Especiais', price: 4.00 },
  { id: '10', name: 'Casquinha', price: 3.00 },
  { id: '11', name: 'Cestinha', price: 6.00 },
  { id: '12', name: 'Cestinha 2 bolas', price: 10.00 },
  { id: '13', name: 'Cestinha 3 bolas', price: 15.00 },
  { id: '14', name: 'Cremes Especiais na Cestinha', price: 2.00 },
  { id: '15', name: 'Sonho de Valsa', price: 2.00 },
  { id: '16', name: '3 Sonho de Valsa', price: 5.00 },
  { id: '17', name: 'Ouro Branco', price: 2.00 },
  { id: '18', name: '3 Ouro Branco', price: 5.00 },
  { id: '19', name: 'Biscoito Óreo', price: 4.00 },
  { id: '20', name: 'Picolé Normal', price: 2.00 },
  { id: '21', name: 'Picolé Promoção', price: 1.50 },
  { id: '22', name: 'Casquinha Pura', price: 0.70 },
  { id: '23', name: 'Cestinha Pura', price: 1.00 },
];

interface CashRegisterProps {
  onBack: () => void;
}

export default function CashRegister({ onBack }: CashRegisterProps) {
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [payment, setPayment] = useState<string>('');
  const { 
    data: storeSales, 
    updateData: updateStoreSales, 
    loading, 
    error, 
    connected 
  } = useFirebaseSync<any[]>('sales', 'store-sales', []);

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = (item.quantity || 1) + change;
        return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as MenuItem[]);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const paymentAmount = parseFloat(payment) || 0;
  const change = paymentAmount - total;

  const completeSale = () => {
    if (cart.length === 0) return;
    
    const sale = {
      id: Date.now().toString(),
      items: [...cart],
      total,
      date: new Date(),
      type: 'store' as const
    };
    
    updateStoreSales([...storeSales, sale]);
    setCart([]);
    setPayment('');
    alert('Venda registrada com sucesso!');
  };

  const clearCart = () => {
    setCart([]);
    setPayment('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Caixa de Vendas" onBack={onBack} />
      
      <FirebaseStatus connected={connected} loading={loading} error={error} />
      
      <div className="p-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500"
            >
              <div className="text-sm font-semibold text-gray-800 mb-1">
                {item.name}
              </div>
              <div className="text-lg font-bold text-purple-600">
                R$ {item.price.toFixed(2)}
              </div>
            </button>
          ))}
        </div>

        {/* Cart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-purple-600" />
            Carrinho
          </h3>
          
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Carrinho vazio</p>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        R$ {item.price.toFixed(2)} x {item.quantity}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="ml-4 font-bold text-purple-600">
                      R$ {(item.price * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Section */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-purple-800 mb-2">
                      Total da Compra
                    </label>
                    <div className="text-2xl font-bold text-purple-600">
                      R$ {total.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      Valor Pago
                    </label>
                    <input
                      type="number"
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                      className="w-full p-2 border rounded-lg text-lg font-semibold"
                      placeholder="0,00"
                      step="0.01"
                    />
                  </div>
                  
                  <div className={`p-4 rounded-lg ${change >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <label className={`block text-sm font-medium mb-2 ${change >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                      Troco
                    </label>
                    <div className={`text-2xl font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {Math.abs(change).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={completeSale}
                    disabled={cart.length === 0 || change < 0}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Finalizar Venda
                  </button>
                  
                  <button
                    onClick={clearCart}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}