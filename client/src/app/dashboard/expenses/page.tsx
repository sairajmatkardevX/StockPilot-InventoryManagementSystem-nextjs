'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAppSelector } from '@/app/redux';

type Expense = {
  expenseId: string;
  category: string;
  amount: number;
  timestamp: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  Salaries: '#1f77b4',
  Office: '#ff7f0e',
  Professional: '#2ca02c',
  Utilities: '#d62728',
  Others: '#9467bd',
};

const getCategoryColor = (category: string) =>
  CATEGORY_COLORS[category] || '#8c564b';

export default function ExpensesPage() {
  const { data: session, status } = useSession();
  const isDarkMode = useAppSelector(state => state.global.isDarkMode);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [applyDisabled, setApplyDisabled] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch expenses when session is authenticated
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchExpenses = async () => {
      try {
        const token = (session?.user as any)?.token;
        if (!token) throw new Error('No token found');

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          // Normalize backend data
          const normalized = data
            .filter(e => e.date && e.amount && e.category)
            .map(e => ({
              expenseId: e.id,
              category: e.category,
              amount: Number(e.amount),
              timestamp: e.date,
            }));

          setExpenses(normalized);

          const cats = normalized.map(e => e.category);
          setCategories(['All', ...Array.from(new Set(cats))]);

          const allDates = normalized.map(e => e.timestamp.split('T')[0]);
          const min = allDates.reduce((a, b) => (a < b ? a : b));
          const max = allDates.reduce((a, b) => (a > b ? a : b));

          setMinDate(min);
          setMaxDate(max);
          setStartDate(min);
          setEndDate(max);
          setAppliedStartDate(min);
          setAppliedEndDate(max);
        } else {
          // No expenses returned
          setExpenses([]);
          setCategories(['All']);
          setMinDate('');
          setMaxDate('');
          setStartDate('');
          setEndDate('');
          setAppliedStartDate('');
          setAppliedEndDate('');
        }
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setExpenses([]);
        setCategories(['All']);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [session, status]);

  // Update date range when category changes
  useEffect(() => {
    if (!expenses.length) return;
    let filtered = expenses;
    if (categoryFilter !== 'All') filtered = expenses.filter(e => e.category === categoryFilter);

    const dates = filtered.map(e => e.timestamp.split('T')[0]);
    const min = dates.length ? dates.reduce((a, b) => (a < b ? a : b)) : '';
    const max = dates.length ? dates.reduce((a, b) => (a > b ? a : b)) : '';

    setStartDate(min);
    setEndDate(max);
    setAppliedStartDate(min);
    setAppliedEndDate(max);
  }, [categoryFilter, expenses]);

  // Enable Apply button only when dates change
  useEffect(() => {
    setApplyDisabled(startDate === appliedStartDate && endDate === appliedEndDate);
  }, [startDate, endDate, appliedStartDate, appliedEndDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const dateOnly = expense.timestamp.split('T')[0];
      if (appliedStartDate && dateOnly < appliedStartDate) return false;
      if (appliedEndDate && dateOnly > appliedEndDate) return false;
      if (categoryFilter !== 'All' && expense.category !== categoryFilter) return false;
      return true;
    });
  }, [expenses, categoryFilter, appliedStartDate, appliedEndDate]);

  const pieData = useMemo(() => {
    const summary: Record<string, number> = {};
    filteredExpenses.forEach(e => {
      summary[e.category] = (summary[e.category] || 0) + e.amount;
    });
    return Object.entries(summary).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  const handleApplyFilters = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setApplyDisabled(true);
  };

  const handleResetFilters = () => {
    setCategoryFilter('All');
    setStartDate(minDate);
    setEndDate(maxDate);
    setAppliedStartDate(minDate);
    setAppliedEndDate(maxDate);
    setApplyDisabled(true);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Expenses Dashboard</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Category</label>
          <select
            className="border rounded-lg px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={categoryFilter || 'All'}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Start Date</label>
          <input
            type="date"
            className="border rounded-lg px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={startDate || ''}
            min={minDate || ''}
            max={maxDate || ''}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">End Date</label>
          <input
            type="date"
            className="border rounded-lg px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={endDate || ''}
            min={minDate || ''}
            max={maxDate || ''}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            applyDisabled
              ? 'bg-green-300 text-white cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          disabled={applyDisabled}
          onClick={handleApplyFilters}
        >
          Apply
        </button>

        <button
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
          onClick={handleResetFilters}
        >
          Reset
        </button>
      </div>

      {/* Pie Chart */}
      {pieData.length > 0 ? (
        <div className={`rounded-lg shadow p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {pieData.map(entry => (
                  <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No expenses found for selected filters.</p>
      )}
    </div>
  );
}