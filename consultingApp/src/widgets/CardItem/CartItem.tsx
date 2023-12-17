import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

interface CartItemProps {
  item: {
    Name: string;
    Price: number;
  };
  onRemove: (removedItem: { Name: string; Price: number }) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  const handleRemove = () => {
    onRemove(item);
  };

  return (
    <tr>
      <td>{item.Name}</td>
      <td>{item.Price}</td>
      <td>
        <Button variant="danger" onClick={handleRemove}>
          Удалить
        </Button>
      </td>
    </tr>
  );
};

export default CartItem;