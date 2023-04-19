import {Table, Button, Container} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import API from './API';
import './ProductList.css';
function ProductById(props) {
    const [product, setProduct] = useState('');
    const [empty, setEmpty] = useState(false);
    const { ean } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        API.getProductById(ean)
            .then((p) => { setProduct(p); console.log(ean)})
            .catch(err => {props.handleError(err); setEmpty(true);});
    }, [ean, props]);

    return (
        <>
            <h1 className="title_products">Product Info</h1>
            {empty ? <h2 className="emptyProduct"> { `No product found with EAN: ${ean}`}</h2>
                :
                <Container>
                    <Table>
                        <thead>
                        <tr>
                            <th>EAN</th>
                            <th>Name</th>
                            <th>Brand</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            // props.exams.map((ex) => <ExamRow exam={ex} key={ex.code} deleteExam={props.deleteExam} />)
                            <ProdottoRow key={product.ean} prod={product} />
                        }
                        </tbody>
                    </Table>
                    <Button onClick={() => navigate('/products/')}>Back to products list</Button>
                </Container>
            }

        </>
    );
}

function ProdottoRow(props) {
    return (
        <tr>
            <td>{props.prod.ean}</td>
            <td>{props.prod.name}</td>
            <td>{props.prod.brand}</td>
        </tr>
    );
}

export { ProductById };