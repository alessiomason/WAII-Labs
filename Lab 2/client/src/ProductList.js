import { Table, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './API';
import './ProductList.css';


function ProductList(props) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        API.getProducts()
            .then((p) => { setProducts(p) })
            .catch(err => props.handleError(err));
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
                    {products.map(p => <ProdottoRow key={p.ean} prod={p} />)}
                </tbody>
            </Table>
        </>
    );
}

function ProdottoRow(props) {
    const navigate = useNavigate();

    return (
        <tr className='highlighted-table-row' onClick={() => navigate('/products/' + props.prod.ean)} >
            <td>{props.prod.ean}</td>
            <td>{props.prod.name}</td>
            <td>{props.prod.brand}</td>
        </tr>
    );
}

export { ProductList };