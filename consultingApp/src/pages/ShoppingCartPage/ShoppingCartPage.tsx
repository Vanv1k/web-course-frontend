import React, { useState, useEffect } from 'react';
import Navbar from '../../widgets/Navbar/Navbar';
import Table from 'react-bootstrap/Table';
import CartItem from '../../widgets/CardItem/CartItem';
import { Button, Modal, Form, FormLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Loader from '../../widgets/Loader/Loader';
import { RootState } from '../../redux/store';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setNumOfProdInReq, setActiveRequestID } from '../../redux/filterAndActiveRequestID/actions';
import { loginSuccess, loginFailure, setRole } from '../../redux/auth/authSlice';
import axios from 'axios';

interface CartItem {
  Id: number;
  Name: string;
  Price: number;
}

const ShoppingCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [consultationTime, setConsultationTime] = useState("");
  const [consultationPlace, setConsultationPlace] = useState("");
  const [error, setError] = useState<string | null>(null);
  const ActiveRequestId = useSelector((state: RootState) => state.filterAndActiveId.activeRequestID);
  const numOfCons = useSelector((state: RootState) => state.filterAndActiveId.numOfCons);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkRequestId = async () => {
    if (window.localStorage.getItem("ActiveRequestId")) {
      const idstr = window.localStorage.getItem("ActiveRequestId");
      const id = idstr ? parseInt(idstr) : 0;
      console.log(id)
      await dispatch(setActiveRequestID(id));
    }
  }

  const fetchDataAndCheckRequestId = async () => {
    await checkRequestId();
    fetchData();
  };

  useEffect(() => {
    console.log('Cart useEffect is triggered');
    const initializePage = async () => {
      await fetchDataAndCheckRequestId();
    };

    initializePage();

    if (window.localStorage.getItem("accessToken")) {
      dispatch(loginSuccess())
    }
    if (window.localStorage.getItem("role")) {
      const roleString = window.localStorage.getItem("role");
      const role = roleString ? parseInt(roleString) : 0;
      dispatch(setRole(role))
    }
    const currentNumOfCons = localStorage.getItem('numOfCons');
    const currentNum = currentNumOfCons ? parseInt(currentNumOfCons, 10) : 0;
    const updatedNumOfCons = currentNum;
    localStorage.setItem('numOfCons', updatedNumOfCons.toString());
    if (updatedNumOfCons != numOfCons) {
      dispatch(setNumOfProdInReq(updatedNumOfCons));
    }
  }, [ActiveRequestId, numOfCons]);

  const fetchData = async () => {
    if (ActiveRequestId != null) {
      try {
        console.log('дурак здесь выполняет')
        const response = await axios.get(`/api/consultations/request/${ActiveRequestId.toString()}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const removeFromCart = async (removedItem: CartItem) => {
    try {
      await axios.delete(`/api/consultation-request/delete/consultation/${removedItem.Id}/request/${localStorage.getItem("ActiveRequestId")}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      dispatch(setNumOfProdInReq(numOfCons - 1));
      const currentNumOfCons = localStorage.getItem('numOfCons');
      const currentNum = currentNumOfCons ? parseInt(currentNumOfCons, 10) : 0;
      const updatedNumOfCons = currentNum - 1;
      localStorage.setItem('numOfCons', updatedNumOfCons.toString());
      if (updatedNumOfCons != numOfCons) {
        dispatch(setNumOfProdInReq(updatedNumOfCons));
      }
      if (numOfCons == 0) {
        navigate('/')
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteCart = async () => {
    try {
      await axios.delete(`/api/requests/delete/${localStorage.getItem("ActiveRequestId")}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      dispatch(setNumOfProdInReq(0));
      const updatedNumOfCons = 0;
      localStorage.setItem('numOfCons', updatedNumOfCons.toString());
      navigate("/")
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  const handleFormRequest = async (companyName: string, consultationPlace: string, consultationTime: string) => {
    const currentTime = new Date();
    const selectedTime = new Date(consultationTime);

    if (selectedTime <= currentTime) {
      setError('Выберите время, которое позже текущего времени.');
      return;
    }

    if (!consultationPlace || !companyName || !consultationTime) {
      setError('Заполните поля.');
      return;
    }

    try {
      await axios.put(
        `/api/requests/update/${localStorage.getItem("ActiveRequestId")}`,
        {
          "consultation_place": consultationPlace,
          "consultation_time": consultationTime,
          "company_name": companyName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      try {
        await axios.put(
          `/api/requests/${localStorage.getItem("ActiveRequestId")}/user/update-status`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        dispatch(setNumOfProdInReq(0));
        const updatedNumOfCons = 0;
        localStorage.setItem('numOfCons', updatedNumOfCons.toString());
        navigate("/")
      } catch (error) {
        setError('Ошибка при отправке формы. Попробуйте позже')
        console.error('Error fetching data:', error);
      }

    } catch (error) {
      setError('Ошибка в вводе данных')
      console.error('Error fetching data:', error);
    }
  }

  const renderCart = () => {
    return (
      <>
        <h2>Корзина</h2>
        <div style={{display: 'flex'}}>
          <Table striped bordered hover style={{width: 'fit-content'}}>
            <thead >
              <tr style={{height: '50px'}}>
                <th>Название</th>
                <th>Цена</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <CartItem key={item.Name} item={item} onRemove={() => removeFromCart(item)} />
              ))}
            </tbody>
          </Table>


          <Form style={{ width: '30%', marginLeft:'5%' }}>
            <FormLabel className='small-h1'>Заполните форму для отправки заявки</FormLabel>
            <Form.Group className="mb-3" controlId="formAdditionalField1">
              <Form.Label>Название компании</Form.Label>
              <Form.Control
                type="text"
                placeholder="Название компании"
                name="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAdditionalField2">
              <Form.Label>Место консультации</Form.Label>
              <Form.Control
                type="text"
                placeholder="Место проведения консультации"
                name="consultationPlace"
                value={consultationPlace}
                onChange={(e) => setConsultationPlace(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAdditionalField3">
              <Form.Label>Время консультации</Form.Label>
              <Form.Control
                type="text"
                placeholder="Формат: 2023-12-31 18:30"
                name="consultationTime"
                value={consultationTime}
                onChange={(e) => setConsultationTime(e.target.value)}
              />
            </Form.Group>
            {error && <div className="error-message">{error}</div>}
            <Button variant="primary" style={{width: '100%'}} onClick={() => handleFormRequest(companyName, consultationPlace, consultationTime)}>
            Отправить
          </Button>
          </Form>
        </div>
        <Button  variant="danger" onClick={handleDeleteCart}>
            Очистить корзину
          </Button>

      </>
    );
  };

  const renderLoading = () => {
    return (
      <>
        <Navbar />
        <Loader />
      </>
    );
  };



  return (
    <div>
      <Navbar />         <div style={{ marginLeft: "5%", marginTop: "1%" }}>
        <Link to="/" style={{ textDecoration: 'none' }}>Главная </Link>
        <Link to="#" style={{ textDecoration: 'none', color: 'grey' }}>
          / Корзина
        </Link>
      </div>
      {cartItems?.length > 0 ? <> <div style={{ 'marginTop': '5%', 'marginLeft': '5%', 'marginRight': '5%' }}>
        {renderCart()}
      </div> </> : <>
        <h2 style={{ marginTop: "10%", marginLeft: "5%" }}>Корзина пуста</h2></>}
    </div>
  );
};

export default ShoppingCartPage;
