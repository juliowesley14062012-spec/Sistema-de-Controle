import React from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showLogo?: boolean;
}

export default function Header({ title, onBack, showLogo = false }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        
        <div className="flex items-center gap-3 flex-1 justify-center">
          {showLogo && <ShoppingCart className="w-8 h-8 text-yellow-400" />}
          <h1 className="text-xl font-bold text-center">{title}</h1>
        </div>
        
        {onBack && <div className="w-10" />}
      </div>
    </header>
  );
}