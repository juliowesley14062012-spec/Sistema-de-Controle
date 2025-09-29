import React from 'react';

interface MenuOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

interface MenuGridProps {
  options: MenuOption[];
}

export default function MenuGrid({ options }: MenuGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 max-w-md mx-auto">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={option.onClick}
          className={`${option.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex flex-col items-center gap-3`}
        >
          <div className="text-3xl">
            {option.icon}
          </div>
          <span className="font-semibold text-sm text-center leading-tight">
            {option.title}
          </span>
        </button>
      ))}
    </div>
  );
}