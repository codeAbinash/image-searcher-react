import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
// import './index.css'
import Home from './components/home/home'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
)


async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = navigator.serviceWorker.register('sw.js')
      console.log('Service Worker Registered')
    } catch (error) {
      console.warn("Error Registering Service Worker")
      console.log(error)
    }
  } else
    console.log('Service worker is not available for this device')
}


registerSW()