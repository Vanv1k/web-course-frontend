import { useState, useEffect } from 'react'
import { validatePrice } from '../../functions/validate/validate'
import Navbar from '../../widgets/Navbar/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./styles.css"
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface Data {
    id: number;
    consultation: {
        Id: number;
        Name: string;
        Description: string;
        Image: string;
        Price: number;
        Status: string;
    }[];

}

const EditPage = () => {
    const [data, setData] = useState<Data | null>({ id: 0, consultation: [] });
    const { consultationId } = useParams();
    const parsedId = consultationId ? parseInt(consultationId) : 0;
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [img, setImg] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const url = '/api/consultations/';
            let response;
            if (!localStorage.getItem("accessToken")) {
                response = await axios.get(url);
            } else {
                response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
            }
            const result = response?.data;
            console.log(result);
            setData(result);
        } catch (error) {
            console.error('ошибка при выполнении запроса:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = async (name: string, desc: string, price: string, img: File | null) => {
        if (price) {
            if (!validatePrice(price)) {
                setError('Неправильный ввод цены!')
                return
            }
        }
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
            navigate('/')
        } catch (error) {
            setError('Ошибка в вводе данных')
            console.error('Error fetching data:', error);
        }
    }
    
    useEffect(() => {
        if (loading) {
            setName("");
            setDesc("");
            setPrice("");
            fetchData();
        } else {
            const consultation = data?.consultation.find(item => item.Id === parsedId);
            console.log(consultation)
            console.log(parsedId)
            if (consultation) {
                setName(consultation.Name || "");
                setDesc(consultation.Description || "");
                setPrice(consultation.Price?.toString() || "");
            }
        }
    }, [error, data ]);

console.log(name, desc, price)

    return (
        <div>
            <Navbar />
            <div style={{ marginLeft: "5%", marginTop: "1%" }}>
                <Link to="/" style={{ textDecoration: 'none' }}>Главная </Link>
                <Link to="#" style={{ textDecoration: 'none', color: 'grey' }}>
                    / Редактирование консультации
                </Link>
            </div>
            <div className='container create-page'>
                <h1 className='small-h1'>Редактирование консультации</h1>
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
                <Button variant="primary" onClick={() => handleEdit(name, desc, price, img)}>
                    Редактировать
                </Button>
            </div>
        </div>
    )
}

export default EditPage;