import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import './TicketPage.css';
import API from '../API';
const dayjs = require('dayjs');

function TicketPage() {
  let { ticketId } = useParams();
  ticketId = parseInt(ticketId);
  const [ticket, setTicket] = useState({});

  useEffect(() => {
    API.getTicketById(ticketId)
      .then(ticket => setTicket(ticket))
      .catch(err => console.log(err))
  }, [])

  return (
    <Row>
      <Col className='section'>
        <Row><h1>{ticket.title}</h1></Row>
        <Row>
          <Col sm={3} className='header-column'><h5 className='text-end'>Ticket description</h5></Col>
          <Col><p>{ticket.description}</p></Col>
        </Row>
        <Row>
          <Col sm={3} className='header-column'><h5 className='text-end'>Ticket status</h5></Col>
          <Col><p>{ticket.ticketStatus}</p></Col>
        </Row>
        <Row>
          <Col sm={3} className='header-column'><h5 className='text-end'>Expert</h5></Col>
          <Col><p>{`${ticket.expert?.firstName} ${ticket.expert?.lastName}`}</p></Col>
        </Row>
        <Row>
          <Col sm={3} className='header-column'><h5 className='text-end'>Product name</h5></Col>
          <Col><p>{ticket.purchase?.product.name}</p></Col>
        </Row>
        <Row>
          <Col sm={3} className='header-column'><h5 className='text-end'>Product brand</h5></Col>
          <Col><p>{ticket.purchase?.product.brand}</p></Col>
        </Row>
        <Row>
          <Col sm={3} className='header-column'><h5 className='text-end'>Date of purchase</h5></Col>
          <Col><p>{ticket.purchase?.dateOfPurchase && dayjs(ticket.purchase?.dateOfPurchase).format('YYYY/MM/DD')}</p></Col>
        </Row>
        <Row>
          <Col sm={3} className='header-column'><h5 className='text-end'>Covered by warranty</h5></Col>
          <Col><p>{ticket.purchase?.coveredByWarranty ? 'Yes' : 'No'}</p></Col>
        </Row>
        <Row>
          <Col sm={3} className='header-column'><h5 className='text-end'>Warranty expiry date</h5></Col>
          <Col><p>{(ticket.purchase?.warranty?.expiryDate ?? ticket.purchase?.dateOfPurchase) &&
          dayjs(ticket.purchase?.warranty?.expiryDate ?? ticket.purchase?.dateOfPurchase).format('YYYY/MM/DD')}</p></Col>
        </Row>
      </Col>
    </Row>
  );
}

export default TicketPage;