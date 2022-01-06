import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

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
                    console.log(doc.data());
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
        <div>
            <header>
                Listings for {params.categoryName}
            </header>
            <div>
                {listings.length > 0 ? (
                    listings.map((listing) => {
                        return (<h1 key={listing.id}>
                            {listing.data.name}
                        </h1>);
                    })
                )
                    : <p>No listings</p>}
            </div>
        </div>
    );
};

export default Category;