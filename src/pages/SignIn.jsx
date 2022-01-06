import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { toast } from 'react-toastify';

import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

import GoogleAuth from '../components/GoogleAuth';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

const SignIn = () => {
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const {email, password} = formData;

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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if(user) {
                navigation('/');
            }

            toast.success('Success sign in!');
        } catch (error) {
            toast.error('Some problems with sign in!');
        }
    };

    return (
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>Welcome Back!</p>
            </header>

            <form onSubmit={onSubmit}>
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

                <Link to='/forgot-password' className='forgotPasswordLink'>
                    Forgot Password
                </Link>

                <div className='signInBar'>
                    <p className='signInText'>Sign In</p>
                    <button className='signInButton'>
                        <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
                    </button>
                </div>
            </form>

            <Link to='/sign-up' className='registerLink'>
                Sign Up Instead
            </Link>

            <GoogleAuth />
        </div>
    );
};

export default SignIn;