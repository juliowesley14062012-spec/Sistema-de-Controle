export interface MenuItem {
  id: string;
  name: string;
  price: number;
  cost?: number;
  quantity?: number;
}

export interface Sale {
  id: string;
  items: MenuItem[];
  total: number;
  date: Date;
  type: 'store' | 'whatsapp' | 'ifood';
  notes?: string;
}

export interface CostItem {
  id: string;
  name: string;
  cost: number;
  quantity: number;
  unit: string;
  multiplier?: number;
  editable?: boolean;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  costPerUnit?: number;
}

export interface FreezerSlot {
  position: number;
  content: string;
  isEmpty: boolean;
}

export interface Freezer {
  id: number;
  slots: FreezerSlot[];
}