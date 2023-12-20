import './styles.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Navbar as NavB } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from '../../redux/auth/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRequestID, setMaxPriceFilter } from '../../redux/filterAndActiveRequestID/actions';
import { RootState } from '../../redux/store';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const maxPriceFilter = useSelector((state: RootState) => state.filterAndActiveId.maxPriceFilter);


  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await dispatch(logout());
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <NavB expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary nav sticky-top">
      <Container fluid style={{ marginLeft: '5%' }}>
        <Link className='navbar-link logo' to="/">IT Services</Link>
        <NavB.Toggle aria-controls="navbarScroll" />
        <NavB.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Link className='navbar-link' to="/">Главная</Link>
            {window.localStorage.getItem("accessToken") ? (
              <Link className='navbar-link' to="/requests">
                Заявки
              </Link>
            ) : null}

          </Nav>
          <Nav>
            <div className='right-side'>
              {window.localStorage.getItem("accessToken") ? (
                <>
                  <Link className='navbar-link danger exit' onClick={handleLogout} to='/'>
                    Выйти
                  </Link>
                </>
              ) : (
                <>
                  <Link className='navbar-link' to="/auth/login">
                    Войти
                  </Link>
                  <Link className='navbar-link register' to="/auth/registration">
                    Зарегистрироваться
                  </Link>
                </>
              )
              }
            </div>
          </Nav>
        </NavB.Collapse>
      </Container>
    </NavB>
  );
};

export default Navbar;
