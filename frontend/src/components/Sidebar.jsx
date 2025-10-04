import React, { useState, useEffect } from 'react'
import {LINK_CLASSES, menuItems, PRODUCTIVITY_CARD, SIDEBAR_CLASSES, TIP_CARD} from '../assets/dummy'
import { NavLink } from 'react-router-dom'
import { Sparkles, Lightbulb, X, Menu } from 'lucide-react'

const Sidebar = ({user, expenses} ) => {
  const [mobileOpen, setMobileOpen]=useState(false)
  const [totalBudget, setTotalBudget] = useState(() => {
    const saved = localStorage.getItem('totalBudget')
    return saved ? parseFloat(saved) : 1000
  })
  const [budgetInput, setBudgetInput] = useState(totalBudget.toString())
  const [budgetError, setBudgetError] = useState(null)

  const totalExpenses = expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0

  const username =user?.name || "User"
  const initial = username.charAt(0).toUpperCase()

  useEffect(() => {
    document.body.style.overflow=mobileOpen ? "hidden" : "auto"
    return () => {
      document.body.style.overflow="auto"
    }
  }, [mobileOpen])

  const handleBudgetChange = (e) => {
    const val = e.target.value
    setBudgetInput(val)
    const num = parseFloat(val)
    if (isNaN(num) || num <= 0) {
      setBudgetError("Budget must be a positive number")
    } else {
      setBudgetError(null)
      setTotalBudget(num)
      localStorage.setItem('totalBudget', num.toString())
    }
  }

  const renderMenuItem=(isMobile=false) => {
    return(
      <ul className='space-y-2'>
        {menuItems.map(({text,path,icon}) => (
          <li key={text}>
            <NavLink 
            to={path} 
            className ={({isActive}) => [
              LINK_CLASSES.base,
              isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
              isMobile ? "justify-start" : "lg:justify-start"
            ].join(" ")} onClick={() => setMobileOpen(false)}>
              <span className={LINK_CLASSES.icon}>
                {icon}
              </span>
              <span className={` ${isMobile ? "block" : "hidden lg:block"} ${LINK_CLASSES}`}>
                {text}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      {/* Desktop Sidebar*/}
      <div className={SIDEBAR_CLASSES.desktop}>
        <div className='p-5 border-b border-purple-100 lg:block hidden'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md'>
              {initial}
            </div>
            <div>
              <h2 className='text-lg font-bold text-gray-800'>Hey, {username}</h2>
              <p className='text-sm text-purple-500 font-medium flex items-center gap-1'>
                <Sparkles className='w-3 h-3'/> Let's track your expenses!
              </p>
            </div>
          </div>
        </div>
        <div className='p-4 space-y-6 overflow-y-auto flex-1'>
          <div className={PRODUCTIVITY_CARD.container}>
            <div className={PRODUCTIVITY_CARD.header}>
              <h3 className={PRODUCTIVITY_CARD.label}>Budget Overview</h3>
            </div>
            <div>
              <label htmlFor="budgetInput" className="text-xs font-medium text-gray-700">Set Total Budget</label>
              <input
                id="budgetInput"
                type="number"
                min="0.01"
                step="0.01"
                value={budgetInput}
                onChange={handleBudgetChange}
                className="w-full mt-1 p-1 border border-gray-300 rounded text-sm"
              />
              {budgetError && <p className="text-xs text-red-600 mt-1">{budgetError}</p>}
            </div>
            <p className="text-xs mb-2">Total Expenses: ${totalExpenses.toFixed(2)}</p>
            <p className="text-xs mb-2">Remaining Budget: ${Math.max(totalBudget - totalExpenses, 0).toFixed(2)}</p>
            {renderMenuItem()}
            <div className='mt-auto pt-6 lg:block hidden'>
              <div className={TIP_CARD.container}>
                <div className='flex items-center gap-2'>
                  <div className={TIP_CARD.iconWrapper}>
                    <Lightbulb className='w-5 h-5 text-purple-600' />
                  </div>
                  <div>
                    <h3 className={TIP_CARD.title}>Pro Tip</h3>
                    <p className={TIP_CARD.text}>Use keyboard shortcut to boost productivity</p>
                    <a href="https://shivamnishadd.netlify.app/"
                    target='_blank' 
                    rel='noopener noreferrer'
                    className='block mt-2 text-sm text-purple-500 hover:underline'>
                    Visit Shivam Protfolio
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {!mobileOpen && (
        <button onClick={() => setMobileOpen(true)}
      className={SIDEBAR_CLASSES.mobileButton}>
        <Menu className='w-5 h-5' />
      </button>
      )}
      {/*Mobile Drawer*/}
      {mobileOpen && (
  <div className="fixed inset-0 z-40">
    <div
      className={SIDEBAR_CLASSES.mobileDrawerBackdrop}
      onClick={() => setMobileOpen(false)}
    />
    <div
      className={SIDEBAR_CLASSES.mobileDrawer}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-bold text-purple-600">Menu</h2>
        <button
          onClick={() => setMobileOpen(false)}
          className="text-gray-700 hover:text-purple-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
          {initial}
        </div>
              <div>
                <h2 className='text-lg font-bold mt-0 text-gray-800'>Hey, {username}</h2>
                <p className='text-sm text-purple-500 font-medium flex items-center gap-1'>
                  <Sparkles className='w-3 h-3'/> Let's track your expenses!
                </p>
              </div>
      </div>
        {renderMenuItem(true)}
    </div>
  </div>
)}
    </>
  )
}

export default Sidebar
