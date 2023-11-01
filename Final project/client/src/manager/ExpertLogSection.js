import { useEffect, useState } from "react";
import { Button, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from '../API';
const dayjs = require('dayjs');

function ExpertLogSection(props) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.getLogsByExpert(props.expertId)
      .then(logs => setLogs(logs))
      .catch(err => console.log(err))
  }, [props.expertId])

  return (
    <>
      <Row className='bottom-border'>
        <h2>Ticket status changes operated</h2>
      </Row>

      <Row>
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Ticket title</th>
              <th>Time of change</th>
              <th>Previous ticket status</th>
              <th>New ticket status</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="not-hoverable">
            {logs.map((log, i) => <ExpertLogListItem key={log.id} i={i} log={log} />)}
          </tbody>
        </Table>
      </Row>
    </>
  );
}

function ExpertLogListItem(props) {
  const navigate = useNavigate();

  return (
    <tr>
      <td>{props.i + 1}</td>
      <td>{props.log.ticket.title}</td>
      <td>{dayjs(props.log.time).format('YYYY/MM/DD hh:mm a')}</td>
      <td>{props.log.previousTicketStatus}</td>
      <td>{props.log.newTicketStatus}</td>
      <td className="d-flex justify-content-end"><Button onClick={() => navigate('/ticket/' + props.log.ticket.id)}>See ticket page</Button></td>
    </tr>
  );
}

export default ExpertLogSection;