import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import TicketsList from './TicketsList';
import './PurchasePage.css';
import './TicketPage.css';
import API from '../API';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const dayjs = require('dayjs');

function PurchasePage() {
  let { purchaseId } = useParams();
  purchaseId = parseInt(purchaseId);
  const [purchase, setPurchase] = useState({});
  const [tickets, setTickets] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [dateOfPurchase, setDateOfPurchase] = useState('');
  const navigate = useNavigate();

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

  useEffect(() => {
    purchase.ticketIds?.forEach(ticketId => {
      API.getTicketById(ticketId)
        .then(ticket => {
          setTickets(tickets => {
            return tickets.concat(ticket)
          })
        })
        .catch(err => console.log(err))
    });
  }, [purchase.id])

  function addWarranty() {
    API.addWarranty(purchase.id, dayjs(dateOfPurchase).format('YYYY-MM-DD'))
      .then(() => {
        setDirty(true);
        setShowWarrantyModal(false);
      })
      .catch(err => console.log(err))
  }

  return (
    <>
      <Modal show={showWarrantyModal} onHide={() => setShowWarrantyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add additional warranty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addWarranty}>Add warranty</Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col className='section'>
          <Row className='bottom-border'>
            <Col><h1 className='with-side-button'>{purchase.product?.name}</h1></Col>
            <Col className='d-flex justify-content-end'>
              {!purchase.warranty && <Button onClick={() => setShowWarrantyModal(true)}>Add additional warranty</Button>}
            </Col>
          </Row>
          <Row>
            <Col xs={3} className='header-column'><h5 className='text-end'>Product brand</h5></Col>
            <Col><p>{purchase.product?.brand}</p></Col>
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
            <Col xs={3} className='header-column'><h5 className='text-end'>Additional warranty</h5></Col>
            <Col><p>{purchase.warranty ? 'Yes' : 'No'}</p></Col>
          </Row>
          <Row>
            <Col xs={3} className='header-column'><h5 className='text-end'>Warranty expiry date</h5></Col>
            <Col><p>{(purchase.warranty?.expiryDate && dayjs(purchase.warranty?.expiryDate).format('YYYY/MM/DD'))
              ?? dayjs(purchase.dateOfPurchase).add(2, 'years').format('YYYY/MM/DD')}</p></Col>
          </Row>

          <Row>
            <Row className='bottom-border'>
              <Col><h2>Tickets associated to this purchase</h2></Col>
              <Col className='d-flex justify-content-end'><Button onClick={() => navigate(`/new-ticket/${purchaseId}`)}>Open new ticket</Button></Col>
            </Row>

            {tickets.length !== 0 && <TicketsList tickets={tickets} />}
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default PurchasePage;