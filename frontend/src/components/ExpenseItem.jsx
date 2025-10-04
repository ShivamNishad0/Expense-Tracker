import React, { useState } from 'react'
import { MENU_OPTIONS, TI_CLASSES } from '../assets/dummy'
import { Calendar, MoreVertical, Clock, DollarSign } from 'lucide-react'
import axios from 'axios'
import { format, isToday } from 'date-fns'
import ExpenseModel from './ExpenseModel'

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'https://expense-tracker-1-2ly3.onrender.com'}/api/expenses`

const ExpenseItem = ({ expense, onRefresh, onLogout }) => {
    const [showMenu, setShowMenu] = useState(false)
    const [showEditModel, setShowEditModel] = useState(false)

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token')
        if (!token) throw new Error("No auth token found")
        return { Authorization: `Bearer ${token}` }
    }

    const handleAction = (action) => {
        setShowMenu(false)
        if (action === 'edit') setShowEditModel(true)
        if (action === 'delete') handleDelete()
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/${expense._id}/gp`, { headers: getAuthHeaders() })
            onRefresh?.()
        } catch (err) {
            if (err.response?.status === 401) onLogout?.()
        }
    }

    const handleSave = async (updatedExpense) => {
        try {
            const payload = (({ amount, date, note, category }) =>
                ({ amount, date, note, category }))(updatedExpense)
            await axios.put(`${API_URL}/${expense._id}/gp`, payload,
                { headers: getAuthHeaders() }
            )
            setShowEditModel(false)
            onRefresh?.()
        } catch (err) {
            if (err.response?.status === 401) onLogout?.()
        }
    }

    return (
        <>
            <div className={`${TI_CLASSES.wrapper} border-blue-500`}>
                <div className={TI_CLASSES.leftContainer}>
                    <div className='flex-1 min-w-0'>
                        <div className='flex items-baseline gap-2 mb-1 flex-wrap'>
                            <h3 className={`${TI_CLASSES.titleBase} text-gray-800`}>
                                <DollarSign className='inline w-4 h-4 mr-1' />
                                ${expense.amount.toFixed(2)}
                            </h3>
                            <span className={`${TI_CLASSES.priorityBadge} bg-blue-100 text-blue-800`}>
                                {expense.category}
                            </span>
                        </div>
                        {expense.note && <p className={TI_CLASSES.description}>
                            {expense.note}</p>}
                    </div>
                </div>
                <div className={TI_CLASSES.rightContainer}>
                    <div className='relative'>
                        <button onClick={() => setShowMenu(!showMenu)}
                            className={TI_CLASSES.menuButton}>
                            <MoreVertical className='w-4 h-4 sm:w-5 sm:h-5' size={18} />
                        </button>
                        {showMenu && (
                            <div className={TI_CLASSES.menuDropdown}>
                                {MENU_OPTIONS.map(opt => (
                                    <button key={opt.action} onClick={() => handleAction(opt.action)}
                                        className='w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors duration-200'>
                                        {opt.icon}{opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className={`${TI_CLASSES.dateRow} ${expense.date && isToday(new Date(expense.date))
                            ? 'text-fuchsia-600' : 'text-gray-500'}`}>
                            <Calendar className='w-3.5 h-3.5' />
                            {expense.date ? (isToday(new Date(expense.date)) ?
                                'Today' : format(new Date(expense.date), 'MMM dd')) : '-'}
                        </div>
                        <div className={TI_CLASSES.createdRow}>
                            <Clock className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
                            {expense.createdAt ? `Created ${format(new Date(expense.createdAt), 'MMM dd')}` : 'No date'}
                        </div>
                    </div>
                </div>
            </div>
            <ExpenseModel isOpen={showEditModel}
                onClose={() => setShowEditModel(false)}
                expenseToEdit={expense}
                onSave={handleSave} />
        </>
    )
}

export default ExpenseItem
