import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import MainPage from './pages/MainPage/MainPage.tsx';
import TableMainPage from './pages/TableMainPage/TableMainPage.tsx'
import ProductPage from './pages/ProductPage/ProductPage.tsx';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage.tsx';
import AllRequestsPage from './pages/AllRequestsPage/AllRequestsPage.tsx';
import AllRequestsAdminPage from './pages/AllRequestsAdminPage/AllRequestsAdminPage.tsx';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage.tsx';
import CreatePage from "./pages/CreatePage/CreatePage.tsx"
import EditPage from './pages/EditPage/EditPage.tsx';

const App = () => {

  const role = useSelector((state: RootState) => state.auth.role);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes >
      {role > 0 ?
          <Route path="/main-page/admin" element={<TableMainPage />} /> : null}
          <Route path="/" element={<MainPage />} />
        <Route path="/consultations/:id" element={<ProductPage />} />
        {role > 0 ?
          <Route path="/requests" element={<AllRequestsAdminPage />} />
          : <Route path="/requests" element={<AllRequestsPage />} />}
         <Route path="/request/:ActiveRequestId" element={<ShoppingCartPage />} />
         <Route path="/consultations/create" element={<CreatePage />} />
         <Route path="/consultations/:consultationId/edit" element={<EditPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/registration" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
