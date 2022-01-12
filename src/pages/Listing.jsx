import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import { db } from '../firebase.config';

import shareIcon from '../assets/svg/shareIcon.svg'
import Spinner from '../components/Spiner';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

const Listing = () => {
    const [copyLink, setCopyLink] = useState(false);
    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState({});

    const auth = getAuth();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        const fetchSingleListing = async () => {
            const listingRef = doc(db, 'listing', params.listingId);
            const listingSnap = await getDoc(listingRef);

            if (listingSnap.exists()) {
                const data = listingSnap.data();
                setListing(data);
                setLoading(false);
            } else {
                toast.error('Something went wrong with listing data!');
            }
        }
        fetchSingleListing();

    }, [navigate, params.listingId]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <main>
            <Swiper
                slidesPerView={1}
                pagination={{ clickable: true }}
            >
                {listing.imageUrls.map((listingItem, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className='swiperSlideDiv'
                            style={{ 
                                background: `url(${listing.imageUrls[index]}) center no-repeat`,
                                backgroundSize: 'cover',
                            }}
                        >
                        </div>
                    </SwiperSlide>))}
            </Swiper>
            <div
                className='shareIconDiv'
                onClick={() => {
                    console.log(navigator)
                    navigator.clipboard.writeText(window.location.href);
                    setCopyLink(true);
                    setTimeout(() => {
                        setCopyLink(false);
                    }, 2000);
                }}>
                <img src={shareIcon} alt='share icon' />
            </div>
            {copyLink &&
                <p className='linkCopied'>
                    Link copied!
                </p>}

            <div className='listingDetails'>
                <p className='listingName'>
                    {listing.name} - ${listing.offer ? listing.discountedPrice.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') : listing.regularPrice.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </p>
                <p className='listingLocation'>
                    {listing.location}
                </p>
                <p className='listingType'>
                    For {listing.type === 'rent' ? 'rent' : 'sell'}
                </p>
                {listing.offer && (
                    <p className='discountPrice'>
                        ${listing.regularPrice - listing.discountedPrice} discount
                    </p>
                )}
                <ul className='listingDetailsList'>
                    <li>
                        {listing.bedrooms > 1
                            ? `${listing.bedrooms} Bedrooms`
                            : '1 Bedroom'}
                    </li>
                    <li>
                        {listing.bathrooms > 1
                            ? `${listing.bathrooms} Bathrooms`
                            : '1 Bathroom'}
                    </li>
                    <li>{listing.parking && 'Parking Spot'}</li>
                    <li>{listing.furnished && 'Furnished'}</li>
                </ul>

                <p className='listingLocationTitle'>Location</p>

                <div className='leafletContainer'>
                    <MapContainer
                        style={{ height: '100%', width: '100%' }} center={[listing.geolocation.lat, listing.geolocation.lng]}
                        zoom={13}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                        />
                        <Marker
                            position={[listing.geolocation.lat, listing.geolocation.lng]}>

                        </Marker>
                    </MapContainer>
                </div>

                {auth.currentUser?.uid !== listing.userRef && (
                    <Link
                        to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
                        className='primaryButton contactButton'
                    >
                        Contact Landlord
                    </Link>
                )}
            </div>
        </main>
    );
};

export default Listing;