import Navbar from '../../widgets/Navbar/Navbar'
import Card from '../../widgets/Card/Card'
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react'
import { ChangeEvent } from 'react';
import testData from '../../data';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRequestID, setMaxPriceFilter, setNumOfProdInReq } from '../../redux/filterAndActiveRequestID/actions';
import { loginSuccess, loginFailure, setRole } from '../../redux/auth/authSlice';
import { RootState } from '../../redux/store';
import CartImg from '../../assets/cart-check-svgrepo-com.svg';
import EmptyCartImg from '../../assets/cart-cross-svgrepo-com.svg'
import Loader from '../../widgets/Loader/Loader';
import './styles.css'

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
const MainPage: React.FC = () => {
    const [data, setData] = useState<Data | null>({ id: 0, consultation: [] });
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const numOfCons = useSelector((state: RootState) => state.filterAndActiveId.numOfCons);
    const maxPriceFilter = useSelector((state: RootState) => state.filterAndActiveId.maxPriceFilter);
    const activeRequest = useSelector((state: RootState) => state.filterAndActiveId.activeRequestID);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const role = useSelector((state: RootState) => state.auth.role);

    const fetchData = async () => {
        setLoading(true);
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
            setLoading(false);
            const result = await response?.data;
            localStorage.setItem("ActiveRequestId", result?.ActiveRequestId?.toString() || '');
            dispatch(setActiveRequestID(result?.ActiveRequestId));
            console.log(result);
            setData(result);
        } catch (error) {
            setLoading(false);
            console.log(testData)
            let result = { ...testData };
            if (maxPriceFilter) {
                result.consultation = testData.consultation.filter((consultation) => consultation.Price <= parseInt(maxPriceFilter));
            }
            setData(result)
            console.error('ошибка при выполнении запроса:', error);
        }
    };

    const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        const isValidNumber = /^\d*$/.test(inputValue);
      
        if (isValidNumber || inputValue === '') {
          const maxPriceString = inputValue !== '' ? parseInt(inputValue).toString() : '';
          dispatch(setMaxPriceFilter(maxPriceString));
        }
    };

    const buttonAddClicked = () => {
        if (!activeRequest) {
            fetchData()
        }
    }

    useEffect(() => {
        console.log('MainPage useEffect is triggered');
        fetchData()
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
    }, [dispatch, maxPriceFilter]);


    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="container">
                    <Link to="/" style={{ textDecoration: 'none', color: 'grey' }}>
                        <p>Главная</p>
                    </Link>
                    {role > 0 ? <Link to="/main-page/admin">Сменить режим просмотра</Link> : null}
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
                <Loader/>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="container">
                <Link to="/" style={{ textDecoration: 'none', color: 'grey' }}>
                    <p>Главная</p>
                </Link>
                {role > 0 ? <Link to="/main-page/admin">Сменить режим просмотра</Link> : null}
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
                {data?.consultation.length === 0 ?
                    <h2 style={{marginTop: "10%"}}>Нет данных</h2>
                    : <>
                        <div className="row">
                            {data?.consultation?.map((item) => (
                                <div key={item.Id} className="col-lg-4 col-md-6 col-sm-12">
                                    <Card
                                        id={item.Id}
                                        name={item.Name}
                                        description={item.Description}
                                        image={item.Image}
                                        price={item.Price}
                                        buttonAddClicked={buttonAddClicked}
                                    />
                                </div>
                            ))}
                        </div>
                        {isAuthenticated ?
                            (activeRequest && numOfCons > 0) ?
                                <Link className='cart' to={`/request/${activeRequest}`}>
                                    <img src={CartImg} />
                                </Link> :
                                <Link className='cart empty' to='/shopping-cart' >
                                    <img src={EmptyCartImg} />
                                </Link>
                            : null
                        } </>}
            </div>
        </div>
    )
}

export default MainPage 