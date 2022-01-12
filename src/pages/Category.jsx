import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ListingItem from '../components/ListingItem';

import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter
} from 'firebase/firestore';
import { db } from '../firebase.config';

import { toast } from 'react-toastify';

import Spinner from '../components/Spiner';


const Category = () => {
    const [listings, setListings] = useState([]);
    const [lastListing, setLastListing] = useState([]);
    const [loading, setLoading] = useState(true);

    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listingsRef = collection(db, 'listing');

                const querySet = query(
                    listingsRef,
                    where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(2)
                );

                const querySetDoc = await getDocs(querySet);

                const lastListingFetch = querySetDoc.docs[querySetDoc.docs.length - 1];
                setLastListing(lastListingFetch);

                const listingsArray = [];
                querySetDoc.forEach((doc) => {
                    return listingsArray.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });

                setListings(listingsArray);
                setLoading(false);
            } catch (error) {
                toast.error('Something went wrong with fetching listings!')
            }
        };

        fetchListing();

    }, [params.categoryName]);

    const onFetchMoreListing = async () => {
        try {
            const listingsRef = collection(db, 'listing');

            const querySet = query(
                listingsRef,
                where('type', '==', params.categoryName),
                orderBy('timestamp', 'desc'),
                startAfter(lastListing),
                limit(7)
            );

            const querySetDoc = await getDocs(querySet);

            const lastListingFetch = querySetDoc.docs[querySetDoc.docs.length - 1];
            setLastListing(lastListingFetch);

            const listingsArray = [];
            querySetDoc.forEach((doc) => {
                return listingsArray.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });

            setListings((prevState) => [...prevState, ...listingsArray]);
            setLoading(false);
        } catch (error) {
            toast.error('Something went wrong with fetching listings!')
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className='category'>
            <header>
                <p className='pageHeader'>
                    Listings for {params.categoryName}
                </p>
            </header>
            <main>
                <ul className='categoryListings'>
                    {listings.length > 0 ? (
                        listings.map((listing) => {
                            return (
                                <ListingItem
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}
                                />
                            );
                        })
                    )
                        : <p>No listings</p>}
                </ul>
            </main>
            {listings?.length > 0 && (
                <p
                    className='loadMore'
                    onClick={onFetchMoreListing}
                >
                    Load More
                </p>
            )}
        </div>
    );
};

export default Category;