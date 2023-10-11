import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './TicketsList.css';

function TicketsList(props) {
	return (
	  <Table striped>
		<thead>
		  <tr>
			<th>#</th>
			<th>Title</th>
			<th>Product</th>
			<th>Status</th>
		  </tr>
		</thead>
		<tbody>
		  {props.tickets.map((ticket, i) => {
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
		<td>{props.ticket.title}</td>
		<td>{props.ticket.purchase.product.name}</td>
		<td>{props.ticket.ticketStatus}</td>
	  </tr>
	);
  }

  export default TicketsList;