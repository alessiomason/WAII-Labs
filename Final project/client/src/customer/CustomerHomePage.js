import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../API";
import './CustomerHomePage.css';
const dayjs = require('dayjs');

function CustomerHomePage(props) {
  const [tickets, setTickets] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    API.getTickets()
      .then(tickets => setTickets(tickets))
      .catch(err => console.log(err))

    API.getPurchases()
      .then(purchases => setPurchases(purchases))
      .catch(err => console.log(err))
  }, [])

  return (
    <>
      <Row>
        <Col className='section'>
          <Row><h1>Welcome, {props.name}!</h1></Row>
          <Row><h3>Open tickets</h3></Row>
          <Row>
            <TicketsList openTicketsList tickets={tickets.filter(ticket => ticket.ticketStatus !== 'CLOSED' && ticket.ticketStatus !== 'RESOLVED')} />
          </Row>
        </Col>
      </Row>

      <Row>
        <Col className='section'>
          <Row>
            <Col><h3>Closed tickets</h3></Col>
            <Col className="d-flex justify-content-end"><Button onClick={() => navigate('/new-ticket')}>Create new ticket</Button></Col>
          </Row>
          <Row>
            <TicketsList tickets={tickets.filter(ticket => ticket.ticketStatus === 'CLOSED' || ticket.ticketStatus === 'RESOLVED')} />
          </Row>
        </Col>
        <Col className='section'>
          <Row>
            <Col><h3>Purchases</h3></Col>
            <Col className="d-flex justify-content-end"><Button onClick={() => navigate('/new-purchase')}>Insert new purchase</Button></Col>
          </Row>
          <Row>
            <PurchasesList purchases={purchases} />
          </Row>
        </Col>
      </Row>
    </>
  );
}

function TicketsList(props) {
  return (
    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Product</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.tickets.map((ticket, i) => {
          return (<TicketsListItem key={ticket.id} i={i} ticket={ticket} openTicketsList={props.openTicketsList} />);
        })}
      </tbody>
    </Table>
  );
}

function TicketsListItem(props) {
  const navigate = useNavigate();
  
  return (
    <tr>
      <td>{props.i + 1}</td>
      <td>{props.ticket.title}</td>
      <td>{props.ticket.purchase.product.name}</td>
      <td>{props.ticket.ticketStatus}</td>
      <td className='d-flex justify-content-end'>
        <Button variant='outline-primary' onClick={() => navigate(`/ticket/${props.ticket.id}`)}>{props.openTicketsList ? 'Manage and chat' : 'See more'}</Button>
      </td>
    </tr>
  );
}

function PurchasesList(props) {
  return (
    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th>Product</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {props.purchases.map((purchase, i) => {
          return (<PurchasesListItem key={purchase.id} i={i} purchase={purchase} />);
        })}
      </tbody>
    </Table>
  );
}

function PurchasesListItem(props) {
  return (
    <tr>
      <td>{props.i + 1}</td>
      <td>{props.purchase.product.name}</td>
      <td>{dayjs(props.purchase.dateOfPurchase).format('YYYY/MM/DD')}</td>
      <td>{props.purchase.status}</td>
    </tr>
  );
}

export default CustomerHomePage;