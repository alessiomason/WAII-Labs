import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './TicketsList.css';

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
  }
}

function compareTicketsByPriority(ticketA, ticketB) {
  const priorityA = numberizePriority(ticketA.priorityLevel);
  const priorityB = numberizePriority(ticketB.priorityLevel);

  return priorityB - priorityA;
}

function TicketsList(props) {
  return (
    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th></th>
          <th>Title</th>
          <th>Product</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {props.tickets.sort(compareTicketsByPriority).map((ticket, i) => {
          return (<TicketsListItem key={ticket.id} i={i} ticket={ticket} />);
        })}
      </tbody>
    </Table>
  );
}

function TicketsListItem(props) {
  const navigate = useNavigate();

  return (
    <tr onClick={() => navigate(`/ticket/${props.ticket.id}`)}>
      <td>{props.i + 1}</td>
      <td className="d-flex justify-content-center my-red">
        {[...Array(numberizePriority(props.ticket.priorityLevel))].map((_) => '!')}
      </td>
      <td>{props.ticket.title}</td>
      <td>{props.ticket.purchase.product.name}</td>
      <td>{props.ticket.ticketStatus}</td>
    </tr>
  );
}

export default TicketsList;