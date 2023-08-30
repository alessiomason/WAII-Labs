import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import { ArrowRightCircle, House } from 'react-bootstrap-icons';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { LoginPage } from "./LoginPage";
import API from './API';
import jwt_decode from "jwt-decode";

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  );
}
function App2() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // log the errors
  useEffect(() => {
    if (message != '') {
      console.log(message);
    }
  }, [message])

  // on start check if access token is still saved (so, still logged in)
  useEffect(() => {
    let mustRefreshToken = true;
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken != '' && accessToken != null) {
      const accessTokenExpirationTime = jwt_decode(accessToken).exp * 1000;

      if (accessTokenExpirationTime > new Date().getTime()) {
        mustRefreshToken = false;
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
        setMessage('');
        setLoggedIn(true);
        navigate('/');
      })
      .catch(err => {
        setMessage(err);
      })
  }

  function doRefresh() {
    let mustLogout = true;
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken != '' && refreshToken != null) {
      const refreshTokenExpirationTime = jwt_decode(refreshToken).exp * 1000;

      if (refreshTokenExpirationTime > new Date().getTime()) {
        mustLogout = false;

        API.refreshLogin(refreshToken)
          .then(jwtDTO => {
            localStorage.setItem('accessToken', jwtDTO.accessToken);
            localStorage.setItem('refreshToken', jwtDTO.refreshToken);
            setTimeout(doRefresh, jwt_decode(jwtDTO.accessToken).exp * 1000 - new Date().getTime());
            setMessage('');
            setLoggedIn(true);
            navigate('/');
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
    setMessage('');
    setLoggedIn(false);
  }

  return (
    <>
      <Routes>
        <Route path='/login' element={loggedIn ? <Navigate to='/' /> : <LoginPage loggedIn={loggedIn} doLogin={doLogin} message={message} setMessage={setMessage} />} />
        <Route path='/' element={loggedIn ? <PageLayout loggedIn={loggedIn} doLogin={doLogin} doLogout={doLogout} /> : <Navigate to='/login' />}>
        </Route>

        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  );
}

function PageLayout(props) {
  return (
    <Container>
      <Row className='navbar'>
        <Button variant='light' onClick={() => props.doLogout()}><House /> Logout</Button>
      </Row>
      <Row>
        <Outlet />
      </Row>
    </Container>
  );
}

function ListOfRoutes() {
  const navigate = useNavigate();

  return (
    <>
      <h1 className='list_routes_title'> Available routes </h1>
      <ul>
        <li className='string_list'><Button onClick={() => navigate('/products')}>/products</Button> <ArrowRightCircle /> list all registered products in the DB </li>
        <li className='string_list'><Button onClick={() => navigate('/products/8712725728528')}>/products/:ean</Button> <ArrowRightCircle /> details of a specific product by EAN</li>
        <li className='string_list'><Button onClick={() => navigate('/profiles/flongwood0@vk.com')}>/profiles/:email</Button> <ArrowRightCircle /> details of a specific user profile by email</li>
        <li className='string_list'><Button onClick={() => navigate('/editProfile/flongwood0@vk.com')}>/editProfile/:email</Button> <ArrowRightCircle /> edit a specific user profile </li>
        <li className='string_list'><Button onClick={() => navigate('/profiles')}>/profiles</Button> <ArrowRightCircle /> create a user profile </li>
      </ul>
    </>
  )
}
export default App;
