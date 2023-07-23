import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import { ArrowRightCircle, House } from 'react-bootstrap-icons';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { ProductList } from "./ProductList";
import { ProductById } from "./ProductById";
import { ProfileByMail } from "./ProfileByMail";
import { FormModifyProfile } from "./FormModifyProfile";
import { FormCreateProfile } from "./FormCreateProfile";

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  );
}
function App2() {

  const [dirty, setDirty] = useState(false);

  function handleError(err) {
    console.log(err);
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<PageLayout />}>
          <Route index element={<ListOfRoutes />} />
          <Route path='/products' element={<ProductList handleError={handleError} />} />
          <Route path='/products/:ean' element={<ProductById handleError={handleError} />} />
          <Route path='/profiles' element={<FormCreateProfile handleError={handleError} dirty={dirty} setDirty={setDirty} />} />
          <Route path='/profiles/:email' element={<ProfileByMail handleError={handleError} dirty={dirty} setDirty={setDirty} />} />
          <Route path='/editProfile/:email' element={<FormModifyProfile handleError={handleError} dirty={dirty} setDirty={setDirty} />} />
        </Route>

        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  );
}

function PageLayout() {
  const navigate = useNavigate();

  return (
    <Container>
      <Row className='navbar'>
        <Button variant='light' onClick={() => navigate('/')} ><House /> Back to home page</Button>
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
