import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRequests } from '../../redux/request/requestActions';
import { RootState } from '../../redux/store';
import Navbar from '../../widgets/Navbar/Navbar';
import Loader from '../../widgets/Loader/Loader';
import Table from 'react-bootstrap/Table';



const AllRequestsPage = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state: RootState) => state.request.data);
  const status = useSelector((state: RootState) => state.request.status);

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
  useEffect(() => {
    dispatch(getAllRequests());
  }, [dispatch]);

  if (!requests || requests.length === 0) {
    return (
      <>
      <Navbar/>
      <Loader />
      </>
    );
  }
  
  return (
    <div>
      <Navbar />
      <div style={{ margin: '10% 10% 0 10%' }}>
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
