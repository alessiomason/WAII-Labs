import { Table, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import API from './API';
function ProductById(props) {

    const [product, setProduct] = useState('');

    useEffect(() => {
        API.getProductById()
            .then((p) => { setProduct(p); console.log(p)})
            .catch(err =>props.handleError(err));
    }, []);

    return (
        <>
            <h1>Product Info</h1>
            <Table>
                <thead>
                <tr>
                    <th>Product id</th>
                    <th>name</th>
                    <th>brand</th>
                </tr>
                </thead>
                <tbody>
                {
                    // props.exams.map((ex) => <ExamRow exam={ex} key={ex.code} deleteExam={props.deleteExam} />)
                    <ProdottoRow key={product.ean} prod={product} />
                }
                </tbody>
            </Table>
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