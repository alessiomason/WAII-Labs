import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TicketsList from "../customer/TicketsList";
import { PersonFill, LockFill } from "react-bootstrap-icons";
import API from "../API";
import '../customer/CustomerHomePage.css';

function ManagerHomePage(props) {
  const [tickets, setTickets] = useState([]);
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    API.getTickets()
      .then(tickets => setTickets(tickets))
      .catch(err => console.log(err))

    API.getExperts()
      .then(experts => setExperts(experts))
      .catch(err => console.log(err))
  }, [])

  return (
    <>
      <Row>
        <Col className='section'>
          <Row><h1>Welcome, {props.name}!</h1></Row>
        </Col>
      </Row>

      <Row>
        <Col className='section'>
          <Row>
            <h3>Open tickets</h3>
          </Row>
          <Row>
            <TicketsList tickets={tickets.filter(ticket => ticket.ticketStatus !== 'CLOSED' && ticket.ticketStatus !== 'RESOLVED')} role="manager" />
          </Row>
        </Col>
        <Col className='section'>
          <Row>
            <h3>Experts</h3>
          </Row>
          <Row>
            <ExpertsList experts={experts} />
          </Row>
        </Col>
      </Row>
    </>
  );
}

function ExpertsList(props) {
  return (
    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th></th>
          <th>Name</th>
          <th className="text-end">Assigned tickets</th>
        </tr>
      </thead>
      <tbody>
        {props.experts.map((expert, i) => {
          return (<ExpertsListItem key={expert.id} i={i} expert={expert} />);
        })}
      </tbody>
    </Table>
  );
}

function ExpertsListItem(props) {
  const navigate = useNavigate();

  return (
    <tr onClick={() => navigate(`/purchase/${props.purchase.id}`)}>
      <td>{props.i + 1}</td>
      <td className="text-center">{props.expert.authorized ? <PersonFill className="my-violet" /> : <LockFill className="my-red" /> }</td>
      <td>{props.expert.firstName + " " + props.expert.lastName}</td>
      <td className="text-end">{props.expert.ticketIds.length}</td>
    </tr>
  );
}

export default ManagerHomePage;