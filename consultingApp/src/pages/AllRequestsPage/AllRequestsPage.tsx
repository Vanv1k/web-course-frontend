import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRequests } from '../../redux/request/requestActions';
import { RootState } from '../../redux/store';
import Navbar from '../../widgets/Navbar/Navbar';
import Table from 'react-bootstrap/Table';

// ... (other imports and code)

function AllRequestsPage() {
    const dispatch = useDispatch();
    const requests = useSelector((state: RootState) => state.request.data);
    const status = useSelector((state: RootState) => state.request.status);
  
    useEffect(() => {
      dispatch(getAllRequests());
    }, [dispatch]);
  
    // Check if requests is undefined or an empty array before rendering
    if (!requests || requests.length === 0) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <Navbar />
        <Table style={{ 'marginTop': '10%' }} striped bordered hover>
          <thead>
            <tr>
              {Object.keys(requests[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index}>
                {Object.values(request).map((value, index) => (
                  <td key={index}>{value as React.ReactNode}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
  
  export default AllRequestsPage;
  