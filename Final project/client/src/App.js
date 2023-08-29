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

  // on start check if access token is still saved (so, still logged in)
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken != '' && accessToken != null) {
      const expirationTime = jwt_decode(accessToken).exp * 1000;

      if (expirationTime <= new Date().getTime()) {
        doLogout();
      } else {
        setLoggedIn(true);
        setMessage('');
        setTimeout(doLogout, expirationTime - new Date().getTime());
      }
    }
  }, [])

  function doLogin(email, password) {
    API.login(email, password)
      .then(token => {
        setLoggedIn(true);
        localStorage.setItem('accessToken', token);
        setTimeout(doLogout, jwt_decode(token).exp * 1000 - new Date().getTime());
        setMessage('');
        navigate('/');
      })
      .catch(err => {
        setMessage(err);
      })
  }

  function doLogout() {
    setLoggedIn(false);
    localStorage.removeItem('accessToken');
    setMessage('');
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
