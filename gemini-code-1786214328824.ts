import React, { useState, useEffect } from 'react';
import { Sun, Moon, BellRing, Activity, Clock, DollarSign, Check, X, Edit3 } from 'lucide-react';
import { Material, calculateROP, isLowStock } from './db';

const initialMaterials: Material[] = [
  { id: '1', sku: 'RM-MILK-001', name: 'حليب خام طازج (لتر)', category: 'مواد خام', current_stock: 450, daily_demand: 50, lead_time_days: 8, safety_stock: 100, unit_price: 1.20 },
  { id: '2', sku: 'RM-JUICE-002', name: 'مركز عصير برتقال', category: 'مواد خام', current_stock: 1200, daily_demand: 30, lead_time_days: 7, safety_stock: 90, unit_price: 3.50 },
  { id: '3', sku: 'PKG-BOX-100', name: 'كرتون تغليف مقوى', category: 'تعبئة وتغليف', current_stock: 2500, daily_demand: 200, lead_time_days: 5, safety_stock: 300, unit_price: 0.45 }
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Material>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleEdit = (row: Material) => {
    setEditingId(row.id);
    setEditForm(row);
  };

  const handleSave = (id: string) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, ...editForm } as Material : m));
    setEditingId(null);
  };

  const filteredData = materials.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              APQS FactoryOS
            </h1>
            <p className="text-xs text-slate-500 mt-1">Advanced Path for Quality Systems</p>
          </div>
          <button onClick={() => setIsDark(!isDark)} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
        </header>

        <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 p-4 shadow-xl">
          <input
            type="text"
            placeholder="Search SKU or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mb-4 w-64"
          />
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">SKU</th>
                <th className="p-3">Name</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">ROP</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => {
                const isEditing = editingId === row.id;
                return (
                  <tr key={row.id} className="border-b border-slate-200 dark:border-slate-800">
                    <td className="p-3 font-mono font-bold text-blue-500">{row.sku}</td>
                    <td className="p-3">{row.name}</td>
                    <td className="p-3 font-bold">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.current_stock ?? row.current_stock}
                          onChange={(e) => setEditForm({ ...editForm, current_stock: Number(e.target.value) })}
                          className="w-20 px-2 py-1 text-xs rounded bg-white dark:bg-slate-800 border border-blue-500 text-slate-900 dark:text-white"
                        />
                      ) : (
                        row.current_stock
                      )}
                    </td>
                    <td className="p-3">{calculateROP(row)}</td>
                    <td className="p-3 text-center">
                      {isEditing ? (
                        <button onClick={() => handleSave(row.id)} className="p-1 rounded bg-emerald-500/20 text-emerald-500">
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(row)} className="p-1 rounded bg-slate-200 dark:bg-slate-800">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}