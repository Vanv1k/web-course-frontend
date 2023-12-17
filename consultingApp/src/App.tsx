import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage.tsx';
import ProductPage from './pages/ProductPage/ProductPage.tsx';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage.tsx';
import AllRequestsPage from './pages/AllRequestsPage/AllRequestsPage.tsx';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage.tsx';

const App = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes >
        <Route path="/" element={<MainPage />} />
        <Route path="/consultations/:id" element={<ProductPage />} />
        <Route path="/requests" element={<AllRequestsPage />} />
        <Route path="/shopping-cart" element={<ShoppingCartPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/registration" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
