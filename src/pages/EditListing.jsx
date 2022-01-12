import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage';
import { serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import Spinner from '../components/Spiner';

const commonRadio = [{
    label: 'Yes',
    value: true
},
{
    label: 'No',
    value: false
}];

const offers = [{
    name: 'offer',
    id: 'offerYes',
    ...commonRadio[0]
},
{
    name: 'offer',
    id: 'offerNo',
    ...commonRadio[1]
}];

const parkings = [{
    name: 'parking',
    id: 'parkingYes',
    ...commonRadio[0]
},
{
    name: 'parking',
    id: 'parkingNo',
    ...commonRadio[1]
}];

const furnisheds = [{
    name: 'furnished',
    id: 'furnishedYes',
    ...commonRadio[0]
},
{
    name: 'furnished',
    id: 'furnishedNo',
    ...commonRadio[1]
}];

const EditListing = () => {
    // eslint-disable-next-line
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0,
    });

    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude,
    } = formData;

    const auth = getAuth();
    const navigate = useNavigate();
    const params = useParams();
    const isMounted = useRef(true);

    useEffect(() => {
        if (listing && listing.userRef !== auth.currentUser.uid) {
            toast.error('You can not edit that listing')
            navigate('/')
        }
    });

    useEffect(() => {
        setLoading(true);
        const fetchEditListing = async () => {
            const listingRef = doc(db, 'listing', params.listingId);
            const listingSnap = await getDoc(listingRef);

            if (listingSnap.exists()) {
                const listingData = listingSnap.data();
                setListing(listingData);
                setFormData({
                    ...listingData,
                    address: listingData?.location,
                    latitude: listingData?.geolocation.lat,
                    longitude: listingData?.geolocation.lng,
                });
                setLoading(false);
            } else {
                navigate('/');
                toast.error('Listing does not exist');
            }

        };

        fetchEditListing();
    }, [params.listingId, navigate]);

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData((prevState) => {
                        return {
                            ...prevState,
                            userRef: user.uid,
                        }
                    })
                } else {
                    navigate('/');
                }
            });
        }

        return () => {
            isMounted.current = false;
        }
    }, [isMounted]);

    const onSubmitListing = async (event) => {
        event.preventDefault();

        let geolocation = {};
        let location;

        setLoading(true)

        if (discountedPrice >= regularPrice) {
            setLoading(false);
            toast.error('Discounted price needs to be less than regular price!');
            return;
        }

        if (images.length > 6) {
            setLoading(false);
            toast.error('Max 6 images!');
            return;
        }

        if (geolocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`);

            const result = await response.json();

            geolocation.lat = result.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = result.results[0]?.geometry.location.lng ?? 0;

            location =
                result.status === 'ZERO_RESULTS'
                    ? undefined
                    : result.results[0]?.formatted_address;

            if (location === undefined || location.includes('undefined')) {
                setLoading(false);
                toast.error('Please enter a correct address');
                return;
            }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const fileName = `${auth.currentUser.uid}-${uuidv4()}-${image.name}`; // проблеми із збереженням фото
                const storageRef = ref(storage, 'images/' + fileName);

                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on('state_changed',
                    (snapshot) => { },
                    (error) => { reject(error) },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            });
        };

        const imageUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false);
            toast.error('Images not uploaded');
            return;
        });

        let formDataCopy = {
            ...formData,
            imageUrls,
            location: address,
            geolocation: {
                lat: latitude,
                lng: longitude,
            },
            timestamp: serverTimestamp(),
        };
        delete formDataCopy.address;
        delete formDataCopy.images;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;

        const docRef = doc(db, 'listing', params.listingId);
        await updateDoc(docRef, formDataCopy);

        setLoading(false);
        toast.success('Listing was updated successfully');
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    };

    const onMutate = (event) => {
        const fieldObj = event.target;
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        switch (fieldName) {
            case 'type':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: fieldValue,
                    }
                });
                break;

            case 'name':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: fieldValue,
                    }
                });
                break;

            case 'bedrooms':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: Number(fieldValue),
                    }
                });
                break;

            case 'bathrooms':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: Number(fieldValue),
                    }
                });
                break;

            case 'parking':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: JSON.parse(fieldValue),
                    }
                });
                break;

            case 'furnished':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: JSON.parse(fieldValue),
                    }
                });
                break;

            case 'address':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: fieldValue,
                    }
                });
                break;

            case 'latitude':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: Number(fieldValue),
                    }
                });
                break;

            case 'longitude':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: Number(fieldValue),
                    }
                });
                break;

            case 'offer':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: JSON.parse(fieldValue),
                    }
                });
                break;

            case 'regularPrice':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: Number(fieldValue),
                    }
                });
                break;

            case 'discountedPrice':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: Number(fieldValue),
                    }
                });
                break;

            case 'images':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: fieldObj.files,
                    }
                });
                break;

            default:
                setFormData((prevState) => {
                    return {
                        ...prevState,
                    }
                });
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className='profile'>
            <header>
                <p className='pageHeader'>Edit a Listing</p>
            </header>

            <main>
                <form onSubmit={onSubmitListing}>
                    <label className='formLabel'>Sell / Rent</label>
                    <div className='formButtons'>
                        <input
                            type='radio'
                            id='sell'
                            name='type'
                            value='sell'
                            onChange={onMutate}
                        />
                        <label
                            className={type === 'sell' ? 'formButtonActive' : 'formButton'}
                            htmlFor='sell'
                        >
                            Sell
                        </label>
                        <input
                            type='radio'
                            id='rent'
                            name='type'
                            value='rent'
                            onChange={onMutate}
                        />
                        <label
                            className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                            htmlFor='rent'
                        >
                            Rent
                        </label>
                    </div>

                    <label className='formLabel'>Name</label>
                    <input
                        className='formInputName'
                        type='text'
                        id='name'
                        name='name'
                        value={name}
                        onChange={onMutate}
                        maxLength='32'
                        minLength='10'
                        required
                    />

                    <div className='formRooms flex'>
                        <div>
                            <label className='formLabel'>Bedrooms</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='bedrooms'
                                name='bedrooms'
                                value={bedrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </div>
                        <div>
                            <label className='formLabel'>Bathrooms</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='bathrooms'
                                name='bathrooms'
                                value={bathrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </div>
                    </div>

                    <label className='formLabel'>Parking spot</label>
                    <div className='formButtons'>
                        {parkings.map(({ name, label, id, value }) => (
                            <div key={id}>
                                <input
                                    type='radio'
                                    id={id}
                                    name={name}
                                    value={value}
                                    checked={value === parking}
                                    onChange={onMutate}
                                />
                                <label
                                    className='formButton'
                                    htmlFor={id}
                                >
                                    {label}
                                </label>
                            </div>
                        ))}
                    </div>

                    <label className='formLabel'>Furnished</label>
                    <div className='formButtons'>
                        {furnisheds.map(({ name, label, id, value }) => (
                            <div key={id}>
                                <input
                                    type='radio'
                                    id={id}
                                    name={name}
                                    value={value}
                                    checked={value === furnished}
                                    onChange={onMutate}
                                />
                                <label
                                    className='formButton'
                                    htmlFor={id}
                                >
                                    {label}
                                </label>
                            </div>
                        ))}
                    </div>

                    <label className='formLabel'>Address</label>
                    <textarea
                        className='formInputAddress'
                        type='text'
                        id='address'
                        name='address'
                        value={address}
                        onChange={onMutate}
                        required
                    />

                    {!geolocationEnabled && (
                        <div className='formLatLng flex'>
                            <div>
                                <label className='formLabel'>Latitude</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    id='latitude'
                                    name='latitude'
                                    value={latitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                            <div>
                                <label className='formLabel'>Longitude</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    id='longitude'
                                    name='longitude'
                                    value={longitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <label className='formLabel'>Offer</label>
                    <div className='formButtons'>
                        {offers.map(({ name, label, id, value }) => (
                            <div key={id}>
                                <input
                                    type='radio'
                                    id={id}
                                    name={name}
                                    value={value}
                                    checked={value === offer}
                                    onChange={onMutate}
                                />
                                <label
                                    className='formButton'
                                    htmlFor={id}
                                >
                                    {label}
                                </label>
                            </div>
                        ))}
                    </div>

                    <label className='formLabel'>Regular Price</label>
                    <div className='formPriceDiv'>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='regularPrice'
                            name='regularPrice'
                            value={regularPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required
                        />
                        {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
                    </div>

                    {offer && (
                        <>
                            <label className='formLabel'>Discounted Price</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='discountedPrice'
                                name='discountedPrice'
                                value={discountedPrice}
                                onChange={onMutate}
                                min='50'
                                max='750000000'
                                required={offer}
                            />
                        </>
                    )}

                    <label className='formLabel'>Images</label>
                    <p className='imagesInfo'>
                        The first image will be the cover (max 6).
                    </p>
                    <input
                        className='formInputFile'
                        type='file'
                        id='images'
                        name='images'
                        onChange={onMutate}
                        max='6'
                        accept='.jpg,.png,.jpeg'
                        multiple
                        required
                    />
                    <button type='submit' className='primaryButton createListingButton'>
                        Update Listing
                    </button>
                </form>
            </main>
        </div>
    );
};

export default EditListing;