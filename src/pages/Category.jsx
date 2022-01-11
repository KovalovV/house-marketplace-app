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
} from 'firebase/firestore';
import { db } from '../firebase.config';

import { toast } from 'react-toastify';

import Spinner from '../components/Spiner';


const Category = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listingsArray = [];

                const listingsRef = collection(db, 'listing');

                const querySet = query(
                    listingsRef,
                    where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                );

                const querySetDoc = await getDocs(querySet);

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
        </div>
    );
};

export default Category;