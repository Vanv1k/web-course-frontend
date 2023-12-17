import React, { useState, useEffect } from 'react';
import Navbar from '../../widgets/Navbar/Navbar';
import Table from 'react-bootstrap/Table';
import CartItem from '../../widgets/CardItem/CartItem';
import { Button } from 'react-bootstrap';
import axios from 'axios';

interface CartItem {
  Id: number;
  Name: string;
  Price: number;
}

const ShoppingCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
      fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
      </>
    );
  };

  const renderEmptyCart = () => {
    return (
      <div style={{ 'marginTop': '5%', 'marginLeft': '5%', 'marginRight': '5%' }}>
        <h2>Корзина пуста</h2>
      </div>
    );
  };

  const handleSend = async () => {
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
      fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ 'marginTop': '5%', 'marginLeft': '5%', 'marginRight': '5%' }}>
        {cartItems?.length > 0 ? renderCart() : renderEmptyCart()}

      </div>
    </div>
  );
};

export default ShoppingCartPage;
