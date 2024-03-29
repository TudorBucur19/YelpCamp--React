import React, { createContext, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import firebase, { storage } from '../utils/firebase';
import { AuthenticationContext } from './AuthenticationContext';

export const CampgroundsContext = createContext();

const CampgroundsContextProvider = (props) => {
    const db = firebase.firestore();
    const history = useHistory();
    const [campground, setCampground] = useState({});   
    const campgroundsList = useEntries('Campgrounds');      
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const { user } = useContext(AuthenticationContext);

    // UPLOADING PHOTOS IN FIREBASE STORAGE
    const handleFileChange = e => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        const collectionRef = firebase.firestore().collection('MainImages');
        uploadTask.on(
            "state_changed",
            snapshot => {},
            error => {
                console.log(error);
            },
            () =>{
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    collectionRef.add({ url: url });
                    setUrl(url);
                });
            }
        )
    }

    // ADDING THE OTHER CAMPGROUND INFO
    const handleChange = (event) => {
        const value = event.target.value;
        setCampground({
            ...campground,
            [event.target.name]: value,
            image: url,
            author: user.displayName
        });
    };

    
    //ADDING CAMPGROUNDS TO DATABASE
    const handleSubmit = (event) => {
        event.preventDefault();

        db.collection('Campgrounds')
        .add({
            campground
        })
        .then(() => {
           setCampground({
               name: "",
               price: "",
               description: ""
           });
        })
        history.push("/campgrounds");
    };


    // GETTING CAMPGROUNDS LIST FROM DATABASE
    function useEntries(collection) {
        const [entries, setEntries] = useState([]);
        
        useEffect(() => {
            const unsubscribe = db
            .collection(collection)
            .onSnapshot((snapshot) => {
                const newEntry = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setEntries(newEntry);
                })
            return () => unsubscribe();
        }, [])
    
        return entries;
    };

    //REMOVE ITEMS FROM DATABASE
    const removeItem = (id) => {
        db.collection('Campgrounds')
        .doc(id)
        .delete()
        .then(() => console.log("Document was deleted"))
        .catch((error) => console.error("Error deleting document", error));
        history.push("/campgrounds");
    };


    const values = {
        useEntries,
        campground,
        campgroundsList,
        handleChange,
        handleSubmit,
        removeItem,
        handleFileChange,
        handleUpload
    }
    return ( 
        <CampgroundsContext.Provider value={values}>
            {props.children}
        </CampgroundsContext.Provider>
     );
}
 
export default CampgroundsContextProvider;