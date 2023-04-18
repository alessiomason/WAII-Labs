import logo from './logo.svg';
import './App.css';
import API from './API'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import {Button, Col, Row} from "react-bootstrap";

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

    useEffect(() => {
        API.getProducts()
            .then((p) => { setProducts(p); setDirty(false); console.log(p)})
            .catch(err => handleError(err));
    }, [dirty]);


  return (
      <>
          <Routes>
          <Route path='/ciao' element={<ListaRoute/>}/>
            {/*<Route path='/products' element={}/>*/}
            {/*<Route path='/products/:id' element={}/>
            {/*<Route path='/profiles' element={}/>*/}
            {/*<Route path='/getProfiles/:email' element={}/>*/}
            {/*<Route path='/putProfiles/:email' element={}/> </>*/}
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
