import { Button, Alert, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FormCreateProfile(props) {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [errorMsg, setErrorMsg] = useState('');  // stringa vuota '' = non c'e' errore
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const newProfile = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phone: phone
        }
        // API.createProfile(newProfile);
        props.setDirty(true);
        navigate('/');
    }
    return (
        <>
            <Container>
                <h1 className="title_profiles">Create Profile</h1>
                <Row>
                    <Col>
                        {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='email' value={email} onChange={ev => setEmail(ev.target.value)} >
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type='text' value={firstName} onChange={ev => setFirstName(ev.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type='text' value={lastName} onChange={ev => setLastName(ev.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type='text' value={phone} onChange={ev => setPhone(ev.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Button type='submit' className='save_button'>Save</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export { FormCreateProfile };