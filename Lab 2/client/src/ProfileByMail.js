import { Container, Table, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import API from './API';
import './ProfileList.css'
function ProfileByMail(props) {
    const [profile, setProfile] = useState('');
    const [empty, setEmpty] = useState(false);
    const { email } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        API.getProfileById(email)
            .then((p) => { setProfile(p); console.log(p)})
            .catch(err => { props.handleError(err); setEmpty(true); props.setDirty(false) });
    }, [email, props, props.dirty]);

    return (
        <>
            <h1 className="title_profiles">Profile Info</h1>
            {empty ? <h2 className="emptyProduct"> { `No profile found with email: ${email}`}</h2>
                :
            <Container>
                <Table>
                <thead>
                <tr>
                    <th>Email</th>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Phone</th>
                </tr>
                </thead>
                <tbody>
                {
                    <ProfileRow key={profile.mail} profile={profile} />
                }
                </tbody>
            </Table>
                <Button className='edit_button' onClick={() => navigate('/editProfile/' + email)}>Edit profile</Button>
            </Container> }
        </>
    );
}

function ProfileRow(props) {
    return (
        <tr>
            <td>{props.profile.email}</td>
            <td>{props.profile.firstName}</td>
            <td>{props.profile.lastName}</td>
            <td>{props.profile.phone}</td>
        </tr>
    );
}

export { ProfileByMail };