import React, { useCallback, useEffect, useState } from 'react'
import { baseControlClasses } from '../assets/dummy'
import { DollarSign, PlusCircle, X, Save, AlignLeft, Calendar, Tag } from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'https://task-tracker-backend-vtvb.onrender.com/'}/api/expenses`

const DEFAULT_EXPENSE = {
    amount: '',
    date: new Date().toISOString().split("T")[0],
    note: '',
    category: 'Other'
}

const ExpenseModel = ({ isOpen, onClose, expenseToEdit, onSave, onLogout }) => {
    const [expenseData, setExpenseData] = useState(DEFAULT_EXPENSE)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (!isOpen) return;
        if (expenseToEdit) {
            setExpenseData({
                ...DEFAULT_EXPENSE,
                amount: expenseToEdit.amount || '',
                date: expenseToEdit.date?.split('T')[0] || today,
                note: expenseToEdit.note || '',
                category: expenseToEdit.category || 'Other',
                id: expenseToEdit._id,
            });
        } else {
            setExpenseData(DEFAULT_EXPENSE)
        }
        setError(null)
    }, [isOpen, expenseToEdit, today])

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setExpenseData(prev => ({
            ...prev,
            [name]: value
        }))
    }, [])

    const getHeaders = useCallback(() => {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No auth token found')
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    }, [])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (parseFloat(expenseData.amount) <= 0) {
            setError('Amount must be greater than zero.');
            return;
        }
        setLoading(true)
        setError(null)
        try {
            const isEdit = Boolean(expenseData.id);
            const url = isEdit ? `${API_URL}/${expenseData.id}/gp` : `${API_URL}/gp`;
            const resp = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    amount: parseFloat(expenseData.amount),
                    date: expenseData.date,
                    note: expenseData.note,
                    category: expenseData.category
                }),
            });
            if (!resp.ok) {
                if (resp.status === 401) return onLogout?.();
                const err = await resp.text();
                console.error("Backend error:", resp.status, err);
                throw new Error(err.message || 'Failed to save expense')
            }
            const saved = await resp.json();
            onSave?.(saved);
            onClose();
        } catch (err) {
            console.error(err)
            setError(err.message || 'An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }, [expenseData, getHeaders, onLogout, onSave, onClose])

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4'>
            <div className='bg-white border border-purple-100 rounded-xl max-w-md w-full shadow-lg relative p-6 animate-fadeIn'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
                        {expenseData.id ? <Save className='text-purple-500 w-5 h-5' /> :
                            <PlusCircle className='text-purple-500 w-5 h-5' />}
                        {expenseData.id ? 'Edit Expense' : 'Create New Expense'}
                    </h2>
                    <button onClick={onClose} className='p-2 hover:bg-purple-100 rounded-lg transition-colors text-gray-500 hover:text-purple-700'>
                        <X className='w-5 h-5' />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    {error && <div className='text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100'>{error}</div>}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Amount
                        </label>
                        <div className='flex items-center border border-purple-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200'>
                            <DollarSign className='w-4 h-4 text-purple-500 mr-2' />
                            <input type="number" name='amount' required step="0.01" min="0.01" value={expenseData.amount} onChange={handleChange} className='w-full focus:outline-none text-sm' placeholder='0.00' />
                        </div>
                    </div>
                    <div>
                        <label className='flex items-center gap-1 text-sm font-medium text-gray-700 mb-1'>
                            <AlignLeft className='w-4 h-4 text-purple-500' />Note
                        </label>
                        <textarea name="note" rows="3" onChange={handleChange} value={expenseData.note} className={baseControlClasses} placeholder='Add a note about your expense' />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='flex items-center gap-1 text-sm font-medium text-gray-700 mb-1'>
                                <Tag className='w-4 h-4 text-purple-500' />Category
                            </label>
                            <select name="category" value={expenseData.category} onChange={handleChange} required className={baseControlClasses}>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Bills">Bills</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className='flex items-center gap-1 text-sm font-medium text-gray-700 mb-1'>
                                <Calendar className='w-4 h-4 text-purple-500' />Date
                            </label>
                            <input type="date" name='date' required max={today} value={expenseData.date} onChange={handleChange} className={baseControlClasses} />
                        </div>
                    </div>
                    <button type='submit' disabled={loading} className='w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-md transition-all duration-200'>
                        {loading ? 'Saving...' : (expenseData.id ? <>
                            <Save className='w-4 h-4' />Update Expense
                        </> : <>
                            <PlusCircle className='w-4 h-4' />Create Expense
                        </>)}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ExpenseModel
