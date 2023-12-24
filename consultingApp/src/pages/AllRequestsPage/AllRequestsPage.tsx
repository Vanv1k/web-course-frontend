import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRequests } from '../../redux/request/requestActions';
import { RootState } from '../../redux/store';
import Navbar from '../../widgets/Navbar/Navbar';
import Loader from '../../widgets/Loader/Loader';
import { Link } from 'react-router-dom';
import { loginSuccess, setRole } from '../../redux/auth/authSlice';
import Table from 'react-bootstrap/Table';



const AllRequestsPage = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state: RootState) => state.request.data);

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

  const fetchData = async () => {
    try {
      await dispatch(getAllRequests());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
    if (window.localStorage.getItem("accessToken")) {
      dispatch(loginSuccess())
    }
    if (window.localStorage.getItem("role")) {
      const roleString = window.localStorage.getItem("role");
      const role = roleString ? parseInt(roleString) : 0;
      dispatch(setRole(role))
    }
    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => {
      clearInterval(pollingInterval);
    };
  }, [dispatch]);

  if (!requests || requests.length === 0) {
    return (
      <>
        <Navbar />
        <Loader />
      </>
    );
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
      <div style={{ margin: '2% 10% 0 10%' }}>
        <Table striped bordered hover>
          <thead>
            {/* <tr>
              {Object.keys(requests[0]).map((key) => (
                <th key={key}>{key}</th>
              ))} */}
            <tr>
              <th key={'status'}>Статус</th>
              <th key={'formDate'}>Сформирована</th>
              <th key={'endDate'}>Закончена</th>
              <th key={'consPlace'}>Место консультации</th>
              <th key={'consTime'}>Время консультации</th>
              <th key={'companyName'}>Компания</th>
              {/* 1 3 4 7 8 9  0 2 5 6 */}
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index}>
                {Object.values(request).map((value, index) => {
                  const excludedIndices = [0, 2, 5, 6];
                  const timeRows = [3, 4, 8]
                  return excludedIndices.includes(index) ? null :
                    timeRows.includes(index) ? <td key={index}>{formattedTime(value as string) as React.ReactNode}</td> :
                      <td key={index}>{value as React.ReactNode}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default AllRequestsPage;
