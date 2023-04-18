
import { Table, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import API from './API';
function ProductList(props) {

    const [products, setProducts] = useState('');

    useEffect(() => {
        API.getProducts()
            .then((p) => { setProducts(p); console.log(p)})
            .catch(err =>props.handleError(err));
    }, []);

    return (
        <>
            <h1>Products list</h1>
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
                    products.map((p) => <ProdottoRow key={p.ean} prod={p} />)
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

export { ProductList };