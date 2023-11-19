import ReactDOM from 'react-dom/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App />
    </BrowserRouter>
</React.StrictMode>,
)
