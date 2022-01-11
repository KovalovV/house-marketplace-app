import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

import Spinner from '../components/Spiner';

const Contact = () => {
    const [userMsg, setUserMsg] = useState('');
    const [lanlord, setLanlord] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    const params = useParams();

    useEffect(() => {
        const getLanlord = async () => {
            const lanlordRef = doc(db, 'users', params.landlordId);
            const lanlordSnap = await getDoc(lanlordRef);
            if(lanlordSnap.exists()) {
                setLanlord(lanlordSnap.data());
            } else {
                toast.error('It looks like such a user does not exist')
            }
        };

        getLanlord();
        setLoading(false);

    }, [params.landlordId]);

    const onChange = (event) => setUserMsg(event.target.value);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>
                    Contact
                </p>
            </header>
            {lanlord ? 
            (<main>
                <div className='contactLandlord'>
                    <p className='lanlordName'>
                        Contact with { }
                    </p>
                </div>
                <form className='messageForm'>
                    <div className='messageDiv'>
                        <label 
                            htmlFor='userMsg'
                            className='messageLabel'
                            >
                            Message
                        </label>
                        <textarea
                            className='textarea'
                            type='text' 
                            name='userMsg' 
                            id='userMsg'
                            value={userMsg}
                            onChange={onChange}
                        />
                    </div>
                    <a 
                        href={`mailto:${lanlord.email}?Subject=${searchParams.get('listingName')}&body=${userMsg}`}>
                            <button 
                                type='button'
                                className='primaryButton'>
                                Send Message  
                            </button>
                    </a>
                </form>
                
                <a href=''></a>
            </main>) :
            (<div>
                Such user does not exist
            </div>)}
            
        </div>
    );
};

export default Contact;