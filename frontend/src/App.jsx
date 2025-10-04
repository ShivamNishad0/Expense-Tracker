import React,{useEffect,useState} from 'react'
import Navbar from './components/Navbar'
import { Route,Routes,useNavigate,Outlet, Navigate, Link } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'
import Signup from './components/SignUp'
import Dashboard from './pages/Dashboard'
import ExpenseChartPage from './pages/ExpenseChartPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Profile from './components/Profile'




const App = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

    useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser])

  const handleAuthSubmit = data => {
    const user = {
      email: data.email,
      name: data.name || 'User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name || "User"
      )}&background=random`,
    }
    setCurrentUser(user);
    navigate("/", { replace: true });
  }
 
  const handleLogout = () => { 
  localStorage.removeItem('token'); // optional
  setCurrentUser(null);
  navigate("/login", { replace: true })
  }


  const ProtectedLayout= ()=>(
  <Layout user={currentUser} onLogout={handleLogout}>
  <Outlet />
  </Layout>

  
  )


  return (
    <Routes>
      <Route path='/login' element={<div className='fixed insert-0 bg-black bg-opacity-50 flex items-center justify-center'>
        <Login onSubmit ={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
      </div>}/>

      <Route path='/signup' element={<div className='fixed insert-0 bg-black bg-opacity-50 flex items-center justify-center'>
        <Signup onSubmit ={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
      </div>}/>

      <Route path='/privacy-policy' element={<PrivacyPolicy />} />
      <Route path='/terms-of-service' element={<TermsOfService />} />

      <Route element={currentUser ? <ProtectedLayout /> :
      <Navigate to='/login' replace />} >

      <Route path='/' element={<Dashboard />} />
      <Route path='/analytics' element={<ExpenseChartPage />} />
      <Route path='/profile' element={<Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />} />
      </Route>

      <Route path='*' element={<Navigate to={currentUser ? '/' : '/login'} replace/>}/>
      
    </Routes>
    
  ) 
}

export default App
