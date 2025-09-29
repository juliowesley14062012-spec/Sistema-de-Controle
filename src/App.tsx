import React, { useState } from 'react';
import { 
  ShoppingCart, 
  BarChart3, 
  MessageCircle, 
  Truck, 
  Calculator, 
  FileText, 
  Package, 
  Crown 
} from 'lucide-react';
import Header from './components/Header';
import MenuGrid from './components/MenuGrid';
import CashRegister from './components/CashRegister';
import SalesControl from './components/SalesControl';
import DeliverySales from './components/DeliverySales';
import CostControl from './components/CostControl';
import InventoryControl from './components/InventoryControl';

type Screen = 'home' | 'cash-register' | 'store-sales' | 'whatsapp-sales' | 'ifood-sales' | 'cost-control' | 'inventory';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  const menuOptions = [
    {
      id: 'cash-register',
      title: 'Caixa de Vendas',
      icon: <ShoppingCart className="w-8 h-8" />,
      color: 'bg-gradient-to-r from-purple-600 to-blue-600',
      onClick: () => setCurrentScreen('cash-register')
    },
    {
      id: 'store-sales',
      title: 'Controle de Vendas da Loja',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'bg-gradient-to-r from-blue-600 to-purple-600',
      onClick: () => setCurrentScreen('store-sales')
    },
    {
      id: 'whatsapp-sales',
      title: 'Controle de Vendas WhatsApp',
      icon: <MessageCircle className="w-8 h-8" />,
      color: 'bg-gradient-to-r from-green-600 to-blue-600',
      onClick: () => setCurrentScreen('whatsapp-sales')
    },
    {
      id: 'ifood-sales',
      title: 'Controle de Vendas iFood',
      icon: <Truck className="w-8 h-8" />,
      color: 'bg-gradient-to-r from-red-600 to-orange-600',
      onClick: () => setCurrentScreen('ifood-sales')
    },
    {
      id: 'cost-control',
      title: 'Controle de Custos',
      icon: <Calculator className="w-8 h-8" />,
      color: 'bg-gradient-to-r from-yellow-600 to-orange-600',
      onClick: () => setCurrentScreen('cost-control')
    },
    {
      id: 'inventory',
      title: 'Estoque',
      icon: <Package className="w-8 h-8" />,
      color: 'bg-gradient-to-r from-indigo-600 to-purple-600',
      onClick: () => setCurrentScreen('inventory')
    }
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'cash-register':
        return <CashRegister onBack={() => setCurrentScreen('home')} />;
      case 'store-sales':
        return (
          <SalesControl
            onBack={() => setCurrentScreen('home')}
            type="store"
            title="Controle de Vendas da Loja"
          />
        );
      case 'whatsapp-sales':
        return (
          <DeliverySales
            onBack={() => setCurrentScreen('home')}
            type="whatsapp"
            title="Controle de Vendas WhatsApp"
          />
        );
      case 'ifood-sales':
        return (
          <DeliverySales
            onBack={() => setCurrentScreen('home')}
            type="ifood"
            title="Controle de Vendas iFood"
          />
        );
      case 'cost-control':
        return <CostControl onBack={() => setCurrentScreen('home')} />;
      case 'inventory':
        return <InventoryControl onBack={() => setCurrentScreen('home')} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
            <Header title="Controle Rei Gelado" showLogo />
            
            {/* Hero Section */}
            <div className="text-center py-8 px-4">
              <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Crown className="w-10 h-10 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Sistema de Controle
              </h2>
              <p className="text-gray-600 max-w-sm mx-auto">
                Gerencie suas vendas, custos e estoque de forma profissional e organizada.
              </p>
            </div>

            <MenuGrid options={menuOptions} />
            
            {/* Footer */}
            <div className="text-center py-6 px-4">
              <div className="text-sm text-gray-500">
                <p>🍦 Açaiteria Rei Gelado</p>
                <p className="mt-1">Gestão inteligente para seu negócio</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderScreen();
}

export default App;