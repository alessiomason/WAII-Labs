import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
        <Route path='/' element={<ListOfRoutes />} />
        <Route path='/products' element={<ProductList handleError={handleError} />} />
        <Route path='/products/:ean' element={<ProductById handleError={handleError} />} />
        <Route path='/profiles' element={<FormCreateProfile handleError={handleError} dirty={dirty} setDirty={setDirty} />} />
        <Route path='/getProfiles/:email' element={<ProfileByMail handleError={handleError} dirty={dirty} setDirty={setDirty} />} />
        <Route path='/putProfiles/:email' element={<FormModifyProfile handleError={handleError} dirty={dirty} setDirty={setDirty} />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  );
}
function ListOfRoutes() {
  const navigate = useNavigate();

  return (
    <>
      <h1 className='list_routes_title'> Available routes </h1>
      <ul>
        <li className='string_list'><Button onClick={() => navigate('/products')}>/products</Button> -&gt; list all registered products in the DB </li>
        <li className='string_list'><Button onClick={() => navigate('/products/8712725728528')}>/products/:ean</Button> -&gt; details of a specific product by ean</li>
        <li className='string_list'><Button onClick={() => navigate('/getProfiles/flongwood0@vk.com')}>/getProfiles/:email</Button> -&gt; details of a specific user profile by email</li>
        <li className='string_list'><Button onClick={() => navigate('/putProfiles/flongwood0@vk.com')}>/putProfiles/:email</Button> -&gt; edit a specific user profile </li>
        <li className='string_list'><Button onClick={() => navigate('/profiles')}>/profiles</Button> -&gt;  create a user profile </li>
      </ul>
    </>
  )
}
export default App;
