import { useState, useEffect } from 'react'
import {validatePrice, validateDesc, validateName} from '../../functions/validate/validate'
import Navbar from '../../widgets/Navbar/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./styles.css"
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';



const CreateConsModal = () => {
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();


    const handleEdit = async (name: string, desc: string, price: string) => {
        if (!validatePrice(price)) {
            setError('Неправильный ввод цены!')
            return
        }
        if (!validateDesc(desc)) {
            setError('Введите описание!')
            return
        }
        if (!validateName(name)) {
            setError('Введите название!')
            return
        }
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
            navigate('/')
        } catch (error) {
            setError('Уже есть консультация с таким названием!')
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {

    }, [error])



    return (
        <div>
            <Navbar />
            <div style={{ marginLeft: "5%", marginTop: "1%" }}>
                <Link to="/" style={{ textDecoration: 'none' }}>Главная </Link>
                <Link to="#" style={{ textDecoration: 'none', color: 'grey' }}>
                    / Создание консультации
                </Link>
            </div>
            <div className='container create-page'>
                <h1 className='small-h1'>Создание консультации</h1>
                <Form>
                    {/* Добавьте дополнительные поля ввода здесь */}
                    <Form.Group className="mb-3 create-form" controlId="formAdditionalField1">
                        <Form.Label>Название консультации</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Название"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 create-form" controlId="formAdditionalField2">
                        <Form.Label>Описание консультации</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Описание"
                            name="desc"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 create-form" controlId="formAdditionalField3">
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
                <Button variant="primary" onClick={() => handleEdit(name, desc, price)}>
                    Создать
                </Button>
            </div>
        </div>
    )
}

export default CreateConsModal;