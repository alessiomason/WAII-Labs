import React, { useState } from 'react';
import "./LoginPage.css";
import { Button } from 'react-bootstrap';

function LoginPage(props) {
  const [activeTab, setActiveTab] = useState('loginTab');;

  const handleJustifyClick = (value) => {
    if (value === activeTab) {
      return;
    }

    setActiveTab(value);
  };

  return (
    <></>
  );
}

/*
function LoginPane(props) {
  const [email, setEmail] = useState('customer1@products.com');
  const [password, setPassword] = useState('password');

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                style={{ width: '185px' }} alt="logo" />
              <h4 className="mt-1 mb-5 pb-1">We are The Lotus Team</h4>
            </div>
            <p>Please login to your account</p>
            <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email' value={email} onChange={ev => setEmail(ev.target.value)} />
            <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
            <div className="text-center pt-1 mb-5 pb-1">
              <Button className="mb-4 w-100 gradient-custom-2" onClick={() => props.doLogin(email, password)}>Sign in</Button>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
*/

export { LoginPage };