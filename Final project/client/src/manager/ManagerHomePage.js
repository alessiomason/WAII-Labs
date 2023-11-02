import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TicketsList from "../customer/TicketsList";
import { PersonFill, LockFill } from "react-bootstrap-icons";
import Loading from "../Loading";
import API from "../API";
import '../customer/CustomerHomePage.css';
import { TooltipedContent } from "../TooltipedContent";

function ManagerHomePage(props) {
  const [tickets, setTickets] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getTickets()
      .then(tickets => {
        setTickets(tickets);
        setLoading(false);
      })
      .catch(err => console.log(err))

    API.getExperts()
      .then(experts => setExperts(experts))
      .catch(err => console.log(err))
  }, [])

  if (loading)
    return (<Loading />);

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
  function compareExperts(expertA, expertB) {
    const authorizedFirst = expertB.authorized - expertA.authorized;
    if (authorizedFirst !== 0)
      return authorizedFirst;

    return `${expertA.firstName} ${expertA.lastName}`.localeCompare(`${expertB.firstName} ${expertB.lastName}`)
  }

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
        {props.experts.sort(compareExperts).map((expert, i) => {
          return (<ExpertsListItem key={expert.id} i={i} expert={expert} />);
        })}
      </tbody>
    </Table>
  );
}

function ExpertsListItem(props) {
  const navigate = useNavigate();

  return (
    <tr onClick={() => navigate(`/expert/${props.expert.id}`)}>
      <td>{props.i + 1}</td>
      <td className="text-center">
        <TooltipedContent text={props.expert.authorized ? 'Authorized' : 'Unauthorized'} id={props.expert.id}>
          {props.expert.authorized ? <PersonFill className="my-violet" /> : <LockFill className="my-red" />}
        </TooltipedContent>
      </td>
      <td>{props.expert.firstName + " " + props.expert.lastName}</td>
      <td className="text-end">{props.expert.ticketIds.length}</td>
    </tr>
  );
}

export default ManagerHomePage;