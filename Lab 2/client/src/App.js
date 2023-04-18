import logo from './logo.svg';
import './App.css';
import API from './API'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import {Button, Col, Row} from "react-bootstrap";
import {ProductList} from "./ProductList";
import {ProductById} from "./ProductById";
import {ProfileByMail} from "./ProfileByMail";
import {FormModifyProfile} from "./FormModifyProfile";

function App() {
  <Router>
    <App2 />
  </Router>
}
function App2() {

    const [products, setProducts] = useState('');
    const [dirty, setDirty] = useState('');

    function handleError(err) {
        console.log(err);
    }

    return (
      <>
          <Routes>
          <Route path='/' element={<ListaRoute/>}/>
            <Route path='/products' element={<ProductList handleError={handleError()}/>}/>
            <Route path='/products/:id' element={<ProductById handleError={handleError()}/>}/>
            <Route path='/profiles'/>
            <Route path='/getProfiles/:email' element={<ProfileByMail handleError={handleError()}/>}/>
            <Route path='/putProfiles/:email' element={<FormModifyProfile handleError={handleError()}/>}/>
        </Routes>
      </>
  );
}
function ListaRoute()
{
    return (
    <>
        <Row>
            <Col>
                <Button>Bottone</Button>
            </Col>
        </Row>
    </>
    )
}
export default App;
