import { Button, Alert, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import API from "./API";


function FormCreateTicket(props) {

  let { purchaseId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState('');
  const [purchase, setPurchase] = useState();
  const [dirty,setDirty] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (dirty) {
      API.getPurchaseById(purchaseId)
        .then(purchase => {
          setPurchase(purchase);
          setDirty(false);
          props.setDirty(false);
        })
        .catch(err => console.log(err))
    }
  }, [purchaseId, dirty])


  const handleSubmit = (event) => {
    event.preventDefault();

    const newTicket = {
      title: title,
      description: description,
      purchase: purchase
    }

    API.createTicket(newTicket)
    .then(createdTicket => {
      setDirty(true);
      props.setDirty(true);
      setSaveMsg('The ticket has been created.');
      navigate('/ticket/' + createdTicket.id);
    })
    .catch(err => {
      props.handleError(err);
      setSaveMsg('Error during the creation of the ticket.')
    });
  }

  return (
    <>
      <Container>
        <h1 className="title_profiles">Create Ticket</h1>
        <Row>
          <Col>
            {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Product name</Form.Label>
                <Form.Control type='text' value={purchase ? purchase.product.name : ""} readOnly>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Ticket title</Form.Label>
                <Form.Control type='text' value={title} onChange={ev => setTitle(ev.target.value)} >
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Ticket description</Form.Label>
                <Form.Control type='text' value={description} onChange={ev => setDescription(ev.target.value)}>
                </Form.Control>
              </Form.Group>
              <Button type='submit' className='save_button'>Create</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export { FormCreateTicket };