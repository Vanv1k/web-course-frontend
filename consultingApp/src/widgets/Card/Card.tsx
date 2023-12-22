import Button from 'react-bootstrap/Button';
import CardBootstrap from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import "./styles.css"
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setNumOfProdInReq } from '../../redux/filterAndActiveRequestID/actions';
import axios from 'axios';

interface CardProps {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    buttonAddClicked: () => void;
}

const MAX_DESCRIPTION_LENGTH = 100;

const Card: React.FC<CardProps> = (props) => {
    const truncatedDescription = props.description.length > MAX_DESCRIPTION_LENGTH
        ? `${props.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
        : props.description;

    const numOfCons = useSelector((state: RootState) => state.filterAndActiveId.numOfCons);
    const dispatch = useDispatch();

    const handleAddToCard = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        console.log(event)
        try {
            event.preventDefault();
            await axios.post(
                `/api/consultations/${props.id}/add-to-request`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            dispatch(setNumOfProdInReq((numOfCons + 1)));
            const currentNumOfCons = localStorage.getItem('numOfCons');
            const currentNum = currentNumOfCons ? parseInt(currentNumOfCons, 10) : 0;
            const updatedNumOfCons = currentNum + 1;
            localStorage.setItem('numOfCons', updatedNumOfCons.toString());
            if (updatedNumOfCons != numOfCons) {
                dispatch(setNumOfProdInReq(updatedNumOfCons));
            }
            props.buttonAddClicked()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (

        <CardBootstrap className="card-container" style={{ width: '18rem', marginTop: '3rem', margin: '8% 10% 5% 10%' }}>
            <Link className='link' to={`/consultations/${props.id}`}>
                <CardBootstrap.Img variant="top" src={props.image} />
                <CardBootstrap.Body>
                    <CardBootstrap.Title >{props.name} </CardBootstrap.Title>
                    <CardBootstrap.Text >
                        {truncatedDescription}
                    </CardBootstrap.Text>
                    <>
                        <Button variant="primary" onClick={handleAddToCard}>Провести</Button>
                        <CardBootstrap.Text style={{ display: 'inline-block', fontWeight: 'bold', marginTop: '2%', marginLeft: '5%' }}>
                            {props.price} рублей
                        </CardBootstrap.Text>
                    </>
                </CardBootstrap.Body>
            </Link>
        </CardBootstrap>

    );
}

export default Card;