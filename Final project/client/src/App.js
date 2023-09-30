import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { House, BoxArrowLeft, Person } from 'react-bootstrap-icons';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { LoginPage } from "./login/LoginPage";
import CustomerHomePage from './customer/CustomerHomePage';
import ExpertHomePage from './expert/ExpertHomePage';
import ManagerHomePage from './manager/ManagerHomePage';
import TicketPage from './customer/TicketPage';
import API from './API';
import jwt_decode from "jwt-decode";
import {FormModifyProfile} from "./FormModifyProfile";

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  );
}
function App2() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(false);

  const navigate = useNavigate();

  // log the errors
  useEffect(() => {
    if (message !== '') {
      console.log(message);
    }
  }, [message])

  // on start check if access token is still saved (so, still logged in)
  useEffect(() => {
    let mustRefreshToken = true;
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken !== '' && accessToken !== null) {
      const accessTokenExpirationTime = jwt_decode(accessToken).exp * 1000;

      if (accessTokenExpirationTime > new Date().getTime()) {
        mustRefreshToken = false;

        const username = jwt_decode(accessToken).preferred_username;
        const name = jwt_decode(accessToken).name;
        const email = jwt_decode(accessToken).email;
        const role = jwt_decode(accessToken).resource_access['wa2-products-client'].roles[0];
        setUsername(username);
        setName(name);
        setEmail(email);
        setRole(role);
        setLoggedIn(true);
        setMessage('');
        setTimeout(doRefresh, accessTokenExpirationTime - new Date().getTime());
      }
    }

    if (mustRefreshToken) { // true if accessToken is null or expired
      doRefresh();
    }
  }, [])

  function doLogin(email, password) {
    API.login(email, password)
      .then(jwtDTO => {
        localStorage.setItem('accessToken', jwtDTO.accessToken);
        localStorage.setItem('refreshToken', jwtDTO.refreshToken);
        setTimeout(doRefresh, jwt_decode(jwtDTO.accessToken).exp * 1000 - new Date().getTime());

        const username = jwt_decode(jwtDTO.accessToken).preferred_username;
        const name = jwt_decode(jwtDTO.accessToken).name;
        const email = jwt_decode(jwtDTO.accessToken).email;
        const role = jwt_decode(jwtDTO.accessToken).resource_access['wa2-products-client'].roles[0];
        setUsername(username);
        setName(name);
        setEmail(email);
        setRole(role);
        setMessage('');
        setLoggedIn(true);
        navigate('/');
      })
      .catch(err => {
        setMessage('Email or password incorrect.');
      })
  }

  function doRefresh() {
    let mustLogout = true;
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken !== '' && refreshToken !== null) {
      const refreshTokenExpirationTime = jwt_decode(refreshToken).exp * 1000;

      if (refreshTokenExpirationTime > new Date().getTime()) {
        mustLogout = false;

        API.refreshLogin(refreshToken)
          .then(jwtDTO => {
            localStorage.setItem('accessToken', jwtDTO.accessToken);
            localStorage.setItem('refreshToken', jwtDTO.refreshToken);
            setTimeout(doRefresh, jwt_decode(jwtDTO.accessToken).exp * 1000 - new Date().getTime());

            const username = jwt_decode(jwtDTO.accessToken).preferred_username;
            const name = jwt_decode(jwtDTO.accessToken).name;
            const email = jwt_decode(jwtDTO.accessToken).email;
            const role = jwt_decode(jwtDTO.accessToken).resource_access['wa2-products-client'].roles[0];
            setUsername(username);
            setName(name);
            setEmail(email);
            setRole(role);
            setMessage('');
            setLoggedIn(true);
          })
          .catch(err => {
            setMessage(err);
          })
      }
    }

    if (mustLogout) { // true if refreshToken is null or expired
      doLogout();
    }
  }

  function doLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUsername('');
    setName('');
    setEmail('');
    setRole('');
    setMessage('');
    setLoggedIn(false);
  }

  function doSignUp(email, password, firstName, lastName, phone) {
    // TO DO
    console.log("SIGN UP || TO DO");
    return false;
  }

  function handleError(err) {
    console.log(err);
  }

  return (
    <Routes>
      <Route path='/login' element={loggedIn ? <Navigate to='/' /> : <LoginPage loggedIn={loggedIn} doLogin={doLogin} doSignUp={doSignUp} message={message} setMessage={setMessage} />} />
      <Route path='/' element={loggedIn ? <PageLayout loggedIn={loggedIn} doLogin={doLogin} doLogout={doLogout} email={email} /> : <Navigate to='/login' />}>
        <Route index element={role === 'customer' ? <CustomerHomePage name={name} /> :
          role === 'expert' ? <ExpertHomePage name={name} /> :
            <ManagerHomePage name={name} />} />
        <Route path='ticket/:ticketId' element={<TicketPage email={email} />} />
        <Route path='purchase/:purchaseId' element={<></>} />
        <Route path='new-ticket' element={<></>} />
        <Route path='new-purchase' element={<></>} />
        <Route path='profile/:email' element={<FormModifyProfile dirty={dirty} setDirty={setDirty} email={email} handleError={handleError} />} />
      </Route>

      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
}

function PageLayout(props) {
  const navigate = useNavigate();

  return (
    <Container>
      <Row className='navbar'>
        <Col>
          <Button variant='light' className='navbar-button' onClick={() => navigate('/')}>
            <span className='d-flex justify-content-center align-items-center'><House />Home</span>
          </Button>
        </Col>
        <Col>
          <Button variant='light' className='navbar-button' onClick={() => navigate('/profile/' + props.email)}>
            <span className='d-flex justify-content-center align-items-center'><Person />Profile</span>
          </Button>
        </Col>
        <Col>
          <Button variant='light' className='navbar-button' onClick={() => props.doLogout()}>
            <span className='d-flex justify-content-center align-items-center'><BoxArrowLeft />Logout</span>
          </Button>
        </Col>
      </Row>
      <Row>
        <Outlet />
      </Row>
    </Container>
  );
}

export default App;