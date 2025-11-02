import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Header.css'
import App from './App.jsx'
import './globals.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
