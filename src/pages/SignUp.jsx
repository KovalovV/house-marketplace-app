import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { toast } from 'react-toastify';

import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

const SignUp = () => {
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = formData;

    const navigation = useNavigate();

    const isVisiblePass = () => setShowPass((prevState) => !prevState);

    const onChange = (event) => {
        setFormData((prevState) => {
            return {
                ...prevState,
                [event.target.id]: event.target.value,
            }
        });
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            const auth = getAuth();

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            updateProfile(auth.currentUser, {
                displayName: name,
            });

            const formDataDb = { ...formData };
            delete formDataDb.password;
            formDataDb.timestamp = serverTimestamp();

            console.log(user);

            await setDoc(doc(db, 'users', user.uid), formDataDb);

            navigation('/');
        } catch (error) {
            toast.error('Some problems with sign up');
        }
    };

    return (
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>Welcome Back!</p>
            </header>

            <form onSubmit={onSubmit}>
                <input
                    className='nameInput'
                    type='text'
                    placeholder='Name'
                    id='name'
                    value={name}
                    onChange={onChange}
                />

                <input
                    className='emailInput'
                    type='email'
                    placeholder='Email'
                    id='email'
                    value={email}
                    onChange={onChange}
                />

                <div className='passwordInputDiv'>
                    <input
                        className='passwordInput'
                        type={showPass ? 'text' : 'password'}
                        placeholder='Password'
                        id='password'
                        value={password}
                        onChange={onChange}
                    />

                    <img
                        src={visibilityIcon}
                        alt='show password'
                        className='showPassword'
                        onClick={isVisiblePass}
                    />
                </div>

                <div className='signUpBar'>
                    <p className='signUpText'>Sign Up</p>
                    <button type='submit' className='signUpButton'>
                        <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
                    </button>
                </div>
            </form>

            <Link to='/sign-in' className='registerLink'>
                Sign In Instead
            </Link>
        </div>
    );
};

export default SignUp;