import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStartDateFilter, setEndDateFilter, setStatusFilter, setUserFilter } from '../../redux/requestFilters/actions';
import { RootState } from '../../redux/store';
import Navbar from '../../widgets/Navbar/Navbar';
import Loader from '../../widgets/Loader/Loader';
import { Table, Button, Form } from 'react-bootstrap';
import { statusDictionary } from '../../status/status';
import { Link } from 'react-router-dom';
import axios from 'axios'
import './styles.css'

interface Request {
    Id: number;
    Status: string;
    StartDate: string;
    FormationDate: string;
    EndDate: string;
    UserName: string;
    ModeratorName: string;
    Consultation_place: string;
    Consultation_time: string;
    Company_name: string;
}

const AllRequestsAdminPage = () => {
    const dispatch = useDispatch();
    const startDate = useSelector((state: RootState) => state.requestFilters.startDate);
    const endDate = useSelector((state: RootState) => state.requestFilters.endDate);
    const status = useSelector((state: RootState) => state.requestFilters.status);
    const user = useSelector((state: RootState) => state.requestFilters.user);
    const [localUser, setLocalUser] = useState(user);
    const [requests, setRequests] = useState<Request[] | null>(null);


    useEffect(()=> {
        setLocalUser(user)
        console.log(localUser)
    },[user])


    const formattedTime = (timestamp: string) => {
        if (timestamp.includes('0001-01-01')) {
            return "Не установлено";
        }
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        const formattedDate = new Date(timestamp).toLocaleDateString('ru-RU', options);


        return formattedDate
    };

    const fetchData = async (startDate: string, endDate: string, status: string) => {
        try {
            const url = `/api/requests/?startDate=${startDate}&endDate=${endDate}&status=${status}`;
            let response
            if (!localStorage.getItem("accessToken")) {
                response = await fetch(url);
            } else {
                response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

            }
            if (!response.ok) {
                throw new Error(`Ошибка при выполнении запроса: ${response.statusText}`);
            }


            let result = await response.json();
            console.log(result)
            console.log(user)
            console.log(localUser)
            let filteredResult = result
            if (localUser != '') {
                console.log('zxzzxxz')
                filteredResult = result?.filter((item: Request) => item.UserName.includes(localUser)) || result
            }
            console.log(filteredResult)
            setRequests(filteredResult);
        } catch (error) {
            console.error('ошибка при выполнении запроса:', error);
        }
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setStartDateFilter(e.target.value));
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setEndDateFilter(e.target.value));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setStatusFilter(e.target.value));
    };

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalUser(e.target.value)
        dispatch(setUserFilter(e.target.value));
        // const previos = requests
        // setRequests(requests?.filter((item: Request) => item.UserName.includes(user)) || previos);
    };


    const handleChangeStatus = async (requestId: number, Newstatus: string) => {
        try {
            await axios.put(
                `/api/requests/${requestId}/moderator/update-status`,
                {
                    "status": Newstatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            fetchData(startDate, endDate, status)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleResetFilter = () => {
        dispatch(setStartDateFilter(''));
        dispatch(setEndDateFilter(''));
        dispatch(setStatusFilter(''));
        dispatch(setUserFilter(''));
        setLocalUser('')
        fetchData(startDate, endDate, status)
    }

    const fetchDataWithPolling = async () => {
        try {
            fetchData(startDate, endDate, status);
        } catch (error) {
            console.error('Error fetching data with polling:', error);
        }
    };



    useEffect(()=> {
        fetchData(startDate, endDate, status);
    }, [startDate, endDate, status])

    useEffect(() => {
        if (localUser != "") {
            const previos = requests
            setRequests(requests?.filter((item: Request) => item.UserName.includes(localUser)) || previos);
        }
    }, [localUser])

    useEffect(() => {
        const pollingInterval = setInterval(() => {
            fetchDataWithPolling();
        }, 2000);
        return () => clearInterval(pollingInterval);

    }, [startDate, endDate, status, localUser]);

    if (!requests) {
        return <div><Navbar /> <Loader /></div>
    }

    return (
        <div>
            <Navbar />
            <div style={{ marginLeft: "5%", marginTop: "1%" }}>
                <Link to="/" style={{ textDecoration: 'none' }}>Главная </Link>
                <Link to="#" style={{ textDecoration: 'none', color: 'grey' }}>
                    / Заявки
                </Link>
            </div>
            <div style={{ margin: '3% 10% 0 10%' }}>
                <div style={{ display: 'flex', marginBottom: '1%' }}>
                    <div className='filter'>
                        <label>Дата формирования (начало):</label>
                        <input type="date" value={startDate} onChange={handleStartDateChange} />
                    </div>
                    <div className='filter'>
                        <label>Дата формирования (конец):</label>
                        <input type="date" value={endDate} onChange={handleEndDateChange} />
                    </div>
                    <div className='filter'>
                        <select value={status} onChange={handleStatusChange}>
                            <option value="">Статус (все)</option>
                            <option key={"formed"} value={"formed"}>
                                formed
                            </option>
                            <option key={"ended"} value={"ended"}>
                                ended
                            </option>
                            <option key={"canceled"} value={"canceled"}>
                                canceled
                            </option>
                        </select>
                    </div>
                    <div className='filter'>
                        <Form
                            className="d-flex"
                            id="search"
                            style={{ width: "20%", minWidth: "250px" }}
                        >
                            <Form.Control
                                type="search"
                                placeholder="Поиск по имени пользователя цене"
                                className="me-2"
                                aria-label="Search"
                                value={user}
                                onChange={handleUserChange}
                            />
                        </Form>
                    </div>
                    <Button className='filter-button' variant="primary" onClick={() => { handleResetFilter() }}>
                        Сбросить фильтры
                    </Button>
                </div>
                {(requests?.length == 0) ? <h1 className='small-h1' style={{ marginTop: '5%' }}>Нет данных, которые соответствуют фильтрам</h1> :
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th key={'status'}>Статус</th>
                                <th key={'formDate'}>Сформирована</th>
                                <th key={'endDate'}>Закончена</th>
                                <th key={'userName'}>Имя отправителя</th>
                                <th key={'moderatorName'}>Имя модератора</th>
                                <th key={'consPlace'}>Место консультации</th>
                                <th key={'consTime'}>Время консультации</th>
                                <th key={'companyName'}>Компания</th>
                                <th key={'end'}>Закончить</th>
                                <th key={'decline'}>Отменить</th>
                                <th key={'more'}>Подробнее</th>
                                {/* 1 3 4 7 8 9  0 2 5 6 */}
                            </tr>
                        </thead>
                        <tbody>
                            {requests?.map((request, index) => (
                                <tr key={index}>
                                    {Object.values(request).map((value, index) => {
                                        const excludedIndices = [0, 2];
                                        const timeRows = [3, 4, 8]
                                        if (index === 1) return <td key={index}>{statusDictionary[value as keyof typeof statusDictionary] as React.ReactNode}</td>
                                        return excludedIndices.includes(index) ? null :
                                            timeRows.includes(index) ? <td key={index}>{formattedTime(value as string) as React.ReactNode}</td> :
                                                <td key={index}>{value as React.ReactNode}</td>;
                                    })}
                                    {request.Status === 'ended' || request.Status === "canceled" ?
                                        <>
                                            <td>Заявка закончена</td>
                                            <td>Заявка закончена</td>
                                            <td><Link to={`/request/${request.Id}`}>Подробнее</Link></td>
                                        </> :
                                        <>
                                            <td><Button variant="primary" onClick={() => { handleChangeStatus(request.Id, 'ended') }}>
                                                Закончить
                                            </Button></td>
                                            <td><Button variant="danger" onClick={() => { handleChangeStatus(request.Id, 'canceled') }}>
                                                Отменить
                                            </Button></td>
                                            <td><Link to={`/request/${request.Id}`}>Подробнее</Link></td>
                                            
                                        </>}
                                </tr>
                            ))}
                        </tbody>
                    </Table>}
            </div>
        </div>
    );
}

export default AllRequestsAdminPage;
