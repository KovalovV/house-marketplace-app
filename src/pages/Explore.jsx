import { Link } from 'react-router-dom';
import rentCategoryImg from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImg from '../assets/jpg/sellCategoryImage.jpg'

const Explore = () => {
    return (
        <div className='explore'>
            <header>
                <p className='pageHeader'>
                    Explore
                </p>
            </header>
            <main>
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