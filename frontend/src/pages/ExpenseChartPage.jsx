import React, { useMemo } from 'react'
import { layoutClasses } from '../assets/dummy'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { useOutletContext } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']

const ExpenseChartPage = () => {
  const { expenses = [] } = useOutletContext()

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const budget = parseFloat(localStorage.getItem('budget')) || 0
  const remainingBudget = Math.max(0, budget - totalExpenses)
  const budgetUsedPercentage = budget > 0 ? ((totalExpenses / budget) * 100).toFixed(1) : 0

  const budgetData = [
    { name: 'Spent', value: totalExpenses, color: '#ff7c7c' },
    { name: 'Remaining', value: remainingBudget, color: '#82ca9d' }
  ]

  const chartData = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    }, {})

    return Object.entries(categoryTotals).map(([category, total]) => ({
      name: category,
      value: total,
      percentage: ((total / totalExpenses) * 100).toFixed(1)
    }))
  }, [expenses, totalExpenses])

  return (
    <div className={layoutClasses.container}>
      <div className={layoutClasses.headerWrapper}>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
            <TrendingUp className='text-purple-500' />Expense Analytics
          </h1>
          <p className='text-sm text-gray-500 mt-1 ml-7'>
            Total Expenses: ${totalExpenses.toFixed(2)} | Budget: ${budget.toFixed(2)} | Used: {budgetUsedPercentage}%
          </p>
        </div>
      </div>

      {/* Budget Overview */}
      {budget > 0 && (
        <div className='bg-white p-6 rounded-lg shadow-sm border mb-6'>
          <h3 className='text-lg font-semibold mb-4'>Budget Overview</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='flex flex-col justify-center'>
              <div className='mb-4'>
                <div className='flex justify-between text-sm mb-1'>
                  <span>Budget Used</span>
                  <span>{budgetUsedPercentage}%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-3'>
                  <div
                    className={`h-3 rounded-full ${budgetUsedPercentage > 100 ? 'bg-red-500' : 'bg-purple-500'}`}
                    style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span>Total Budget:</span>
                  <span className='font-semibold'>${budget.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Total Spent:</span>
                  <span className='font-semibold'>${totalExpenses.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Remaining:</span>
                  <span className={`font-semibold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    ${remainingBudget.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
        {/* Pie Chart */}
        <div className='bg-white p-6 rounded-lg shadow-sm border'>
          <h3 className='text-lg font-semibold mb-4'>Expense Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className='bg-white p-6 rounded-lg shadow-sm border'>
          <h3 className='text-lg font-semibold mb-4'>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className='bg-white p-6 rounded-lg shadow-sm border mt-6'>
        <h3 className='text-lg font-semibold mb-4'>Detailed Summary</h3>
        <div className='overflow-x-auto'>
          <table className='min-w-full table-auto'>
            <thead>
              <tr className='bg-gray-50'>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Category</th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Amount</th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Percentage</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {chartData.map((item, index) => (
                <tr key={index}>
                  <td className='px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900'>{item.name}</td>
                  <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>${item.value.toFixed(2)}</td>
                  <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ExpenseChartPage
