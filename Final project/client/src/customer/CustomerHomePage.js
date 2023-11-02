import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TicketsList from "./TicketsList";
import CustomBadge from "../CustomBadge";
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
    props.setDirty(false);
  }, [props.dirty])

  return (
    <>
      <Row>
        <Col className='section'>
          <Row><h1>Welcome, {props.name}!</h1></Row>
          <Row><h3>Open tickets</h3></Row>
          <Row>
            <TicketsList tickets={tickets.filter(ticket => ticket.ticketStatus !== 'CLOSED' && ticket.ticketStatus !== 'RESOLVED')} />
          </Row>
        </Col>
      </Row>

      <Row>
        <Col className='section'>
          <Row>
            <Col><h3>Closed tickets</h3></Col>
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
        {props.purchases.sort((a, b) => ('' + b.dateOfPurchase).localeCompare(a.dateOfPurchase)).map((purchase, i) => {
          return (<PurchasesListItem key={purchase.id} i={i} purchase={purchase} />);
        })}
      </tbody>
    </Table>
  );
}

function PurchasesListItem(props) {
  const navigate = useNavigate();

  return (
    <tr onClick={() => navigate(`/purchase/${props.purchase.id}`)}>
      <td>{props.i + 1}</td>
      <td>{props.purchase.product.name}</td>
      <td>{dayjs(props.purchase.dateOfPurchase).format('YYYY/MM/DD')}</td>
      <td><CustomBadge text={props.purchase.status} /></td>
    </tr>
  );
}

export default CustomerHomePage;