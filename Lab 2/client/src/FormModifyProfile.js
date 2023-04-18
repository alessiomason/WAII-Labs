import { Button, Alert, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import API from "./API";


function FormModifyProfile(props) {
    const [email,setEmail] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName,setLastName]=useState("");
    const [phone, setPhone] = useState("");
    const [errorMsg, setErrorMsg] = useState('');  // stringa vuota '' = non c'e' errore
    const {mail}  =useParams();

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // PUT API
    }

    useEffect(() => {
        API.getProfileById(mail)
            .then((p) => {
                setEmail(p.email);
                setFirstName(p.firstName);
                setLastName(p.lastName);
                setPhone(p.phone);
                setErrorMsg('');
            })
            .catch(err =>props.handleError(err));
    }, []);

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='text' value={email} readOnly={true} }>
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
                            <Button type='submit' >Save</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export {FormModifyProfile};