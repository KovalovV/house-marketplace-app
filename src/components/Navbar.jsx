import { useNavigate, useLocation } from 'react-router-dom';

import { ReactComponent as PersonalOutlineIcon } from '../assets/svg/personOutlineIcon.svg';
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isRouteLink = route => (route === location.pathname) ? true : false;

    return (
        <footer className='navbar'>
            <div className='navbarNav'>
                <ul className='navbarListItems'>
                    <li className='navbarListItem' onClick={() => navigate('/')}>
                        <ExploreIcon fill={isRouteLink('/') ? '#2c2c2c' : '#8f8f8f'} />
                        <p
                        className={isRouteLink('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>
                            Explore
                        </p>
                    </li>
                    <li className='navbarListItem' onClick={() => navigate('/offers')}>
                        <OfferIcon fill={isRouteLink('/offers') ? '#2c2c2c' : '#8f8f8f'} />
                        <p 
                        className={isRouteLink('/offers') ? 'navbarListItemNameActive' : 'navbarListItemName'}>
                            Offers
                        </p>
                    </li>
                    <li className='navbarListItem' onClick={() => navigate('/profile')}>
                        <PersonalOutlineIcon fill={isRouteLink('/profile') ? '#2c2c2c' : '#8f8f8f'} />
                        <p
                        className={isRouteLink('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'}>
                            Profile
                        </p>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Navbar;