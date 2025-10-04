import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { TrendingUp, Circle, Clock, Zap, DollarSign } from 'lucide-react'

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/expenses`

const Layout = ({ user = {}, onLogout }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch expenses from backend
  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token found');

      const { data } = await axios.get(`${API_URL}/gp`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.expenses)
          ? data.expenses
          : Array.isArray(data?.data)
            ? data.data
            : []

      setExpenses(arr)
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
      if (err.response?.status === 401 && onLogout) {
        onLogout()
      }
    } finally {
      setLoading(false)
    }
  }, [onLogout])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses]);

  // Expense statistics
  const stats = useMemo(() => {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const totalCount = expenses.length;
    const averageSpent = totalCount ? (totalSpent / totalCount).toFixed(2) : 0
    const categories = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + 1
      return acc
    }, {})
    const topCategory = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b, 'None')

    return { totalCount, totalSpent: totalSpent.toFixed(2), averageSpent, topCategory }
  }, [expenses])

  // Statistic card
  const StatCard = ({ title, value, icon }) => (
    <div className="p-3 rounded-xl bg-white shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 group-hover:from-fuchsia-500/20 group-hover:to-purple-500/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-xs text-gray-500 font-medium">{title}</p>
        </div>
      </div>
    </div>
  )

  // Loading state
  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    )

  // Error state
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md">
          <p className="font-medium mb-2">Error Loading Expenses</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchExpenses}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} expenses={expenses} />

      <div className="ml-0 xl:ml-64 lg:ml-64 md:ml-64 pt-16 p-3 sm:p-4 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-3 sm:space-y-4">
            <Outlet context={{ expenses, refreshExpenses: fetchExpenses }} />
          </div>

          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-purple-100">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                Expense Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <StatCard title="Total Expenses" value={stats.totalCount} icon={<Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />} />
                <StatCard title="Total Spent" value={`$${stats.totalSpent}`} icon={<DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />} />
                <StatCard title="Average" value={`$${stats.averageSpent}`} icon={<Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fuchsia-500" />} />
                <StatCard title="Top Category" value={stats.topCategory} icon={<Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />} />
              </div>
            </div>
            <div className='bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-purple-100'>
              <h3 className='text-base sm:text-lg font-semibold sm:mb-4 text-gray-800 flex items-center gap-2'>
                <Clock className='w-4 h-4 sm:w-5 sm:h-5 text-purple-500' />
                Recent Expenses
              </h3>
              <div className='space-y-2 sm:space-y-3'>
                {expenses.slice(0, 3).map((expense) => (
                  <div key={expense._id || expense.id} className='flex items-center justify-between p-2 sm:p-3 hover:bg-purple-50/50 rounded-lg transition-colors duration-200 border border-transparent hover:border-purple-100'>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-700 break-words whitespace-normal'>
                        ${expense.amount.toFixed(2)} - {expense.category}
                      </p>
                      <p className='text-xs text-gray-500 mt-0.5'>
                        {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : "No date"}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 bg-blue-100 text-blue-700`}>
                      {expense.note || 'No note'}
                    </span>
                  </div>
                ))}
                {expenses.length === 0 && (
                  <div className='text-center py-4 sm:py-6 px-2'>
                    <div className='w-12 h-12 sm:w-16 sm:h-16 mx-auto sm:mb-4 rounded-full bg-purple-100 flex items-center justify-center'>
                      <Clock className='w-6 h-6 sm:w-8 sm:h-8 text-purple-500' />
                    </div>
                    <p className='text-sm text-gray-500'>
                      No recent expenses
                    </p>
                    <p className='text-xs text-gray-400'>
                      Expenses will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
