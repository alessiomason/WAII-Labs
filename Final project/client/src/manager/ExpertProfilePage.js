import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Card, Form, Modal, FloatingLabel } from 'react-bootstrap';
import API from '../API';
import TicketsList from '../customer/TicketsList';
const dayjs = require('dayjs');

function ExpertProfilePage(props) {
  let { expertId } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState({});
  const [dirty, setDirty] = useState(true);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (dirty) {
      API.getExpertById(expertId)
        .then(expert => {
          setExpert(expert);
          setDirty(false);
        })
    }
  }, [expertId, dirty])

  useEffect(() => {
    if (!dirty && expert.id) {
      expert.ticketIds.forEach(ticketId => {
        if (!tickets.map(ticket => ticket.id).includes(ticketId)) {   // avoids duplications
          API.getTicketById(ticketId)
            .then(ticket => setTickets(prevTickets => {
              return prevTickets.concat(ticket);
            }))
            .catch(err => console.log(err))
        }
      });
    }
  }, [expertId, dirty])

  function authorizeExpert() {
    API.authorizeExpert(expert.id, !expert.authorized)
      .then(() => {
        setDirty(true);
      })
      .catch(err => console.log(err))
  }

  return (
    <Row>
      <Col className='section'>
        <Row className='bottom-border'>
          <Col><h1 className='with-side-button'>{expert.firstName + ' ' + expert.lastName}</h1></Col>
          <Col className='d-flex justify-content-end'>
            <Button onClick={authorizeExpert}>{expert.authorized ? 'Unauthorize expert' : 'Authorize expert'}</Button>
          </Col>
        </Row>
        <Row>
          <Col xs={3} className='header-column'><h5 className='text-end'>Authorized</h5></Col>
          <Col>{expert.authorized ? 'Yes' : 'No'}</Col>
        </Row>
        <Row>
          <Col xs={3} className='header-column'><h5 className='text-end'>Expert's {expert.specializations?.length === 1 ? 'specialization' : 'specializations'}</h5></Col>
          <Col>{expert.specializations?.map(specialization => <p key={specialization.id}>{specialization.name}</p>)}</Col>
        </Row>

        <Row className='bottom-border'>
          <h2>Assigned tickets</h2>
          <TicketsList tickets={tickets} role='manager' />
        </Row>

        <Row>
          <LogSection expertId={expert.id} setDirty={setDirty} />
        </Row>
      </Col>
    </Row>
  );
}

function LogSection(props) {
  return (
    <>
      <Row className='bottom-border'>
        <Col><h2>Logs</h2></Col>
      </Row>

      <Row className='messages-section'>
      </Row>
    </>
  );
}

export default ExpertProfilePage;