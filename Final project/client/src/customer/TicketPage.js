import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Card, Form, Modal, FloatingLabel } from 'react-bootstrap';
import TicketLogSection from '../manager/TicketLogSection';
import CustomBadge from '../CustomBadge';
import './TicketPage.css';
import API from '../API';
const dayjs = require('dayjs');

function TicketPage(props) {
  let { ticketId } = useParams();
  ticketId = parseInt(ticketId);
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({});
  const [dirty, setDirty] = useState(true);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showExpertsModal, setShowExpertsModal] = useState(false);
  const [experts, setExperts] = useState(null);
  const [expertId, setExpertId] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [statusChangePermitted, setStatusChangePermitted] = useState([])
  const [ticketStatus, setTicketStatus] = useState(null);
  const [ticketPriority, setTicketPriority] = useState('NORMAL');

  const TicketStatus = {
    OPEN: 'OPEN',
    IN_PROGRESS: 'IN_PROGRESS',
    CLOSED: 'CLOSED',
    REOPENED: 'REOPENED',
    RESOLVED: 'RESOLVED',
  };

  const ticketPriorities = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'];

  useEffect(() => {
    if (dirty) {
      API.getTicketById(ticketId)
        .then(ticket => {
          setTicket(ticket);
          switch (ticket.ticketStatus) {
            case TicketStatus.OPEN:
              setStatusChangePermitted([TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.CLOSED, TicketStatus.RESOLVED])
              break;
            case TicketStatus.CLOSED:
              setStatusChangePermitted([TicketStatus.CLOSED, TicketStatus.REOPENED])
              break;
            case TicketStatus.IN_PROGRESS:
              setStatusChangePermitted([TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.CLOSED, TicketStatus.RESOLVED])
              break;
            case TicketStatus.REOPENED:
              setStatusChangePermitted([TicketStatus.IN_PROGRESS, TicketStatus.CLOSED, TicketStatus.RESOLVED, TicketStatus.REOPENED])
              break;
            case TicketStatus.RESOLVED:
              setStatusChangePermitted([TicketStatus.CLOSED, TicketStatus.RESOLVED, TicketStatus.REOPENED])
              break;
            default:
              setStatusChangePermitted([]);
              break;
          }
          setTicketStatus(ticket.ticketStatus);
          setTicketPriority(ticket.priorityLevel);
          setExpertId(ticket.expert?.id);
          setSelectedExpert(ticket.expert);
          setDirty(false);

          API.getExperts()
            .then(experts => setExperts(experts.filter(e => e.authorized)))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }
  }, [ticketId, dirty])

  useEffect(() => {
    if (!dirty && ticket.chat) {
      const intervalId = setInterval(() => {
        if (!showTicketModal && !showExpertsModal && ticket.ticketStatus !== 'CLOSED' && ticket.ticketStatus !== 'RESOLVED') {
          setDirty(true);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [ticket.chat, showTicketModal, showExpertsModal])

  function editTicketProperties() {
    let newTicket = ticket;
    newTicket.ticketStatus = ticketStatus ? ticketStatus : statusChangePermitted[0];
    newTicket.priorityLevel = ticketPriority;

    API.editTicket(newTicket).then(() => {
      setShowExpertsModal(false);
      props.setDirty(true);
      setDirty(true);
    }).catch(err => console.log(err))
    setShowTicketModal(false);
  }

  function confirmExpert() {
    API.assignExpert(ticket, selectedExpert)
      .then(() => {
        setShowExpertsModal(false);
        props.setDirty(true);
        setDirty(true);
      }).catch(err => console.log(err))
  }

  function numberizePriority(priorityLevel) {
    switch (priorityLevel) {
      case "LOW":
        return 1;
      case "NORMAL":
        return 2;
      case "HIGH":
        return 3;
      case "CRITICAL":
        return 4;
      default:
        return 0;
    }
  }

  return (
    <>
      <Modal show={showTicketModal} onHide={() => setShowTicketModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit ticket properties</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel controlId="floatingSelect" label="Change ticket status to:">
              <Form.Select value={ticketStatus} onChange={ev => setTicketStatus(ev.target.value)}>
                {statusChangePermitted.length > 0 ? statusChangePermitted.map((item) =>
                  <option key={item} value={item}>{item}</option>
                ) : <option></option>}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect" label="Change ticket priority to:">
              <Form.Select value={ticketPriority} onChange={ev => setTicketPriority(ev.target.value)}>
                {ticketPriorities.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={editTicketProperties}>Edit ticket properties</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showExpertsModal} onHide={() => setShowExpertsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Choose expert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel controlId="floatingSelect" label="Choose expert">
              <Form.Select value={expertId} onChange={e => { setExpertId(e.target.value); setSelectedExpert(experts.filter(expert => expert.id === e.target.value)[0]) }}>
                {experts && experts.map((expert) =>
                  <option key={expert.id} value={expert.id}>
                    {expert.firstName + " " + expert.lastName + " - "}
                    {expert.specializations.map(s => s.name).join(" | ")}
                  </option>
                )}
                <option key='no-expert' value={null}>Assign no expert</option>
              </Form.Select>
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={confirmExpert}>Confirm expert</Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col className='section'>
          <Row className='bottom-border'>
            <Col><h1 className='with-side-button'>{ticket.title}</h1></Col>
            <Col className='d-flex justify-content-end'>
              <Button onClick={() => navigate('/purchase/' + ticket.purchase?.id)}>View purchase</Button>
              {ticket.ticketStatus && props.role !== 'customer' && <Button onClick={() => setShowTicketModal(true)}>Edit ticket properties</Button>}
              {(ticket.ticketStatus === 'OPEN' || ticket.ticketStatus === 'REOPENED') && props.role === 'manager' && <Button onClick={() => setShowExpertsModal(true)}>{ticket.expert ? 'Change assigned expert' : 'Assign expert'}</Button>}
            </Col>
          </Row>
          <Row>
            <Col xs={3} className='header-column'><h5 className='text-end'>Ticket description</h5></Col>
            <Col><p>{ticket.description}</p></Col>
          </Row>
          <Row>
            <Col xs={3} className='header-column'><h5 className='text-end'>Ticket status</h5></Col>
            <Col><p><CustomBadge text={ticket.ticketStatus} /></p></Col>
          </Row>
          <Row>
            <Col xs={3} className='header-column'><h5 className='text-end'>Ticket priority</h5></Col>
            <Col><p><CustomBadge text={([...Array(numberizePriority(ticket.priorityLevel))].map((_) => '!')).join('') + ' ' + ticket.priorityLevel} /></p></Col>
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
            <Col><p>{(ticket.purchase?.warranty?.expiryDate && dayjs(ticket.purchase.warranty?.expiryDate).format('YYYY/MM/DD'))
              ?? dayjs(ticket.purchase?.dateOfPurchase).add(2, 'years').format('YYYY/MM/DD')}</p></Col>
          </Row>

          <Row>
            <ChatSection ticketId={ticket.id} ticketStatus={ticket.ticketStatus} chat={ticket.chat} userId={props.userId} email={props.email} setDirty={setDirty} />
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
        <Col><h2>Chat{(props.chat?.closed || (props.chat && (props.ticketStatus === 'CLOSED' || props.ticketStatus === 'RESOLVED'))) && ' (closed)'}</h2></Col>
        <Col className='d-flex justify-content-end'>{!props.chat && props.ticketStatus !== 'CLOSED' && !props.ticketStatus !== 'RESOLVED' && <Button onClick={openChat}>Open new chat</Button>}</Col>
      </Row>

      <Row className='messages-section'>
        {props.chat?.messages.map(message => <MessageBox key={message.id} message={message} userId={props.userId} email={props.email} />)}
        {props.chat && !props.chat.closed && props.ticketStatus !== 'CLOSED' && props.ticketStatus !== 'RESOLVED' && <SendMessageBox ticketId={props.ticketId} setDirty={props.setDirty} />}
      </Row>
    </>
  );
}

function MessageBox(props) {
  function messageSent() {
    return props.message.from.id === props.userId;
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