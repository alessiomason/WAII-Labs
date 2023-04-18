import { Table, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import {useParams} from "react-router-dom";
import API from './API';
function ProfileByMail(props) {

    const [profile, setProfile] = useState('');
    const { mail } = useParams();

    useEffect(() => {
        API.getProfileById(mail)
            .then((p) => { setProfile(p); console.log(p)})
            .catch(err =>props.handleError(err));
    }, []);

    return (
        <>
            <h1>Profile info</h1>
            <Table>
                <thead>
                <tr>
                    <th>email</th>
                    <th>first name</th>
                    <th>last name</th>
                    <th>phone</th>
                </tr>
                </thead>
                <tbody>
                {
                    <ProfileRow key={profile.mail} profile={profile} />
                }
                </tbody>
            </Table>
        </>
    );
}

function ProfileRow(props) {
    return (
        <tr>
            <td>{props.profile.mail}</td>
            <td>{props.profile.firstName}</td>
            <td>{props.profile.lastName}</td>
            <td>{props.profile.phone}</td>
        </tr>
    );
}

export { ProfileByMail };