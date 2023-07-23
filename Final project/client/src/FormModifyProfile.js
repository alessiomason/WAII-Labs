import { Button, Alert, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import API from "./API";
import './ProfileList.css'


function FormModifyProfile(props) {
    const [emailAddress,setEmailAddress] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName,setLastName]=useState("");
    const [phone, setPhone] = useState("");
    const [errorMsg, setErrorMsg] = useState('');  // stringa vuota '' = non c'e' errore
    const {email}  =useParams();

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const editedProfile = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phone: phone
        }
        API.editProfile(editedProfile);
        props.setDirty(true);
        navigate('/profiles/' + email);
    }

    useEffect(() => {
        API.getProfileById(email)
            .then((p) => {
                setEmailAddress(p.email);
                setFirstName(p.firstName);
                setLastName(p.lastName);
                setPhone(p.phone);
                setErrorMsg('');
            })
            .catch(err => props.handleError(err));
    }, [email, props]);

    return (
        <>
            <Container>
                <h1 className="title_profiles">Editing Profile...</h1>
                <Row>
                    <Col>
                        {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='text' value={emailAddress} disabled readOnly={true} >
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
                            <Button className='back_button' onClick={() => navigate('/profiles/' + email)}>Back</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export {FormModifyProfile};