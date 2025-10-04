import React, { useCallback, useState, useMemo } from 'react'
import { ADD_BUTTON, EMPTY_STATE, FILTER_WRAPPER, HEADER, ICON_WRAPPER, LABEL_CLASS, SELECT_CLASSES, STAT_CARD, STATS_GRID, TAB_ACTIVE, TAB_BASE, TAB_INACTIVE, TABS_WRAPPER, VALUE_CLASS, WRAPPER } from '../assets/dummy'
import { HomeIcon, CalendarIcon, Filter, Plus, DollarSign, PieChart } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import ExpenseItem from '../components/ExpenseItem'
import ExpenseModel from '../components/ExpenseModel'
import Sidebar from '../components/Sidebar'
import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'https://task-tracker-backend-vtvb.onrender.com/'}/api/expenses`

const Dashboard = () => {
    const outletContext = useOutletContext() || {}
    const { expenses = [], refreshExpenses = () => {} } = outletContext

    const [showModel, setShowModel] = useState(false)
    const [selectedExpense, setSelectedExpense] = useState(null)
    const [filter, setFilter] = useState("all")
    const [summary, setSummary] = useState({})

    const FILTER_OPTIONS = ['all', 'Food', 'Travel', 'Bills', 'Entertainment', 'Other']
    const FILTER_LABELS = {
        all: 'All Expenses',
        Food: 'Food Expenses',
        Travel: 'Travel Expenses',
        Bills: 'Bills',
        Entertainment: 'Entertainment',
        Other: 'Other Expenses'
    }

    const stats = useMemo(() => {
        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
        const byCategory = expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount
            return acc
        }, {})
        return {
            total: expenses.length,
            totalSpent: totalSpent.toFixed(2),
            food: byCategory.Food?.toFixed(2) || '0.00',
            travel: byCategory.Travel?.toFixed(2) || '0.00',
            bills: byCategory.Bills?.toFixed(2) || '0.00'
        }
    }, [expenses])

    const STATS = [
        { key: 'total', label: 'Total Expenses', icon: PieChart, iconColor: 'bg-blue-100 text-blue-600', valueKey: 'total', textColor: 'text-blue-600' },
        { key: 'totalSpent', label: 'Total Spent', icon: DollarSign, iconColor: 'bg-green-100 text-green-600', valueKey: 'totalSpent', textColor: 'text-green-600', gradient: true },
        { key: 'food', label: 'Food', icon: DollarSign, iconColor: 'bg-orange-100 text-orange-600', valueKey: 'food', textColor: 'text-orange-600' },
        { key: 'travel', label: 'Travel', icon: DollarSign, iconColor: 'bg-purple-100 text-purple-600', valueKey: 'travel', textColor: 'text-purple-600' }
    ]

    const filteredExpenses = useMemo(() => expenses.filter(expense => {
        if (filter === 'all') return true
        return expense.category === filter
    }), [expenses, filter])

    const handleExpenseSave = useCallback(async (expenseData) => {
        try {
            if (expenseData.id) await axios.put(`${API_URL}/${expenseData.id}/gp`, expenseData)
            refreshExpenses()
            setShowModel(false)
            setSelectedExpense(null)
        } catch (error) {
            console.error("error saving expense: ", error);
        }
    }, [refreshExpenses])

  return (
    <div className={WRAPPER}>
        {/* Header */}
        <div className={HEADER}>
            <div className='min-w-0'>
                <h1 className='text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
                    <HomeIcon className='text-purple-500 w-5 h-5 md:w-6 md:h-6 shrink-0' />
                    <span className='truncate'>Expense Overview</span>
                </h1>
                <p className='text-sm text-gray-500 mt-1 ml-7 truncate'>Track your expenses efficiently</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setShowModel(true)} className={ADD_BUTTON}>
                    <Plus size={18} />
                    Add New Expense
                </button>
            </div>
        </div>
        {/* stats cars */}
        <div className={STATS_GRID}>
            {STATS.map(({
                key,label,icon:Icon,iconColor,borderColor ="border-purple-100",
                valueKey,textColor,gradient
            }) =>(
                <div key={key} className={`${STAT_CARD} ${borderColor}`}>
                    <div className='flex items-center gap-2 md:gap-3'>
                        <div className={`${ICON_WRAPPER} ${iconColor}`}>
                            <Icon className='w-4 h-4 md:w-4 md:h-4' />

                        </div>
                        <div className='min-w-0'>
                            <p className={`${VALUE_CLASS} ${gradient ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent"
                                :textColor}`}>{stats[valueKey]}</p>
                            <p className={LABEL_CLASS}>{label}</p>

                        </div>   

                    </div>

                </div>
            ))}
            </div>

            {/* contents */}
            <div className='space-y-6'>
                {/* filter */}
                <div className={FILTER_WRAPPER}>
                    <div className='flex items-center gap-2 min-w-0'>
                        <Filter className='w-5 h-5 text-purple-500 shrink-0' />
                        <h2 className='text-base md:text-lg font-semibold text-gray-800 truncate'>
                            {FILTER_LABELS[filter]}
                        </h2>
                    </div>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}
                        className={SELECT_CLASSES}>
                        {FILTER_OPTIONS.map(opt =>
                            <option key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </option>)}
                    </select>
                    <div className={TABS_WRAPPER}>
                        {FILTER_OPTIONS.map(opt => (
                            <button key={opt} onClick={() => setFilter(opt)} className={`${TAB_BASE} ${filter === opt ? TAB_ACTIVE : TAB_INACTIVE}`}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Expense List */}
                <div className='space-y-4'>
                    {filteredExpenses.length === 0 ? (
                        <div className={EMPTY_STATE.wrapper}>
                            <div className={EMPTY_STATE.iconWrapper}>
                                <CalendarIcon className='w-8 h-8 text-purple-500' />
                            </div>
                            <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                                No Expenses Found
                            </h3>
                            <p className='text-sm text-gray-500 mb-4'>{filter === "all" ? "Create your first expense to get started" : "No Expenses"}
                            </p>
                            <button onClick={() => setShowModel(true)} className={EMPTY_STATE.btn}>
                                Add New Expense
                            </button>
                        </div>
                    ) : (
                        filteredExpenses.map(expense => (
                            <ExpenseItem key={expense._id || expense.id}
                                expense={expense}
                                onRefresh={refreshExpenses}
                                onEdit={() => { setSelectedExpense(expense); setShowModel(true) }} />
                        ))
                    )}
                </div>
                {/* Add expenses desktop */}
                <div
                    onClick={() => setShowModel(true)}
                    className='hidden md:flex items-center justify-center p-4 border-2 border-dashed border-purple-200 rounded-xl hover:border-purple-400 bg-purple-50/50 cursor-pointer transition-colors'>
                    <Plus className='w-5 h-5 text-purple-500 mr-2' />
                    <span className='text-gray-600 font-medium'>Add New Expense</span>
                </div>
            </div>

            {/* Modal */}
            <ExpenseModel isOpen={showModel || !!selectedExpense}
                onClose={() => { setShowModel(false); setSelectedExpense(null) }}
                expenseToEdit={selectedExpense}
                onSave={handleExpenseSave} />

        </div>


      
   
  )
}

export default Dashboard
