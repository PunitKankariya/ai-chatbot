// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import React from 'react' 
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ChatScreenView from './pages/ChatScreenView.jsx'
import './index.css' // ✅ Import Tailwind here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatScreenView />
    </BrowserRouter>
  </React.StrictMode>,
)
