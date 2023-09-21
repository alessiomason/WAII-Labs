import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Button, Card, Form } from 'react-bootstrap';
import './TicketPage.css';
import API from '../API';
const dayjs = require('dayjs');

function TicketPage(props) {
  let { ticketId } = useParams();
  ticketId = parseInt(ticketId);
  const [ticket, setTicket] = useState({});

  useEffect(() => {
    API.getTicketById(ticketId)
      .then(ticket => setTicket(ticket))
      .catch(err => console.log(err))
  }, [ticketId])

  return (
    <Row>
      <Col className='section'>
        <Row><h1>{ticket.title}</h1></Row>
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
          <ChatSection ticketId={ticket.id} chat={ticket.chat} email={props.email} />
        </Row>
      </Col>
    </Row>
  );
}

function ChatSection(props) {
  return (
    <>
      <Row className='bottom-border'>
        <Col><h2>Chat{props.chat?.closed && ' (closed)'}</h2></Col>
        <Col className='d-flex justify-content-end'>{!props.chat && <Button>Open new chat</Button>}</Col>
      </Row>

      <Row className='messages-section'>
        {props.chat?.messages.map(message => <MessageBox key={message.id} message={message} email={props.email} />)}
        <SendMessageBox ticketId={props.ticketId} />
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
      // .then(() => props.setDirty(true))
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