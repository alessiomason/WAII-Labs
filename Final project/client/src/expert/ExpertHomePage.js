import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import TicketsList from "../customer/TicketsList";
import API from "../API";
import '../customer/CustomerHomePage.css';

function ExpertHomePage(props) {
	const [tickets, setTickets] = useState([]);

	useEffect(() => {
		API.getTickets()
			.then(tickets => setTickets(tickets))
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
						<h3>Assigned tickets</h3>
					</Row>
					<Row>
						<TicketsList tickets={tickets.filter(ticket => ticket.ticketStatus !== 'CLOSED' && ticket.ticketStatus !== 'RESOLVED')} />
					</Row>
				</Col>
				<Col className='section'>
					<Row>
						<h3>Past tickets</h3>
					</Row>
					<Row>
						<TicketsList tickets={tickets.filter(ticket => ticket.ticketStatus === 'CLOSED' || ticket.ticketStatus === 'RESOLVED')} />
					</Row>
				</Col>
			</Row>
		</>
	);
}

export default ExpertHomePage;