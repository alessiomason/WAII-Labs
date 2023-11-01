import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import TicketsList from './TicketsList';
import './PurchasePage.css';
import './TicketPage.css';
import API from '../API';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const dayjs = require('dayjs');

function PurchasePage(props) {
  let { purchaseId } = useParams();
  purchaseId = parseInt(purchaseId);
  const [purchase, setPurchase] = useState({});
  const [tickets, setTickets] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [dateOfPurchase, setDateOfPurchase] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(0);
  const [statusChangePermitted, setStatusChangePermitted] = useState([]);
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

  function changePurchaseStatus() {
    const newPurchaseStatus = purchaseStatus ? purchaseStatus : "0";
    API.editPurchase(purchaseId, newPurchaseStatus).then(() => {
      setShowModal(false);
      setDirty(true);
      props.setDirty(true);
    }).catch(err => console.log(err))
    setShowModal(false);
  }

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change purchase status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel controlId="floatingSelect" label="Mark the purchase as:">
              <Form.Select onChange={ev => { setPurchaseStatus(ev.target.value) }}>
                <option key="0" value="0">PREPARING</option>
                <option key="1" value="1">SHIPPED</option>
                <option key="2" value="2">DELIVERED</option>
                <option key="3" value="3">WITHDRAWN</option>
                <option key="4" value="4">REFUSED</option>
                <option key="5" value="5">REPLACED</option>
                <option key="6" value="6">REPAIRED</option>
              </Form.Select>
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={changePurchaseStatus}>Change purchase status</Button>
        </Modal.Footer>
      </Modal>
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
              {purchase.status && props.role === "expert" && <Button onClick={() => setShowModal(true)}>Change purchase status</Button>}
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