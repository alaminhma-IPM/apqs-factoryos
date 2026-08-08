export interface Material {
  id: string;
  sku: string;
  name: string;
  category: string;
  current_stock: number;
  daily_demand: number;
  lead_time_days: number;
  safety_stock: number;
  unit_price: number;
}

export function calculateROP(item: Material): number {
  return (item.daily_demand * item.lead_time_days) + item.safety_stock;
}

export function isLowStock(item: Material): boolean {
  return item.current_stock <= calculateROP(item);
}