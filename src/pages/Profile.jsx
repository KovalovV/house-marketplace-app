import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const Profile = () => {
    const auth = getAuth();
    const { email, displayName } = auth.currentUser || {};

    const [formData, setformData] = useState({
        email,
        name: displayName,
    });

    const navigation = useNavigate();

    const onClick = () => {
        try {
            auth.signOut();
            navigation('/');
        } catch (error) {
            toast.error('Somethinh went wrong!')
        }
    };

    return (
        auth.currentUser ?
        (<div className='profile'>
            <header className='profileHeader'>
                <p className='pageHeader'>
                    My Profile
                </p>
                <button className='logOut' onClick={onClick}>Log Out</button>
            </header>
        </div>)
        : <p>Please, sign-in</p>
    );
};

export default Profile;