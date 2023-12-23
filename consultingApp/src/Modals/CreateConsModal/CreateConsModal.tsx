import React, { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';


interface CreateConsModalProps {
    show: boolean;
    handleClose: () => void;
    fetchData: () => void;
}

const CreateConsModal: React.FC<CreateConsModalProps> = ({ show, handleClose, fetchData }) => {
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [error, setError] = useState<string | null>(null);


    const handleEdit = async (name: string, desc: string, price: string) => {
        const parsedPrice = parseInt(price);
        try {
            await axios.post(
                `/api/consultations/create`,
                {
                    "Name": name,
                    "Description": desc,
                    "Price": parsedPrice,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            handleClose()
            fetchData()
        } catch (error) {
            setError('Ошибка в вводе данных')
            console.error('Error fetching data:', error);
        }
    }



    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Создание новой консультации</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Добавьте дополнительные поля ввода здесь */}
                    <Form.Group className="mb-3" controlId="formAdditionalField1">
                        <Form.Label>Название консультации</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Название"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAdditionalField2">
                        <Form.Label>Описание консультации</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Описание"
                            name="desc"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAdditionalField3">
                        <Form.Label>Цена консультации</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Цена"
                            name="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </Form.Group>
                </Form>
                {error && <div className="error-message">{error}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={() => handleEdit(name, desc, price)}>
                    Отправить
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateConsModal;