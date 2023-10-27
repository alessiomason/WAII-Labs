import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Card, Form, Modal, FloatingLabel } from 'react-bootstrap';
import './TicketPage.css';
import API from '../API';
const dayjs = require('dayjs');

function TicketPage(props) {
  let { ticketId } = useParams();
  ticketId = parseInt(ticketId);
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({});
  const [dirty, setDirty] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (dirty) {
      API.getTicketById(ticketId)
        .then(ticket => {
          setTicket(ticket);
          setDirty(false);
        })
        .catch(err => console.log(err))
    }
  }, [ticketId, dirty])

  useEffect(() => {
    if (!dirty && ticket.chat) {
      const intervalId = setInterval(() => {
        setDirty(true);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [dirty])

  function closeTicket() {

    setShowModal(false);
  }

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Close ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel controlId="floatingSelect" label="Mark the ticket as:">
              <Form.Select>
                <option value="CLOSED">CLOSED</option>
                <option value="RESOLVED">RESOLVED</option>
              </Form.Select>
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeTicket}>Close ticket</Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col className='section'>
          <Row className='bottom-border'>
            <Col><h1 className='ticket-page'>{ticket.title}</h1></Col>
            <Col className='d-flex justify-content-end'>
              <Button onClick={() => navigate('/purchase/' + ticket.purchase?.id)}>View purchase</Button>
              {ticket.ticketStatus && props.role !== 'customer' && <Button onClick={() => setShowModal(true)}>Close ticket</Button>}
              </Col>
          </Row>
          <Row>
            <Col xs={3} className='header-column'><h5 className='text-end'>Ticket description</h5></Col>
            <Col><p>{ticket.description}</p></Col>
          </Row>
          <Row>
            <Col xs={3} className='header-column'><h5 className='text-end'>Ticket status</h5></Col>
            <Col><p>{ticket.ticketStatus}</p></Col>
          </Row>
          <Row>
            <Col xs={3} className='header-column'><h5 className='text-end'>Expert</h5></Col>
            <Col><p>{`${ticket.expert?.firstName} ${ticket.expert?.lastName}`}</p></Col>
          </Row>
          <Row>
            <Col xs={3} className='header-column'><h5 className='text-end'>Product name</h5></Col>
            <Col><p>{ticket.purchase?.product.name}</p></Col>
          </Row>
          <Row>
            <Col xs={3} className='header-column'><h5 className='text-end'>Product brand</h5></Col>
            <Col><p>{ticket.purchase?.product.brand}</p></Col>
          </Row>
          <Row>
            <Col xs={3} className='header-column'><h5 className='text-end'>Date of purchase</h5></Col>
            <Col><p>{ticket.purchase?.dateOfPurchase && dayjs(ticket.purchase?.dateOfPurchase).format('YYYY/MM/DD')}</p></Col>
          </Row>
          <Row>
            <Col xs={3} className='header-column'><h5 className='text-end'>Covered by warranty</h5></Col>
            <Col><p>{ticket.purchase?.coveredByWarranty ? 'Yes' : 'No'}</p></Col>
          </Row>
          <Row>
            <Col xs={3} className='header-column'><h5 className='text-end'>Warranty expiry date</h5></Col>
            <Col><p>{(ticket.purchase?.warranty?.expiryDate ?? ticket.purchase?.dateOfPurchase) &&
              dayjs(ticket.purchase?.warranty?.expiryDate ?? ticket.purchase?.dateOfPurchase).format('YYYY/MM/DD')}</p></Col>
          </Row>

          <Row>
            <ChatSection ticketId={ticket.id} chat={ticket.chat} email={props.email} setDirty={setDirty} />
          </Row>
        </Col>
      </Row>
    </>
  );
}

function ChatSection(props) {
  function openChat() {
    API.createChat(props.ticketId)
      .then(() => props.setDirty(true))
      .catch(err => console.log(err))
  }

  return (
    <>
      <Row className='bottom-border'>
        <Col><h2>Chat{props.chat?.closed && ' (closed)'}</h2></Col>
        <Col className='d-flex justify-content-end'>{!props.chat && <Button onClick={openChat}>Open new chat</Button>}</Col>
      </Row>

      <Row className='messages-section'>
        {props.chat?.messages.map(message => <MessageBox key={message.id} message={message} email={props.email} />)}
        {props.chat && <SendMessageBox ticketId={props.ticketId} setDirty={props.setDirty} />}
      </Row>
    </>
  );
}

function MessageBox(props) {
  function messageSent() {
    return props.message.from.id === props.email;
  }

  return (
    <Row className={'d-flex ' + (messageSent() ? 'justify-content-end' : '')}>
      <Card className={messageSent() ? 'sender-card' : ''}>
        <Card.Header className={messageSent() ? 'sender-header' : 'receiver-header'}>{props.message.from.firstName + ' ' + props.message.from.lastName}</Card.Header>
        <Card.Body>{props.message.text}</Card.Body>
        <Card.Footer>{dayjs(props.message.time).format('YYYY/MM/DD HH:mm')}</Card.Footer>
      </Card>
    </Row>
  );
}

function SendMessageBox(props) {
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    API.sendMessage(props.ticketId, text)
      .then(() => {
        props.setDirty(true);
        setText('');
      })
      .catch(err => console.log(err))
  }

  return (
    <Form onSubmit={handleSubmit} className='send-message-box'>
      <Row><h3 className='new-message-title'>Send a new message</h3></Row>
      <Row><Form.Control as='textarea' rows={5} value={text} onChange={ev => setText(ev.target.value)} placeholder='Enter your text here...' /></Row>
      <Row className='d-flex justify-content-end'><Button className='send-message-btn gradient-custom' type='submit'>Send message</Button></Row>
    </Form>
  );
}

export default TicketPage;