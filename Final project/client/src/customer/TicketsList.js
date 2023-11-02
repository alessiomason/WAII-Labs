import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CustomBadge from "../CustomBadge";
import { PersonCheckFill, PersonXFill } from "react-bootstrap-icons";
import { TooltipedContent, capitalize } from "../TooltipedContent";
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
    default:
      return 0;
  }
}

function compareTickets(ticketA, ticketB) {
  // sort not assigned first
  if (ticketA.expert && !ticketB.expert) {
    return 1;
  } else if (!ticketA.expert && ticketB.expert) {
    return -1;
  }

  // sort by priority
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
          <th>{props.role === "manager" ? 'Expert' : 'Status'}</th>
        </tr>
      </thead>
      <tbody>
        {props.tickets
          .sort(compareTickets)
          .map((ticket, i) => {
            return (<TicketsListItem key={ticket.id} i={i} ticket={ticket} role={props.role} />);
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
      <td className="text-center my-red">
        <TooltipedContent text={capitalize(props.ticket.priorityLevel) + ' priority ticket'} id={'priority-tooltip' + props.ticket.id}>
          {[...Array(numberizePriority(props.ticket.priorityLevel))].map((_) => '!').join('')}
        </TooltipedContent>
      </td>
      <td>{props.ticket.title}</td>
      <td>{props.ticket.purchase.product.name}</td>
      <td className={props.role === "manager" ? "text-center" : ""}>
        {props.role === "manager" ?
          (props.ticket?.expert?.id ?
            <TooltipedContent text={'Assigned expert: ' + props.ticket.expert.firstName + ' ' + props.ticket.expert.lastName} id={'expert-tooltip' + props.ticket.id}>
              <PersonCheckFill className="my-violet" />
            </TooltipedContent> :
            <TooltipedContent text={'Expert not assigned'} id={'expert-tooltip' + props.ticket.id}>
              <PersonXFill className="my-red" />
            </TooltipedContent>) : <CustomBadge text={props.ticket.ticketStatus} />}
      </td>
    </tr>
  );
}

export default TicketsList;