import './styles.css'
import { ChangeEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import { Navbar as NavB } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/auth/authActions';


interface NavbarProps {
  onMaxPriceChange?: (value: string) => void; // Define the prop type
}

const Navbar: React.FC<NavbarProps> = ({ onMaxPriceChange }) => {
  const [maxPrice, setMaxPrice] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const isBrowser = typeof window !== 'undefined';
  // Проверяем, что окно определено, а также убеждаемся, что document.cookie тоже определен
  // const token = isBrowser ? (
  //   (document.cookie?.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1] || '')
  // ) : '';
  // console.log(token)
  // console.log(document.cookie)

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const value = e.target.value;
    setMaxPrice(value);

    // Check if onMaxPriceChange is defined before calling it
    if (onMaxPriceChange !== undefined) {
      onMaxPriceChange(value);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Вызываем onMaxPriceChange при отправке формы
    if (onMaxPriceChange && maxPrice.trim() !== '') {
      onMaxPriceChange(maxPrice);
    }
  };

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
    <NavB expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
      <Container fluid style={{ marginLeft: '5%' }}>
        <NavB.Brand className='navbar-link' href="/">IT Services</NavB.Brand>
        <NavB.Toggle aria-controls="navbarScroll" />
        <NavB.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link className='navbar-link' href="/">Главная</Nav.Link>
            {window.localStorage.getItem("accessToken") ? (
                <Nav.Link className='navbar-link' href="/requests">
                  Заявки
              </Nav.Link>
            ) : null}
           
          </Nav>
          <Form
            className="d-flex"
            id="search"
            onSubmit={handleSearchSubmit} // Добавляем обработчик отправки формы
          >
            <Form.Control
              type="search"
              placeholder="Поиск по максимальной цене"
              className="me-2"
              aria-label="Search"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
            <Button
              variant="outline-success"
              onClick={(e) => {
                e.preventDefault();
                if (onMaxPriceChange !== undefined) {
                  onMaxPriceChange(maxPrice);
                }
              }}
            >
              Искать
            </Button>
          </Form>
          <Nav>
          {window.localStorage.getItem("accessToken") ? (
                <Nav.Link className='navbar-link' href="/web-course-frontend/basket">
                  Корзина
                </Nav.Link>
            ) : null}
            {window.localStorage.getItem("accessToken") ? (
              <>
                <Nav.Link className='navbar-link danger' onClick={handleLogout}>
                  {/* тут онклик */}
                  Выйти
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link className='navbar-link' href="/web-course-frontend/auth/login">
                  Войти
                </Nav.Link>
                <Nav.Link className='navbar-link' href="/web-course-frontend/auth/registration">
                  Зарегестрироваться
                </Nav.Link>
              </>
            )
            }
          </Nav>
        </NavB.Collapse>
      </Container>
    </NavB>
  );
};

export default Navbar;
