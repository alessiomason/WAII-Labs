import { useEffect, useState } from "react";
import { Button, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from '../API';
const dayjs = require('dayjs');

function TicketLogSection(props) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.getLogsByTicket(props.ticketId)
      .then(logs => setLogs(logs))
      .catch(err => console.log(err))
  }, [props.ticketId])

  return (
    <>
      <Row className='bottom-border'>
        <h2>Ticket status changes</h2>
      </Row>

      <Row>
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Time of change</th>
              <th>Previous ticket status</th>
              <th>New ticket status</th>
              <th>Expert</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="not-hoverable">
            {logs.sort((a, b) => ('' + a.time).localeCompare(b.time)).map((log, i) => <TicketLogListItem key={log.id} i={i} log={log} />)}
          </tbody>
        </Table>
      </Row>
    </>
  );
}

function TicketLogListItem(props) {
  const navigate = useNavigate();

  return (
    <tr>
      <td>{props.i + 1}</td>
      <td>{dayjs(props.log.time).format('YYYY/MM/DD hh:mm a')}</td>
      <td>{props.log.previousTicketStatus}</td>
      <td>{props.log.newTicketStatus}</td>
      <td>{props.log.ticket.expert.firstName + ' ' + props.log.ticket.expert.lastName}</td>
      <td className="d-flex justify-content-end"><Button onClick={() => navigate('/expert/' + props.log.ticket.expert.id)}>See expert page</Button></td>
    </tr>
  );
}

export default TicketLogSection;