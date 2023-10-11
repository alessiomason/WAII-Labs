import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Button, Card, Form } from 'react-bootstrap';
import './TicketPage.css';
import API from '../API';
const dayjs = require('dayjs');

function PurchasePage() {
  let { purchaseId } = useParams();
  purchaseId = parseInt(purchaseId);
  const [purchase, setPurchase] = useState({});
  const [dirty, setDirty] = useState(true);

  useEffect(() => {
    if (dirty) {
      API.getPurchaseById(purchaseId)
        .then(purchase => {
          setPurchase(purchase);
          setDirty(false);
        })
        .catch(err => console.log(err))
    }
  }, [purchaseId, dirty])

	return (
    <Row>
      <Col className='section'>
        <Row><h1>{purchase.product.name}</h1></Row>
        <Row>
          <Col xs={3} className='header-column'><h5 className='text-end'>Product brand</h5></Col>
          <Col><p>{purchase.product.brand}</p></Col>
        </Row>
        <Row>
          <Col xs={3} className='header-column'><h5 className='text-end'>Purchase status</h5></Col>
          <Col><p>{purchase.status}</p></Col>
        </Row>
        <Row>
          <Col xs={3} className='header-column'><h5 className='text-end'>Date of purchase</h5></Col>
          <Col><p>{purchase.dateOfPurchase && dayjs(purchase.dateOfPurchase).format('YYYY/MM/DD')}</p></Col>
        </Row>
        <Row>
          <Col xs={3} className='header-column'><h5 className='text-end'>Covered by warranty</h5></Col>
          <Col><p>{purchase.coveredByWarranty ? 'Yes' : 'No'}</p></Col>
        </Row>
        <Row>
          <Col xs={3} className='header-column'><h5 className='text-end'>Warranty expiry date</h5></Col>
          <Col><p>{(purchase.warranty?.expiryDate ?? purchase.dateOfPurchase) &&
            dayjs(purchase.warranty?.expiryDate ?? purchase.dateOfPurchase).format('YYYY/MM/DD')}</p></Col>
        </Row>
      </Col>
    </Row>
	);
}

export default PurchasePage;