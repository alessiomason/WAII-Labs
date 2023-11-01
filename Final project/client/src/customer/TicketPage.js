import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Card, Form, Modal, FloatingLabel } from 'react-bootstrap';
import TicketLogSection from '../manager/TicketLogSection';
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
  const [showModalExperts, setShowModalExperts] = useState(false);
  const [experts, setExperts] = useState(null);
  const [expertId, setExpertId] = useState();
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [statusChangePermitted, setStatusChangePermitted] = useState([])
  const [ticketStatus, setTicketStatus] = useState(null);

  const TicketStatus = {
    OPEN: 'OPEN',
    IN_PROGRESS: 'IN_PROGRESS',
    CLOSED: 'CLOSED',
    REOPENED: 'REOPENED',
    RESOLVED: 'RESOLVED',
  };

  useEffect(() => {
    if (dirty) {
      API.getTicketById(ticketId)
        .then(ticket => {
          setTicket(ticket);
          setDirty(false);
          switch (ticket.ticketStatus) {
            case TicketStatus.OPEN:
              setStatusChangePermitted([TicketStatus.IN_PROGRESS, TicketStatus.CLOSED, TicketStatus.RESOLVED])
              break;
            case TicketStatus.CLOSED:
              setStatusChangePermitted([TicketStatus.REOPENED])
              break;
            case TicketStatus.IN_PROGRESS:
              setStatusChangePermitted([TicketStatus.CLOSED, TicketStatus.OPEN, TicketStatus.RESOLVED])
              break;
            case TicketStatus.REOPENED:
              setStatusChangePermitted([TicketStatus.CLOSED, TicketStatus.RESOLVED, TicketStatus.IN_PROGRESS])
              break;
            case TicketStatus.RESOLVED:
              setStatusChangePermitted([TicketStatus.CLOSED, TicketStatus.REOPENED])
              break;
          }
          API.getExperts()
            .then(experts => {
              setExperts(experts);
            }
            )
            .catch(err => console.log(err))
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

  function changeTicketStatus() {
    let newTicket = ticket;
    newTicket.ticketStatus = ticketStatus ? ticketStatus : statusChangePermitted[0];
    API.editTicket(newTicket).then(() => {
      setShowModalExperts(false);
      props.setDirty(true);
      setDirty(true);
    }).catch(err => console.log(err))
    setShowModal(false);
  }

  function confirmExpert() {
    let obj = selectedExpert
    if (obj == null) {
      obj = experts[0]
      setSelectedExpert(experts[0])
    }
    API.assignExpert(ticket, obj)
      .then(() => {
        setShowModalExperts(false);
        props.setDirty(true);
        setDirty(true);
      }).catch(err => console.log(err))
  }

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change ticket status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel controlId="floatingSelect" label="Mark the ticket as:">
              <Form.Select onChange={ev => { setTicketStatus(ev.target.value) }}>
                {statusChangePermitted ? statusChangePermitted.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                )) : null}
              </Form.Select>
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={changeTicketStatus}>Change ticket status</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModalExperts} onHide={() => setShowModalExperts(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Choose expert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel controlId="floatingSelect" label="Choose expert">
              <Form.Select value={expertId} onChange={e => { setExpertId(e.target.value); setSelectedExpert(experts.filter(expert => expert.id === e.target.value)[0]) }}>
                {experts ? experts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.firstName + " " + item.lastName}
                    {item.specializations.length !== 0 && (
                      item.specializations.map((specialization, specIndex) => (
                        <span key={specIndex}>{" | " + specialization.name}</span>
                      )))
                    }
                  </option>
                )) : null}
              </Form.Select>
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => confirmExpert()}>Confirm expert</Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col className='section'>
          <Row className='bottom-border'>
            <Col><h1 className='with-side-button'>{ticket.title}</h1></Col>
            <Col className='d-flex justify-content-end'>
              <Button onClick={() => navigate('/purchase/' + ticket.purchase?.id)}>View purchase</Button>
              {ticket.ticketStatus && props.role === 'expert' && <Button onClick={() => setShowModal(true)}>Change ticket status</Button>}
              {!ticket.expert && props.role === 'manager' && <Button onClick={() => setShowModalExperts(true)}>Assign expert</Button>}
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
            <Col><p>{ticket.expert ? `${ticket.expert?.firstName} ${ticket.expert?.lastName}` : "Not assigned yet"}</p></Col>
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

          <Row>
            {props.role === 'manager' && <TicketLogSection ticketId={ticketId} />}
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