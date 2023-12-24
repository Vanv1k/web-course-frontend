import React, { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';


interface EditConsModalProps {
    show: boolean;
    handleClose: () => void;
    consultationId: number;
    fetchData: () => void;
    consName : string;
    consDesc : string;
    consPrice : string;
}

const EditConsModal: React.FC<EditConsModalProps> = ({ show, handleClose, consultationId, fetchData, consName, consDesc, consPrice }) => {
    const [name, setName] = useState(consName)
    const [desc, setDesc] = useState(consDesc);
    const [price, setPrice] = useState(consPrice);
    const [img, setImg] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    console.log(consName)
    console.log(consDesc)
    console.log(consPrice)
    console.log(consultationId)
    const handleEdit = async (name: string, desc: string, price: string, img: File | null) => {
        const parsedPrice = parseInt(price);
        try {
            await axios.put(
                `/api/consultations/update/${consultationId}`,
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
            if (img) {
                let formData = new FormData();
                formData.append('image', img)
                try {
                    await axios.post(`/api/consultations/${consultationId}/addImage`, 
                        formData,
                         {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    });
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
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
                <Modal.Title>Редактирование консультации</Modal.Title>
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

                    <Form.Group className="mb-3" controlId="formAdditionalField3">
                        <Form.Label>Изображение консультации</Form.Label>
                        <Form.Control
                            type="file"
                            name="img"
                            onChange={(e) => setImg((e.target as HTMLInputElement).files?.[0] || null)}
                        />
                    </Form.Group>
                </Form>
                {error && <div className="error-message">{error}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={() => handleEdit(name, desc, price, img)}>
                    Отправить
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditConsModal;