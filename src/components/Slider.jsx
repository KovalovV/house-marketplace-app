import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import {
    collection,
    getDocs,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../firebase.config';

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import Spinner from '../components/Spiner';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

const Slider = () => {
    const [recomendedListings, setRecomendedListings] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecomendedListings = async () => {
            let listings = [];

            const listingRef = collection(db, 'listing');
            const listingQuery = query(
                listingRef,
                orderBy('timestamp', 'desc'),
                limit(3)
            );
            const listingData = await getDocs(listingQuery);

            listingData.forEach((listing) => {
                console.log({
                    id: listing.id,
                    data: listing.data(),
                });
                return listings.push({
                    id: listing.id,
                    data: listing.data(),
                })
            });

            setRecomendedListings(listings);
        }

        fetchRecomendedListings();
        setLoading(false);
    }, [navigate]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            {recomendedListings && (
                <Swiper
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                >
                    {recomendedListings.map(({ data, id }) => (
                        <SwiperSlide
                            key={id}
                            onClick={() => navigate(`/category/${data.type}/${id}`)}
                        >

                            <div
                                className='swiperSlideDiv'
                                style={{
                                    background: `url(${data.imageUrls[0]}) center no-repeat`,
                                    backgroundSize: 'cover',
                                }}
                            >
                                <p className='swiperSlideText'>{data.name}</p>
                                <p className='swiperSlidePrice'>
                                    ${data.discountedPrice ?? data.regularPrice}{' '}
                                    {data.type === 'rent' && '/ month'}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};

export default Slider;