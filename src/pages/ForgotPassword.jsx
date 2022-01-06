import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { ReactComponent as KeyboardArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const onChange = event => setEmail(event.target.value);

    const onSubmit = (event) => {
        event.preventDefault();
        try {
            const auth = getAuth();
            sendPasswordResetEmail(auth, email)
            toast.success(`Reset password mail was sended to ${email}`);
        } catch (error) {
            toast.error('Some problems!')
        }
    };

    return (
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>
                    Forgot Password
                </p>
            </header>
            <main>
                <form
                    onSubmit={onSubmit}
                    className=''
                >
                    <input
                        type='email'
                        id='email'
                        placeholder='Email'
                        value={email}
                        onChange={onChange}
                        className='emailInput'
                    />
                    <Link to='/sign-in' className='forgotPasswordLink'>
                        Sign-in
                    </Link>
                    <div className='signInBar'>
                        <div className='signInText'>
                            Send Reset
                        </div>
                        <button className='signInButton'>
                            <KeyboardArrowRightIcon fill='#ffffff' />
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ForgotPassword;