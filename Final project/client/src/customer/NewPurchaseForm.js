import {Button, Alert, Form, Table, FormControl} from 'react-bootstrap';
import { Container, Row } from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API from "../API";
import '../ProfileList.css'

function NewPurchaseForm(props) {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName,setLastName]=useState("");
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState({});

  const [status, setStatus] = useState(0);
  const [dateOfPurchase, setDateOfPurchase] = useState();
  const [productEAN, setProductEAN] = useState();
  const [product, setProduct] = useState();
  const [products, setProducts] = useState([]);

  const [errorMsg, setErrorMsg] = useState('');
  const [saveMsg, setSaveMsg] = useState('');


  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const originalDate = new Date(dateOfPurchase);
    originalDate.setUTCDate(originalDate.getUTCDate() + 1);
    originalDate.setUTCHours(0, 0, 0, 0);

    const newDateOfPurchase = originalDate.toISOString();

    const purchase = {
        customer: customer,
        product: product,
        status: 0,
        dateOfPurchase: newDateOfPurchase
    }

    API.insertPurchase(purchase).then( () => {
      props.setDirty(true);
      setSaveMsg('The purchase has been inserted.')
    }).catch(err => {
      props.handleError(err);
      setSaveMsg('Error during the insertion of the purchase.')
    });

  }

  useEffect(() => {
      API.getProfileByEmail(props.email)
        .then((p) => {
          setId(p.id);
          setEmail(props.email)
          setFirstName(p.firstName);
          setLastName(p.lastName);
          setPhone(p.phone);
          setErrorMsg('');
        }).catch(err => props.handleError(err));
      API.getProducts()
        .then((p) => {
          setProducts(p);
          setErrorMsg('');
        }).catch(err => props.handleError(err));
      const profile = {
        id: id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone
      }
      setCustomer(profile);
      props.setDirty(false);
  }, [email, props, props.dirty]);

  return (
    <>
      <Form onSubmit={handleSubmit} >
        {errorMsg && <Alert variant="danger" className="login_alert" onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert>}
        {saveMsg && <Alert variant="success" className="login_alert" onClose={() => setSaveMsg('')} dismissible>{saveMsg}</Alert>}
        <Container className='d-flex justify-content-center mt-5'>
          <Row className='w-50'>
            <h3 className='text-center'>New Purchase</h3>
            <Form.Group controlId="formSelectProduct" className='my-2'>
              <Form.Select className="my-3" aria-label="Select a product" value={productEAN} onChange={e => { setProductEAN(e.target.value); setProduct(products.filter(product => product.ean === e.target.value)[0])} } required={true} >
                <option disabled key={'Select a product'}>Select a product</option>
                {[...products].sort((a, b) => a.ean - b.ean).map(p => <option key={p.ean} value={p.ean}>{p.ean + ' - ' + p.name + ' - ' + p.brand}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formSelezionaData">
              <DatePicker
                selected={dateOfPurchase}
                onChange={date => setDateOfPurchase(date)}
                dateFormat="yyyy/MM/dd"
                isClearable
                placeholderText="Choose a date"
                className="form-control"
                required
              />
            </Form.Group>
            <div className="text-center mt-3 pt-1 pb-1">
              <Button className="w-50 gradient-custom" type="submit">Insert purchase</Button>
              <Button className="w-50 gradient-custom" onClick={() => navigate('/')}>Back</Button>
            </div>
          </Row>
        </Container>
      </Form>
    </>
  );
}

export default NewPurchaseForm;