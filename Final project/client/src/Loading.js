import { Container } from "react-bootstrap";
import ReactLoading from "react-loading";
import "./Loading.css";

function Loading(props) {
  return (
    <Container fluid className={'top-container' + (props.small ? ' small' : '')}>
      <h1>Loading</h1>
      <ReactLoading type="bars" color="#dd3675"
        height={200} width={100} />
    </Container>
  );
}

export default Loading;