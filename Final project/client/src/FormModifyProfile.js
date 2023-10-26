import {Button, Alert, Form, Table, FormControl} from 'react-bootstrap';
import { Container, Row } from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import API from "./API";
import './ProfileList.css'

function FormModifyProfile(props) {
    const [firstName, setFirstName] = useState('');
    const [lastName,setLastName]=useState("");
    const [phone, setPhone] = useState("");
    const [id, setId] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [saveMsg, setSaveMsg] = useState('');
    const [specializations, setSpecializations] = useState([]);
    const [ticketIds, setTicketIds] = useState([]);
    const [newSpecialization, setNewSpecialization] = useState('');
    const {email}  = useParams();

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        let editedProfile;
        if (props.role === "customer") {
            editedProfile = {
                id: id,
                email: email,
                firstName: firstName,
                lastName: lastName,
                phone: phone
            }
        } else if (props.role === "expert") {
            editedProfile = {
                id: id,
                firstName: firstName,
                lastName: lastName,
                specializations: specializations,
                ticketIds: ticketIds
            }
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

        if (valid && props.role === 'customer' && phone.trim() === '') {
            valid = false;
            setErrorMsg('Phone number cannot be empty or contain only spaces.');
        }

        if (valid) {
            if (props.role === "customer") {
                API.editProfile(editedProfile).then( () => {
                    props.setDirty(true);
                    setSaveMsg('The profile has been edited.')
                }).catch(err => {
                    props.handleError(err);
                    setSaveMsg('Error during the editing.')
                });
            } else if (props.role === "expert") {
                API.editExpert(editedProfile).then( () => {
                    props.setDirty(true);
                    setSaveMsg('The profile has been edited.')
                }).catch(err => {
                    props.handleError(err);
                    setSaveMsg('Error during the editing.')
                });
            }
        }
    }

    const handleRemoveSpecialization = (specialization) => {
        API.removeSpecialization(specialization).then(() => {
            props.setDirty(true);
        }).catch(err => {
            props.handleError(err);
            setSaveMsg('Error during the editing.')
        });
    };

    const handleAddSpecialization = (id, newSpecialization) => {
        API.addSpecialization(id, newSpecialization).then(() => {
            props.setDirty(true);
            setNewSpecialization('');
        }).catch(err => {
            props.handleError(err);
            setSaveMsg('Error during the editing.')
        });
    };

    useEffect(() => {
        if (props.role === "customer") {
            API.getProfileByEmail(email)
                .then((p) => {
                    setId(p.id);
                    setFirstName(p.firstName);
                    setLastName(p.lastName);
                    setPhone(p.phone);
                    setErrorMsg('');
                }).catch(err => props.handleError(err));
        } else if (props.role === "expert") {
            API.getExpertByEmail(email)
                .then((p) => {
                    setId(p.id);
                    setFirstName(p.firstName);
                    setLastName(p.lastName);
                    setSpecializations(p.specializations);
                    setTicketIds(p.ticketIds);
                    setErrorMsg('');
                }).catch(err => props.handleError(err));
        }
        props.setDirty(false);
    }, [email, props, props.dirty]);

    return (
      <>
      <Form onSubmit={handleSubmit} >
          {errorMsg && <Alert variant="danger" className="login_alert" onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert>}
          {saveMsg && <Alert variant="success" className="login_alert" onClose={() => setSaveMsg('')} dismissible>{saveMsg}</Alert>}
          <Container className='d-flex justify-content-center mt-5'>
              <Row className='w-50'>
                  <h3 className='text-center'>My Profile</h3>
                  <Form.Group controlId="formBasicEmailSignUp" autoFocus className='my-2'>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" value={email} disabled readOnly={true} />
                  </Form.Group>
                  <Form.Group controlId="formBasicFirstNameSignUp" className='my-2'>
                      <Form.Label>First name</Form.Label>
                      <Form.Control type="text" placeholder="Enter first name" value={firstName} onChange={ev => setFirstName(ev.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="formBasicLastNameSignUp" className='my-2'>
                      <Form.Label>Last name</Form.Label>
                      <Form.Control type="text" placeholder="Enter last name" value={lastName} onChange={ev => setLastName(ev.target.value)} />
                  </Form.Group>
                  {props.role === "customer" ?
                      <Form.Group controlId="formBasicPhoneSignUp" className='my-2'>
                          <Form.Label>Phone number</Form.Label>
                          <Form.Control type="tel" placeholder="Enter phone number" value={phone} onChange={ev => setPhone(ev.target.value)} />
                      </Form.Group> : null
                  }
                  { props.role === "expert" ?
                    <div>
                        <h3 className='text-center'>My Specializations</h3>
                        <Table>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {specializations.map((specialization, index) => (
                              <tr key={index}>
                                  <td>{specialization.name}</td>
                                  <td><Button onClick={() => handleRemoveSpecialization(specialization)}>X</Button></td>
                              </tr>
                            ))}
                            <tr>
                                <td>
                                    <FormControl
                                      placeholder="New specialization"
                                      value={newSpecialization}
                                      onChange={(e) => setNewSpecialization(e.target.value)}
                                    />
                                </td>
                                <td><Button onClick={ () => handleAddSpecialization(id, newSpecialization) }>+</Button></td>
                            </tr>
                            </tbody>
                        </Table>
                    </div> : null
                  }
                  <div className="text-center mt-3 pt-1 pb-1">
                      <Button className="w-50 gradient-custom" type="submit">Save edit</Button>
                      <Button className="w-50 gradient-custom" onClick={() => navigate('/')}>Back</Button>
                  </div>
              </Row>
          </Container>
      </Form>
      </>
    );
}

export {FormModifyProfile};