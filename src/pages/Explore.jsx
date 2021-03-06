import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import rentCategoryImg from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImg from '../assets/jpg/sellCategoryImage.jpg'

import Slider from '../components/Slider';
import Spinner from '../components/Spiner';

const Explore = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    if(loading) {
        return <Spinner />;
    }

    return (
        <div className='explore'>
            <header>
                <p className='pageHeader'>
                    Explore
                </p>
            </header>
            <main>
                <Slider />
                <p className='exploreCategoryHeading'>
                    Category for rent
                </p>
                <div className='exploreCategories'>
                    <Link to='/category/rent'>
                        <img 
                            src={rentCategoryImg}
                            alt='for rent'
                            className='exploreCategoryImg' />
                        <p className='exploreCategoryName'>
                            Place for rent
                        </p>
                    </Link>
                    <Link to='/category/sell'>
                        <img 
                            src={sellCategoryImg}
                            alt='for sell'
                            className='exploreCategoryImg' />
                        <p className='exploreCategoryName'>
                            Place for sell
                        </p>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Explore;