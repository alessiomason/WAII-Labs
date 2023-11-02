import React, { useState } from 'react';
import { Button, Container, Row, Col, Nav, Tab, Form, Alert, FloatingLabel } from 'react-bootstrap';
import "./LoginPage.css";
import API from "../API";

function LoginPage(props) {
  const [tab, setTab] = useState('first');
  const [saveMsg, setSaveMsg] = useState('');

  return (
    <Tab.Container id="left-tabs-example" activeKey={tab} onSelect={selectedKey => setTab(selectedKey)}>
      <Row>
        <Nav variant="pills" className="flex-column">
          <Row>
            <Col sm={3} />
            <Col>
              <Nav.Item className='gradient-custom'>
                <Nav.Link eventKey="first">Login</Nav.Link>
              </Nav.Item>
            </Col>
            <Col>
              <Nav.Item className='gradient-custom'>
                <Nav.Link eventKey="second">Sign up</Nav.Link>
              </Nav.Item>
            </Col>
            <Col sm={3} />
          </Row>
        </Nav>
      </Row>
      <Row>
        {saveMsg && <Alert variant="success" className="login_alert" onClose={() => setSaveMsg('')} dismissible>{saveMsg}</Alert>}
      </Row>
      <Row>
        <Tab.Content>
          <Tab.Pane eventKey="first"><LoginPane doLogin={props.doLogin} message={props.message} setMessage={props.setMessage} /></Tab.Pane>
          <Tab.Pane eventKey="second"><SignUpPane message={props.message} setMessage={props.setMessage} setSaveMsg={setSaveMsg} setTab={setTab} /></Tab.Pane>
        </Tab.Content>
      </Row>
    </Tab.Container>
  );
}

function LoginPane(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    let valid = true;

    if (email.trim() === '') {
      valid = false;
      props.setMessage('Email cannot be empty or contain only spaces.');
    }

    if (valid && password.trim() === '') {
      valid = false;
      props.setMessage('Password cannot be empty or contain only spaces.');
    }

    if (valid && !validateEmail(email)) {
      valid = false;
      props.setMessage('Email format not valid.');
    }

    if (valid) {
      props.doLogin(email, password);
    }

  }

  return (
    <Form onSubmit={handleSubmit}>
      {props.message && <Alert variant="danger" className="login_alert" onClose={() => props.setMessage('')} dismissible>{props.message}</Alert>}
      <Container className='d-flex justify-content-center'>
        <Row className='w-50'>
          <h3 className='text-center'>Login</h3>
          <Form.Group controlId="formBasicEmailLogin" autoFocus className='my-2'>
            <FloatingLabel controlId="floatingSelect" label="Email address">
              <Form.Control type="email" placeholder="Enter email address" value={email} onChange={ev => setEmail(ev.target.value)} />
            </FloatingLabel>
          </Form.Group>
          <Form.Group controlId="formBasicPasswordLogin" className='my-2'>
            <FloatingLabel controlId="floatingSelect" label="Password">
              <Form.Control type="password" placeholder="Enter password" value={password} onChange={ev => setPassword(ev.target.value)} />
            </FloatingLabel>
          </Form.Group>
          <div className="text-center mt-3 pt-1 pb-1">
            <Button className="w-50 gradient-custom" type="submit">Login</Button>
          </div>
        </Row>
      </Container>
    </Form>
  );
}

function SignUpPane(props) {

  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    let valid = true;

    if (role.trim() === '') {
      valid = false;
      props.setMessage('You have to choose a role.');
    }

    if (email.trim() === '') {
      valid = false;
      props.setMessage('Email cannot be empty or contain only spaces.');
    }

    if (valid && password.trim() === '') {
      valid = false;
      props.setMessage('Password cannot be empty or contain only spaces.');
    }

    if (valid && !validateEmail(email)) {
      valid = false;
      props.setMessage('Email format not valid.');
    }

    if (valid && firstName.trim() === '') {
      valid = false;
      props.setMessage('First name cannot be empty or contain only spaces.');
    }

    if (valid && lastName.trim() === '') {
      valid = false;
      props.setMessage('Last name cannot be empty or contain only spaces.');
    }

    if (valid && role === "customer" && phone.trim() === '') {
      valid = false;
      props.setMessage('Phone number cannot be empty or contain only spaces.');
    }

    if (valid) {
      if (role === "customer") {
        const customer = {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          phone: phone
        }
        API.createCustomer(customer).then(() => {
          props.setSaveMsg('The customer profile has been created.');
          props.setTab('first');
          setEmail('');
          setPassword('');
          setFirstName('');
          setLastName('');
          setPhone('');
        }).catch(err => {
          console.log("Error: " + err);
          props.setSaveMsg('Error during the creation of the customer.');
        });
      } else if (role === "expert") {
        const expert = {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName
        }
        API.createExpert(expert).then(() => {
          props.setSaveMsg('The expert profile has been created.');
          props.setTab('first');
          setEmail('');
          setPassword('');
          setFirstName('');
          setLastName('');
          setPhone('');
        }).catch(err => {
          console.log("Error: " + err);
          props.setSaveMsg('Error during the creation of the expert.');
        });
      }
    }

  }

  return (
    <Form onSubmit={handleSubmit}>
      {props.message && <Alert variant="danger" className="login_alert" onClose={() => props.setMessage('')} dismissible>{props.message}</Alert>}
      <Container className='d-flex justify-content-center'>
        <Row className='w-50'>
          <h3 className='text-center'>Sign up</h3>
          <Form.Group controlId="formBasicRole" className='my-2'>
            <Form.Select value={role} onChange={ev => setRole(ev.target.value)}>
              <option disabled value="">Choose role...</option>
              <option value="customer">Customer</option>
              <option value="expert">Expert</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formBasicEmailSignUp" autoFocus className='my-2'>
            <FloatingLabel controlId="floatingSelect" label="Email address">
              <Form.Control type="email" placeholder="Enter email address" value={email} onChange={ev => setEmail(ev.target.value)} />
            </FloatingLabel>
          </Form.Group>
          <Form.Group controlId="formBasicPasswordSignUp" className='my-2'>
            <FloatingLabel controlId="floatingSelect" label="Password">
              <Form.Control type="password" placeholder="Enter password" value={password} onChange={ev => setPassword(ev.target.value)} />
            </FloatingLabel>
          </Form.Group>
          <Form.Group controlId="formBasicFirstNameSignUp" className='my-2'>
            <FloatingLabel controlId="floatingSelect" label="First name">
              <Form.Control type="text" placeholder="Enter first name" value={firstName} onChange={ev => setFirstName(ev.target.value)} />
            </FloatingLabel>
          </Form.Group>
          <Form.Group controlId="formBasicLastNameSignUp" className='my-2'>
            <FloatingLabel controlId="floatingSelect" label="Last name">
              <Form.Control type="text" placeholder="Enter last name" value={lastName} onChange={ev => setLastName(ev.target.value)} />
            </FloatingLabel>
          </Form.Group>
          {role === "customer" ?
            <Form.Group controlId="formBasicPhoneSignUp" className='my-2'>
              <FloatingLabel controlId="floatingSelect" label="Phone number">
                <Form.Control type="tel" placeholder="Enter phone number" value={phone} onChange={ev => setPhone(ev.target.value)} />
              </FloatingLabel>
            </Form.Group> : null
          }
          <div className="text-center mt-3 pt-1 pb-1">
            <Button className="w-50 gradient-custom" type="submit">Sign up</Button>
          </div>
        </Row>
      </Container>
    </Form>
  );
}

function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export { LoginPage };