import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Navbar from '../../widgets/Navbar/Navbar';
import Loader from '../../widgets/Loader/Loader';
import Table from 'react-bootstrap/Table';
import { Form, Button, Modal } from 'react-bootstrap';
import { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { setMaxPriceFilter } from '../../redux/filterAndActiveRequestID/actions';
import { loginSuccess, setRole } from '../../redux/auth/authSlice';
import axios from 'axios';
import addImg from '../../assets/add-square-svgrepo-com.svg'
import EditConsModal from '../../Modals/EditConsModal/EditConsModal';
import './styles.css'
import CreateConsModal from '../../Modals/CreateConsModal/CreateConsModal';

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

const TableMainPage: React.FC = () => {
    const [data, setData] = useState<Data | null>({ id: 0, consultation: [] });
    const dispatch = useDispatch();
    const maxPriceFilter = useSelector((state: RootState) => state.filterAndActiveId.maxPriceFilter);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [selectedConsultationId, setSelectedConsultationId] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const fetchData = async () => {
        console.log(maxPriceFilter)
        try {
            const url = maxPriceFilter ? `/api/consultations/?maxPrice=${maxPriceFilter}` : '/api/consultations/';
            let response
            if (!localStorage.getItem("accessToken")) {
                response = await axios.get(url)
            }
            else {
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
        }
    };

    const handleEdit = (consultationId: number) => {
        setShowEditModal(true);
        setSelectedConsultationId(consultationId)
        fetchData()
    }

    const handleDelete = async (consultationId: number) => {
        try {
            await axios.delete(
                `/api/consultations/delete/${consultationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            fetchData()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleAdd = async () => {
        setShowCreateModal(true);
        fetchData()
    }

    const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const maxPriceString = e.target.value !== '' ? parseInt(e.target.value).toString() : '';
        dispatch(setMaxPriceFilter(maxPriceString));
    };

    useEffect(() => {
        fetchData()
        if (window.localStorage.getItem("accessToken")) {
            dispatch(loginSuccess())
        }
        if (window.localStorage.getItem("role")) {
            const roleString = window.localStorage.getItem("role");
            const role = roleString ? parseInt(roleString) : 0;
            dispatch(setRole(role))
        }
    }, [dispatch, maxPriceFilter]);

    return (
        <div>
            <Navbar />
            <div style={{ marginLeft: "5%", marginTop: "1%" }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'grey' }}>
                    <p>Главная</p>
                </Link>
                <Form
                    className="d-flex"
                    id="search"
                    style={{ width: "20%", minWidth: "250px", marginTop: "0.7%" }}
                >
                    <Form.Control
                        type="search"
                        placeholder="Поиск по максимальной цене"
                        className="me-2"
                        aria-label="Search"
                        value={maxPriceFilter}
                        onChange={handleMaxPriceChange}
                    />
                </Form>
            </div>
            {!data || data?.consultation.length === 0 ? <Loader />
                : <div style={{ margin: '5% 10% 0 10%' }}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th key={'Name'}>Название</th>
                                <th key={'Desc'}>Описание</th>
                                <th key={'Img'}>Изображение</th>
                                <th key={'Price'}>Цена в рублях</th>
                                <th key={'Edit'}>Редактирование</th>
                                <th key={'Delete'}>Удаление</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.consultation.map((item, index) => (
                                <tr key={index}>
                                    {Object.values(item).map((value, index) => {
                                        const excludedIndices = [0, 5];
                                        return excludedIndices.includes(index) ? null :
                                            <td key={index}>{value as React.ReactNode}</td>;
                                    }
                                    )}
                                    <td><Button variant="primary" onClick={() => { handleEdit(item.Id) }}>
                                        Редактировать
                                    </Button></td>
                                    <td><Button variant="danger" onClick={() => { handleDelete(item.Id) }}>
                                        Удалить
                                    </Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button className='add-cons' onClick={handleAdd}>
                        <img src={addImg} />
                    </Button>
                    <EditConsModal show={showEditModal} handleClose={() => setShowEditModal(false)} consultationId={selectedConsultationId} fetchData={fetchData} />
                    <CreateConsModal show={showCreateModal} handleClose={() => setShowCreateModal(false)} fetchData={fetchData} />
                </div>}
        </div>
    );
}

export default TableMainPage;
