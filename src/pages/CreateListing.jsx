import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase.config';
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

const CreateListing = () => {
    const [geolocationEnabled, setGeolocationEnabled] = useState(true)
    const [loading, setLoading] = useState(false)
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
    })

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
    } = formData

    const auth = getAuth();
    const naviate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData((prevState) => {
                        return {
                            ...prevState,
                            useRef: user.uid,
                        }
                    })
                } else {
                    naviate('/');
                }
            });
        }

        return () => {
            isMounted.current = false;
        }
    }, [isMounted]);

    console.log(formData);

    const onSubmitListing = (event) => {
        event.preventDefault();
    }

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
                        [fieldName]: fieldValue,
                    }
                });
                break;

            case 'bathrooms':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: fieldValue,
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
                        [fieldName]: fieldValue,
                    }
                });
                break;
                
            case 'discountedPrice':
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        [fieldName]: fieldValue,
                    }
                });
                break;
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className='profile'>
            <header>
                <p className='pageHeader'>Create a Listing</p>
            </header>

            <main>
                <form onSubmit={onSubmitListing}>
                    <label className='formLabel'>Sell / Rent</label>
                    <div className='formButtons'>
                        <input
                            type='radio'
                            id='sale'
                            name='type'
                            value='sale'
                            onChange={onMutate}
                        />
                        <label
                            className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                            htmlFor='sale'
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
                        onChange={onMutate}
                        max='6'
                        accept='.jpg,.png,.jpeg'
                        multiple
                        required
                    />
                    <button type='submit' className='primaryButton createListingButton'>
                        Create Listing
                    </button>
                </form>
            </main>
        </div>
    );
};

export default CreateListing;