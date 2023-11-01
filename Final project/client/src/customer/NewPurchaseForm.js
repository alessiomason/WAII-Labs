import { Button, Alert, Form, Modal, Card, FloatingLabel } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API from "../API";
import './NewPurchaseForm.css';
import '../ProfileList.css';

function NewPurchaseForm(props) {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState({});

  const [dateOfPurchase, setDateOfPurchase] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [showModal, setShowModal] = useState(false);
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
      product: selectedProduct,
      dateOfPurchase: newDateOfPurchase
    }

    API.insertPurchase(purchase)
    .then(insertedPurchase => {
      props.setDirty(true);
      setSaveMsg('The purchase has been inserted.');
      navigate('/purchase/' + insertedPurchase.id);
    })
    .catch(err => {
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

  function handleModal() {
    if (selectedProduct?.ean) {
      setShowModal(false);
    }
  }

  return (
    <>
      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select a product</Modal.Title>
        </Modal.Header>
        <Modal.Header>
          <Form className='w-100'>
            <FloatingLabel controlId="floatingInput" label="Search by EAN, product name or brand" className="mb-3">
              <Form.Control type="search" value={searchText} onChange={ev => setSearchText(ev.target.value.toLowerCase())} placeholder='EAN, rpoduct name or brand' />
            </FloatingLabel>
          </Form>
        </Modal.Header>
        <Modal.Body>
          {products
            .sort((a, b) => a.ean - b.ean)
            .filter(p => p.ean.toLowerCase().includes(searchText) || p.name.toLowerCase().includes(searchText) || p.brand.toLowerCase().includes(searchText))
            .map(p => <ProductListItem product={p} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />)}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleModal}>Select product</Button>
        </Modal.Footer>
      </Modal>

      <Form onSubmit={handleSubmit} >
        {errorMsg && <Alert variant="danger" className="login_alert" onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert>}
        {saveMsg && <Alert variant="success" className="login_alert" onClose={() => setSaveMsg('')} dismissible>{saveMsg}</Alert>}
        <Container className='d-flex justify-content-center mt-5'>
          <Row className='w-70'>
            <h3 className='text-center'>New purchase</h3>
            <Form.Group controlId="formSelectProduct" className='my-2'>
              {selectedProduct ?
                <Row>
                  <Col>
                    <FloatingLabel controlId="floatingInput" label="Product">
                      <Form.Control type='text' value={selectedProduct.name + ' - ' + selectedProduct.brand} readOnly />
                    </FloatingLabel>
                  </Col>
                  <Col sm={2}><Button onClick={() => setShowModal(true)}>Select a product</Button></Col>
                </Row> :
                <Button className='w-100' onClick={() => setShowModal(true)}>Select a product</Button>}
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
            </div>
          </Row>
        </Container>
      </Form>
    </>
  );
}

function ProductListItem(props) {
  return (
    <Card
      key={props.product.ean}
      className={(props.selectedProduct?.ean === props.product?.ean) ? 'selected' : ''}
      onClick={() => props.setSelectedProduct(props.product)}>
      <Card.Body>
        <p className='grey'>EAN: {props.product.ean}</p>
        <p>{props.product.name}</p>
        <p className='grey'>Brand: {props.product.brand}</p>
      </Card.Body>
    </Card>
  );
}

export default NewPurchaseForm;