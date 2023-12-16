import Navbar from '../../widgets/Navbar/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./styles.css"

const RegistrationPage = () => {

    return (
        <div>
            <Navbar />
            <div className='container registration-page'>
                <h1 className='small-h1'>Регистрация</h1>
                <Form className='registration-form'>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="Имя"
                            name="name"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Логин</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="Логин"
                            name="login"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email"     
                            placeholder="Email"
                            name="email"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Телефон</Form.Label>
                        <Form.Control 
                            type="text"     
                            placeholder="Телефон"
                            name="phoneNumber"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Введите пароль"
                            name="password"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Подтвердите пароль</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Пароль"
                            name="repeatPassword"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Зарегистрироваться
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default RegistrationPage;