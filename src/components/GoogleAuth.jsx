import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

import { ReactComponent as GoogleAuthIcon } from '../assets/svg/googleIcon.svg';


const GoogleAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const onGoogleClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if(!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                });
            }
            toast.success(`Sign ${location.pathname === '/sign-in' ? 'in' : 'up'} successful!`);
            navigate('/');
        } catch (error) {
            toast.error('Somethig went wrong!');
        }
    };

    return (
        <div className='socialLogin'>
            <p>
                Sign {location.pathname === '/sign-in' ? 'in' : 'up'} with
            </p>
            <button className='socialIconDiv' onClick={onGoogleClick}>
                <GoogleAuthIcon className='socailIconImg' with='34px'/>
            </button>
        </div>
    );
};

export default GoogleAuth;