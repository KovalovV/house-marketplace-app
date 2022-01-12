import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { 
    updateDoc,
    doc,
    getDocs,
    collection,
    query,
    where,
    orderBy,
    deleteDoc,
 } from 'firebase/firestore';
import { db } from '../firebase.config';

import ListingItem from '../components/ListingItem';

import editIcon from '../assets/svg/editIcon.svg';
import arrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

const Profile = () => {
    const auth = getAuth();
    const [loading, setLoading] = useState(true);
    const [isDisable, setIsDisable] = useState(true);
    const [profileListing, setProfileListing] = useState(null);
    const [formData, setformData] = useState({
        email: auth.currentUser.email,
        name: auth.currentUser.displayName,
    });
    
    const { email, name } = formData;

    const navigation = useNavigate();

    useEffect(() => {
        const fetchProfileListings = async () => {
            const profileListingRef = collection(db, 'listing');
            const profileListingQuery = query(
                profileListingRef,
                where('userRef', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc')
            );
            const profileListingData = await getDocs(profileListingQuery);

            const profileListingArray = [];

            profileListingData.forEach((listing) => {
                return profileListingArray.push({
                    id: listing.id,
                    data: listing.data()
                });
            });

            setProfileListing(profileListingArray);
            setLoading(false);
        };

        fetchProfileListings();
    }, []);

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

    const onDelete = async (listingId) => {
        if(window.confirm('Are you sure you want to delete this listing?')) {
            const delListingRef = doc(db, 'listing', listingId);
            await deleteDoc(delListingRef);

            const updateProfileListing = profileListing.filter(({ id }) => id !== listingId);
            setProfileListing(updateProfileListing);
        }
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

                {!loading && profileListing?.length > 0 && (
                    <div>
                        <p>
                            My listings
                        </p>
                        <div>
                            {profileListing.map(({ data, id }) => (
                                <ListingItem 
                                    key={id}
                                    listing={data}
                                    id={id}
                                    onDelete={(listingId) => onDelete(listingId)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Profile;