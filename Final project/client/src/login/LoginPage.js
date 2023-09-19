import React, { useState } from 'react';
import { Button, Container, Row, Col, Nav, Tab, Form } from 'react-bootstrap';
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
          <Tab.Pane eventKey="first"><LoginPane doLogin={props.doLogin} /></Tab.Pane>
          <Tab.Pane eventKey="second"><SignUpPane /></Tab.Pane>
        </Tab.Content>
      </Row>
    </Tab.Container>
  );
}

function LoginPane(props) {
  const [email, setEmail] = useState('customer1@products.com');
  const [password, setPassword] = useState('password');

  function handleSubmit(event) {
    event.preventDefault();
    props.doLogin(email, password);
  }

  return (
    <Form onSubmit={handleSubmit}>
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