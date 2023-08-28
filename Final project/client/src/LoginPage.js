import React, { useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCheckbox
}
  from 'mdb-react-ui-kit';
import "./LoginPage.css";

function LoginPage(props) {
  const [activeTab, setActiveTab] = useState('loginTab');;

  const handleJustifyClick = (value) => {
    if (value === activeTab) {
      return;
    }

    setActiveTab(value);
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('loginTab')} active={activeTab === 'loginTab'}>
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('signupTab')} active={activeTab === 'signupTab'}>
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={activeTab === 'loginTab'}>
          <LoginPane doLogin={props.doLogin} />
        </MDBTabsPane>

        <MDBTabsPane show={activeTab === 'signupTab'}>
          <SignUpPane />
        </MDBTabsPane>

      </MDBTabsContent>
    </MDBContainer>
  );
}

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
              <MDBBtn className="mb-4 w-100 gradient-custom-2" onClick={() => props.doLogin(email, password)}>Sign in</MDBBtn>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

function SignUpPane() {
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
            <p>Please register your account</p>
            <MDBInput wrapperClass='mb-4' label='Email address' id='email' type='email' />
            <MDBInput wrapperClass='mb-4' label='Name' id='name' type='text' />
            <MDBInput wrapperClass='mb-4' label='Surname' id='surname' type='text' />
            <MDBInput wrapperClass='mb-4' label='Phone number' id='form1' type='tel' />
            <MDBInput wrapperClass='mb-4' label='Password' id='form1' type='password' />
            <div className='d-flex justify-content-center mb-4'>
              <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I have read and agree to the terms' />
            </div>
            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn className="mb-4 w-100 gradient-custom-2">Sign in</MDBBtn>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export { LoginPage };