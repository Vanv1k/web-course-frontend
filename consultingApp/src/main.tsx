import ReactDOM from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux'
import  store  from './redux/store.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <App />
    </Provider>
)
