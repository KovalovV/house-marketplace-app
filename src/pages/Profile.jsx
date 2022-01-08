import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';

import editIcon from '../assets/svg/editIcon.svg';
import arrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

const Profile = () => {
    let auth = getAuth();
    // const { email, displayName } = auth.currentUser || {};

    const [formData, setformData] = useState({
        email: auth.currentUser.email,
        name: auth.currentUser.displayName,
    });

    const { email, name } = formData;

    const [isDisable, setIsDisable] = useState(true);

    // useEffect(() => {
    //     auth = getAuth();
    // }, [name, email]);

    const navigation = useNavigate();

    const onClick = () => {
        try {
            auth.signOut();
            toast.success('Log out success!')
            navigation('/');
        } catch (error) {
            toast.error('Something went wrong!')
        }
    };

    const onSubmitUpdateProfile = async (event) => {
        event.preventDefault();

        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, formData);
            }

            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, formData);

            toast.success('Profile info updated!');
            setIsDisable(true);
        } catch (error) {
            toast.error('Profile info not updated!');
        }

        // setformData((prevState) => {
        //     return {
        //         ...prevState,
        //         ...formData,
        //     }
        // })
    };

    const onChangeEdit = (event) => {
        setformData((prevState) => {
            return {
                ...prevState,
                [event.target.id]: event.target.value,
            }
        }
        )
    };

    const onClickAllowEdit = () => {
        setIsDisable((prevState) => !prevState);
    };

    return (
        <div className='profile'>
            <header className='profileHeader'>
                <p className='pageHeader'>
                    My Profile
                </p>
                <button className='logOut' onClick={onClick}>Log Out</button>
            </header>
            <main>
                <div className='profileDetailsHeader'>
                    <p className='personalDetailsText'>
                        Personal Details
                    </p>
                    <img
                        src={editIcon}
                        alt='Edit name'
                        className='changePersonalDetails'
                        onClick={onClickAllowEdit}
                    />
                </div>
                <div className='profileCard'>
                    <form onSubmit={onSubmitUpdateProfile}>
                        <div className='profileChar'>
                            <p className='profileCharTitle'>
                                Name:
                            </p>
                            <input
                                type='text'
                                id='name'
                                value={name}
                                disabled={isDisable}
                                className={isDisable ? 'profileName' : 'profileNameActive'}
                                onChange={onChangeEdit}
                            />
                        </div>
                        <div className='profileChar'>
                            <p className='profileCharTitle'>
                                Email:
                            </p>
                            <input
                                type='text'
                                id='email'
                                value={email}
                                disabled={isDisable}
                                className={isDisable ? 'profileEmail' : 'profileEmailActive'}
                                onChange={onChangeEdit}
                            />
                        </div>
                        <button type='submit' className='submitEdit'>Submit edit</button>
                    </form>
                </div>
                <Link to='/create-listing' className='createListing'>
                    <img src={homeIcon} alt='home' />
                    <div>
                        Sell or rent your house
                    </div>
                    <img src={arrowRightIcon} alt='arrow right' />
                </Link>
            </main>
        </div>
    );
};

export default Profile;