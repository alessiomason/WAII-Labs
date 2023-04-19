import './App.css';
import API from './API'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button, Col, Row } from "react-bootstrap";
import { ProductList } from "./ProductList";
import { ProductById } from "./ProductById";
import { ProfileByMail } from "./ProfileByMail";
import { FormModifyProfile } from "./FormModifyProfile";
import {FormCreateProfile} from "./FormCreateProfile";

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
        <Route path='*' element={<Navigate to='/' />}/>
      </Routes>
    </>
  );
}
function ListOfRoutes() {
  return (
    <>
      <h1 className='list_routes_title'> Available routes </h1>
      <ul>
        <li className='string_list'> /products -> list all registered products in the DB </li>
        <li className='string_list'> /products/:ean -> details of a specific product by ean</li>
        <li className='string_list'> /getProfiles/:email -> details of a specific user profile by email</li>
        <li className='string_list'> /putProfiles/:email -> edit a specific user profile </li>
        <li className='string_list'> /profiles ->  create a user profile </li>
      </ul>
    </>
  )
}
export default App;
