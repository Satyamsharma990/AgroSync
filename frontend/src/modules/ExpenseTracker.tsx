import React, { useState, useEffect } from 'react';
import BigButton from '../components/BigButton';
import { IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import { api } from '../services/api';

const ExpenseTracker: React.FC = () => {
  const [showForm, setShowForm] = useState<'sale' | 'expense' | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [newAmount, setNewAmount] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [aiInsight, setAiInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/features/expenses');
      const data = res.data;
      setExpenses(data);

      const income = data.filter((e: any) => e.type === 'income').reduce((acc: number, curr: any) => acc + curr.amount, 0);
      const expense = data.filter((e: any) => e.type === 'expense').reduce((acc: number, curr: any) => acc + curr.amount, 0);

      setLoadingInsight(true);
      const aiRes = await api.post('/ai/chat', {
        message: `Analyze this farmer's finaces carefully: Income ₹${income}, Expenses ₹${expense}. Give precisely ONE short sentence (max 15 words) of brutally honest financial advice.`
      });
      setAiInsight(aiRes.data.response || "Keep tracking to get AI insights.");
      setLoadingInsight(false);
    } catch (err) {
      console.error(err);
      setLoadingInsight(false);
    }
  };

  const mockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/features/expenses', {
        amount: Number(newAmount),
        description: newDesc,
        type: showForm === 'sale' ? 'income' : 'expense',
        date: new Date().toISOString()
      });
      fetchExpenses();
      setShowForm(null);
      setNewAmount('');
      setNewDesc('');
      alert('Transaction successfully saved to records!');
    } catch (err) {
      console.error(err);
      alert('Failed to save transaction.');
    }
  };

  const totalIncome = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full">
      <h2 className="text-2xl font-bold text-secondary-green">Profit Tracker</h2>

      {/* Summary Card */}
      <div className="bg-primary-green text-white rounded-2xl p-6 shadow-lg shadow-primary-green/20">
        <h3 className="text-white/80 uppercase text-xs font-bold tracking-wider mb-2">Total Net Profit</h3>
        <div className="flex items-end gap-2 mb-4">
          <IndianRupee size={36} className="text-white" />
          <span className="text-4xl font-extrabold">{netProfit.toLocaleString('en-IN')}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
          <div>
            <span className="text-white/80 text-xs block mb-1">Income</span>
            <span className="font-bold flex items-center text-sm gap-1"><TrendingUp size={16} /> ₹{totalIncome.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-white/80 text-xs block mb-1">Expenses</span>
            <span className="font-bold flex items-center text-sm gap-1"><TrendingDown size={16} /> ₹{totalExpense.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* AI Financial Insight */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-teal-100 p-4 rounded-xl shadow-sm text-sm text-teal-800 font-medium">
        <span className="font-bold text-teal-900 block mb-1">Gemini AI Profit Insight:</span>
        {loadingInsight ? "Analyzing your financials..." : aiInsight}
      </div>

      {/* Quick Add */}
      {!showForm ? (
        <div className="flex gap-2">
          <BigButton variant="primary" label="Add Sale" icon={<TrendingUp size={18} />} className="text-sm py-3" onClick={() => setShowForm('sale')} />
          <BigButton variant="danger" label="Add Expense" icon={<TrendingDown size={18} />} className="text-sm py-3" onClick={() => setShowForm('expense')} />
        </div>
      ) : (
        <form onSubmit={mockSubmit} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 animate-fade-in">
          <h3 className="font-bold text-gray-800">
            {showForm === 'sale' ? 'Record New Sale' : 'Record New Expense'}
          </h3>
          <input type="number" required value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="Enter Amount (₹)" className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-green" />
          <input type="text" required value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (e.g., Sold Onion)" className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-green" />
          <div className="flex gap-2">
            <BigButton variant={showForm === 'sale' ? 'primary' : 'danger'} label="Save" type="submit" className="py-2 flex-1" />
            <BigButton variant="secondary" label="Cancel" onClick={() => setShowForm(null)} className="py-2 flex-1 bg-gray-400" />
          </div>
        </form>
      )}

      {/* Recent Transactions list */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">Recent Records</h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent records. Add a sale or expense.</p>
            ) : (
              expenses.map(txn => (
                <div key={txn.id} className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center border-l-4 ${txn.type === 'income' ? 'border-l-primary-green' : 'border-l-alert-red'}`}>
                  <div className="flex gap-3 items-center">
                    <div className={`p-2 rounded-lg ${txn.type === 'income' ? 'bg-primary-green/10' : 'bg-alert-red/10'}`}>
                      {txn.type === 'income' ? <TrendingUp className="text-primary-green" size={20} /> : <TrendingDown className="text-alert-red" size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{txn.description}</p>
                      <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${txn.type === 'income' ? 'text-primary-green' : 'text-alert-red'}`}>
                    {txn.type === 'income' ? '+' : '-'} ₹{txn.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ExpenseTracker;
