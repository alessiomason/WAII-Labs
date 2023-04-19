import { Table, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import API from './API';
import './ProductList.css';
function ProductList(props) {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        API.getProducts()
            .then((p) => { setProducts(p) })
            .catch(err =>props.handleError(err));
    }, [props]);

    return (
        <>
            <h1 className="title_products">Products List</h1>
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
                    products.map(p => <ProdottoRow key={p.ean} prod={p} />)
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