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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type Expense = {
  expenseId: string;
  category: string;
  amount: number;
  timestamp: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  Salaries: 'hsl(var(--chart-1))',
  Office: 'hsl(var(--chart-2))',
  Professional: 'hsl(var(--chart-3))',
  Utilities: 'hsl(var(--chart-4))',
  Others: 'hsl(var(--chart-5))',
};

const getCategoryColor = (category: string) =>
  CATEGORY_COLORS[category] || 'hsl(var(--muted-foreground))';

export default function ExpensesPage() {
  const { data: session, status } = useSession();

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
        const res = await fetch('/api/expense');
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
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
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-16 w-40" />
          <Skeleton className="h-16 w-40" />
          <Skeleton className="h-16 w-40" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses Dashboard</CardTitle>
          <CardDescription>View and analyze your expense data</CardDescription>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                className="w-40"
                value={startDate}
                min={minDate}
                max={maxDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                className="w-40"
                value={endDate}
                min={minDate}
                max={maxDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>

            <Button
              disabled={applyDisabled}
              onClick={handleApplyFilters}
              className="h-10"
            >
              Apply
            </Button>

            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="h-10"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      {pieData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>Breakdown of expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No expenses found for selected filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}