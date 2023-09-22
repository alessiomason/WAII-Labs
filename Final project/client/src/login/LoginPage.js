import React, { useState } from 'react';
import { Button, Container, Row, Col, Nav, Tab, Form, Alert } from 'react-bootstrap';
import "./LoginPage.css";

function LoginPage(props) {
  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
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
        <Tab.Content>
          <Tab.Pane eventKey="first"><LoginPane doLogin={props.doLogin} message={props.message} setMessage={props.setMessage}/></Tab.Pane>
          <Tab.Pane eventKey="second"><SignUpPane /></Tab.Pane>
        </Tab.Content>
      </Row>
    </Tab.Container>
  );
}

function LoginPane(props) {

  function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
  }

  const [email, setEmail] = useState('customer1@products.com');
  const [password, setPassword] = useState('password');

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
          <Form.Group controlId="formBasicEmail" autoFocus className='my-2'>
            <Form.Control type="email" placeholder="Enter email address" value={email} onChange={ev => setEmail(ev.target.value)} />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" className='my-2'>
            <Form.Control type="password" placeholder="Enter password" value={password} onChange={ev => setPassword(ev.target.value)} />
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
  return (
    <p className='text-center'>Sign up</p>
  );
}

export { LoginPage };