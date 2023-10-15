import {Button, Alert, Form } from 'react-bootstrap';
import { Container, Row } from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import API from "./API";
import './ProfileList.css'

function FormModifyProfile(props) {
    const [emailAddress,setEmailAddress] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName,setLastName]=useState("");
    const [phone, setPhone] = useState("");
    const [id, setId] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [saveMsg, setSaveMsg] = useState('');
    const {email}  = useParams();

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const editedProfile = {
            id: id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            phone: phone
        }

        let valid = true;

        if (valid && firstName.trim() === '') {
            valid = false;
            setErrorMsg('First name cannot be empty or contain only spaces.');
        }

        if (valid && lastName.trim() === '') {
            valid = false;
            setErrorMsg('Last name cannot be empty or contain only spaces.');
        }

        if (valid && phone.trim() === '') {
            valid = false;
            setErrorMsg('Phone number cannot be empty or contain only spaces.');
        }

        if (valid) {
            API.editProfile(editedProfile).then( () => {
                props.setDirty(true);
                setSaveMsg('The profile has been edited.')
            }).catch(err => {
                props.handleError(err);
                setSaveMsg('Error during the editing.')
            });
        }
    }

    useEffect(() => {
        API.getProfileByEmail(email)
            .then((p) => {
                setId(p.id);
                setEmailAddress(p.email);
                setFirstName(p.firstName);
                setLastName(p.lastName);
                setPhone(p.phone);
                setErrorMsg('');
            }).catch(err => props.handleError(err));
    }, [email, props]);

    return (
      <Form onSubmit={handleSubmit} >
          {errorMsg && <Alert variant="danger" className="login_alert" onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert>}
          {saveMsg && <Alert variant="success" className="login_alert" onClose={() => setSaveMsg('')} dismissible>{saveMsg}</Alert>}
          <Container className='d-flex justify-content-center mt-5'>
              <Row className='w-50'>
                  <h3 className='text-center'>My Profile</h3>
                  <Form.Group controlId="formBasicEmailSignUp" autoFocus className='my-2'>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" value={emailAddress} disabled readOnly={true} />
                  </Form.Group>
                  <Form.Group controlId="formBasicFirstNameSignUp" className='my-2'>
                      <Form.Label>First name</Form.Label>
                      <Form.Control type="text" placeholder="Enter first name" value={firstName} onChange={ev => setFirstName(ev.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="formBasicLastNameSignUp" className='my-2'>
                      <Form.Label>Last name</Form.Label>
                      <Form.Control type="text" placeholder="Enter last name" value={lastName} onChange={ev => setLastName(ev.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="formBasicPhoneSignUp" className='my-2'>
                      <Form.Label>Phone number</Form.Label>
                      <Form.Control type="tel" placeholder="Enter phone number" value={phone} onChange={ev => setPhone(ev.target.value)} />
                  </Form.Group>
                  <div className="text-center mt-3 pt-1 pb-1">
                      <Button className="w-50 gradient-custom" type="submit">Save edit</Button>
                      <Button className="w-50 gradient-custom" onClick={() => navigate('/profiles/' + email)}>Back</Button>
                  </div>
              </Row>
          </Container>
      </Form>
    );
}

export {FormModifyProfile};