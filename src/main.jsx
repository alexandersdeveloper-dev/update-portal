import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import App from './App.jsx'
import Informacoes from './pages/Informacoes.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Admin, { AdminDashboard, AdminAvaliacao } from './pages/Admin.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"            element={<App />}         />
          <Route path="/informacoes" element={<Informacoes />} />
          <Route path="/dashboard"   element={<Dashboard />}   />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="avaliacao" element={<AdminAvaliacao />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
