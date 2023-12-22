import React, { useState, useEffect } from 'react';
import Navbar from '../../widgets/Navbar/Navbar';
import Table from 'react-bootstrap/Table';
import CartItem from '../../widgets/CardItem/CartItem';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Loader from '../../widgets/Loader/Loader';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setNumOfProdInReq } from '../../redux/filterAndActiveRequestID/actions';
import axios from 'axios';

interface CartItem {
  Id: number;
  Name: string;
  Price: number;
}

const ShoppingCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [consultationTime, setConsultationTime] = useState("");
  const [consultationPlace, setConsultationPlace] = useState("");
  const [error, setError] = useState<string | null>(null);
  const numOfCons = useSelector((state: RootState) => state.filterAndActiveId.numOfCons);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/consultations/request', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const removeFromCart = async (removedItem: CartItem) => {
    try {
      await axios.delete(`/api/consultation-request/delete/consultation/${removedItem.Id}/request/${localStorage.getItem("ActiveRequestId")}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      dispatch(setNumOfProdInReq(numOfCons-1));
      const currentNumOfCons = localStorage.getItem('numOfCons');
      const currentNum = currentNumOfCons ? parseInt(currentNumOfCons, 10) : 0;
      const updatedNumOfCons = currentNum - 1;
      localStorage.setItem('numOfCons', updatedNumOfCons.toString());
      if (updatedNumOfCons != numOfCons) {
          dispatch(setNumOfProdInReq(updatedNumOfCons));
      }
      fetchData();
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

  const handleSend = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

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
        setShowModal(false);
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

  const renderAdditionalFields = () => {
    return (
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Формирование заявки</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Добавьте дополнительные поля ввода здесь */}
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
          </Form>
          {error && <div className="error-message">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={() => handleFormRequest(companyName, consultationPlace, consultationTime)}>
            Отправить
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderCart = () => {
    return (
      <>
        <h2>Корзина</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
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
        <Button variant="primary" onClick={handleSend}>
          Отправить
        </Button>
        <Button style={{ marginLeft: '80%' }} variant="danger" onClick={handleDeleteCart}>
          Очистить корзину
        </Button>
        {renderAdditionalFields()}
      </>
    );
  };

  const renderLoading = () => {
    return (
      <>
      <Navbar/>
      <Loader />
      </>
    );
  };



  return (
    <div>
      {cartItems?.length > 0 ? <> <Navbar /> <div style={{ 'marginTop': '5%', 'marginLeft': '5%', 'marginRight': '5%' }}>
        {renderCart()}
      </div> </> : <> {renderLoading()} 
      <h2 style={{marginTop: "-20%", marginLeft: "5%"}}>Корзина пуста</h2></>}
    </div>
  );
};

export default ShoppingCartPage;
