import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoLocationOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart, FaPlug, FaPhone, FaMapMarkerAlt, FaDollarSign, FaChargingStation } from "react-icons/fa";
import { Ri24HoursFill } from "react-icons/ri";
import { MdAddPhotoAlternate, MdMessage, MdDirections } from "react-icons/md";
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../../firebase';
import Modal from '../../components/Modal/Modal';

const Drawer = ({ isOpen, onClose, selectedStation, nearbyLocations }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userCar, setUserCar] = useState("");

  const user = auth.currentUser;
  const storage = getStorage();

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (user && selectedStation) {
        const docRef = doc(db, 'favorites', `${user.uid}_${selectedStation.ID}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsFavorite(docSnap.data().isFavorite);
        }
      }
    };

    fetchFavoriteStatus();
  }, [user, selectedStation]);

  useEffect(() => {
    const fetchPhotosAndComments = async () => {
      if (selectedStation) {
        const docRef = doc(db, 'stations', `${selectedStation.ID}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPhotos(docSnap.data().photos || []);
          setComments(docSnap.data().comments || []);
        }
      }
    };

    fetchPhotosAndComments();
  }, [selectedStation]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserCar(docSnap.data().evCar || "Unknown EV Car");
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert("You must be logged in to add to favorites.");
      return;
    }
    try {
      if (user && selectedStation) {
        const docRef = doc(db, 'favorites', `${user.uid}_${selectedStation.ID}`);
        await setDoc(docRef, {
          userId: user.uid,
          stationId: selectedStation.ID,
          isFavorite: !isFavorite,
          operatorTitle: selectedStation?.OperatorInfo?.Title || "N/A",
          powerKW: selectedStation?.Connections[0]?.PowerKW || "N/A",
          address: selectedStation?.AddressInfo?.AddressLine1 || "N/A",
          status: selectedStation?.StatusType?.Title || "N/A"
        }, { merge: true });
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error updating favorite status: ", error);
    }
  };

  const handlePhotoUpload = async (event) => {
    if (!user) {
      alert("You must be logged in to upload photos.");
      return;
    }
    const files = Array.from(event.target.files);
    files.forEach(async (file) => {
      const storageRef = ref(storage, `stations/${selectedStation.ID}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress
        },
        (error) => {
          console.error('Error uploading file:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const photoData = {
            url: downloadURL,
            userId: user.uid,
            userName: user.displayName || "Anonymous",
            profilePicture: user.photoURL || "https://via.placeholder.com/150",
            timestamp: new Date().toISOString(),
          };
          setPhotos((prevPhotos) => [...prevPhotos, photoData]);
  
          const docRef = doc(db, 'stations', `${selectedStation.ID}`);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            await updateDoc(docRef, {
              photos: arrayUnion(photoData),
            });
          } else {
            await setDoc(docRef, {
              photos: [photoData],
            });
          }
        }
      );
    });
  };
  

  const getDirections = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const handlePhotoClick = (index) => {
    setSelectedPhotoIndex(index);
    setIsPhotoModalOpen(true);
  };

  const handlePrevPhoto = () => {
    setSelectedPhotoIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : photos.length - 1));
  };

  const handleNextPhoto = () => {
    setSelectedPhotoIndex((prevIndex) => (prevIndex < photos.length - 1 ? prevIndex + 1 : 0));
  };

  const handleAddComment = async () => {
    if (!user) {
      alert("You must be logged in to leave a comment.");
      return;
    }
    if (user && selectedStation) {
      const newCommentData = {
        userName: user.displayName || "Anonymous",
        profilePicture: user.photoURL || "https://via.placeholder.com/150",
        text: newComment,
        userCar: userCar,
        timestamp: new Date().toISOString(),
        userId: user.uid,
      };
  
      const docRef = doc(db, 'stations', `${selectedStation.ID}`);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          comments: arrayUnion(newCommentData),
        });
      } else {
        await setDoc(docRef, {
          comments: [newCommentData],
        });
      }
  
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment("");
      setIsCommentModalOpen(false);
    }
  };
  

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      ></motion.div>
      <motion.div
        className="fixed inset-y-0 left-0 w-[400px] bg-[#131313] shadow-lg z-50 overflow-y-auto"
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-4 bg-[#131313] text-white">
          <h2 className="text-xl font-bold text-slate-300">Station Info</h2>
          <button onClick={onClose} className="text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Charging Station Picture */}
        <div className='w-full h-[140px] relative'>
          <img
            src="https://images.unsplash.com/photo-1707341597123-c53bbb7e7f93?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXYlMjBzdGF0aW9ufGVufDB8fDB8fHww"
            alt="Station"
            className="w-full h-[200px] object-cover"
          />
          <button onClick={handleFavoriteToggle} className="absolute top-4 right-4 text-red-600" style={{ backgroundColor: "transparent", border: "none" }}>
            {isFavorite ? <FaHeart size={30} /> : <FaRegHeart size={30} />}
          </button>
        </div>
        {/* Station Info Card Container */}
        <div className="w-full h-auto flex justify-center">
          <div className="w-[374px] h-auto translate-y-[-15px] bg-zinc-800/70 backdrop-blur-sm rounded-2xl p-4 text-slate-300">
            {/* Card Content */}
            <div className="w-full flex flex-col justify-between">
              {/* Electric Company and kW offered Container */}
              <div className="flex flex-wrap gap-4 items-center pt-4 pb-4">
                <Link to={selectedStation?.OperatorInfo?.WebsiteURL || "N/A"}>
                  <h4 className='text-[12px] font-light text-slate-300/90  rounded-xl w-auto h-auto p-2 px-4 bg-slate-600/80'>{selectedStation?.OperatorInfo?.Title || "N/A"}</h4>
                </Link>
              {/* Types of Charges Container */}
                <h4 className='text-[12px] font-light rounded-xl p-2 bg-teal-700 px-4'>
                  {selectedStation?.Connections?.map(
                    (conn) => conn.ConnectionType?.Title
                  ).join(", ")}
                </h4>
                  
              </div>
              {/* Selected Station Container */}
              <div className=''>
                <h2 className="text-3xl font-semibold text-center text-slate-100">
                  {selectedStation?.AddressInfo?.Title}
                </h2>
              </div>
              {/* Electric Company and kW offered Container */}
              <div className="flex flex-wrap gap-4 items-center pt-4">
                
              {/* Types of Charges Container */}
          
                  <h4 className='text-[14px] font-light text-slate-300/90 ' >{selectedStation?.Connections[0]?.PowerKW || "N/A"} kW</h4>
              </div>
              
            </div>
          </div>
        </div>
        {/* Get Directions Icon */}
        <div className='px-5 text-[12px]'>
          <button
            onClick={() =>
              getDirections(
                selectedStation.AddressInfo.Latitude,
                selectedStation.AddressInfo.Longitude
              )
            }
            className="mt-1 p-3 py-2 bg-blue-500 text-white rounded-xl flex justify-center gap-2 items-center"
          >
            Get Directions
            <MdDirections />
          </button>
        </div>
        {/* More Station Info Container */}
        <div className='w-full h-auto px-5 mt-5'>
          <h3 className='font-bold text-[18px] text-slate-300'>Location Information</h3>
          {/* Address */}
          <div className='flex gap-4 items-center p-2'>
            <IoLocationOutline className='w-5 h-5 text-slate-300/90' />
            <span className='font-light text-[14px] translate-y-[3px] text-slate-300/90'>Address: {selectedStation?.AddressInfo?.AddressLine1 || "N/A"}</span>
          </div>
          {/* Access */}
          <div className='flex gap-4 items-center p-2'>
            <FaMapMarkerAlt className='w-5 h-5 text-slate-300/90' />
            <span className='font-light text-[14px] translate-y-[3px] text-slate-300/90'>Access: {selectedStation?.AddressInfo?.AccessComments || "N/A"}</span>
          </div>
          {/* Telephone */}
          <div className='flex gap-4 items-center p-2'>
            <FaPhone className='w-5 h-5 text-slate-300/90' />
            <span className='font-light text-[14px] translate-y-[3px] text-slate-300/90'>Telephone: {selectedStation?.AddressInfo?.ContactTelephone1 || "N/A"}</span>
          </div>
         
        </div>

        {/* Plug Info Container */}
        <div className='w-full h-auto px-5 mt-5'>
          <h3 className='font-bold text-[18px] text-slate-300'>Plug Information</h3>
          {/* Charging Type */}
          <div className='flex gap-4 items-center p-2'>
            <FaPlug className='w-5 h-5 text-slate-300/90' />
            <span className='font-light text-[14px] translate-y-[3px] text-slate-300/90'>Charging Type: {selectedStation?.Connections?.map(
              (conn) => conn.ConnectionType?.Title
            ).join(", ") || "N/A"}</span>
          </div>
          {/* Price */}
          <div className='flex gap-4 items-center p-2'>
            <FaDollarSign className='w-5 h-5 text-slate-300/90' />
            <span className='font-light text-[14px] translate-y-[3px] text-slate-300/90'>Price: {selectedStation?.UsageCost || "N/A"}</span>
          </div>
          {/* Status */}
          <div className='flex gap-4 items-center p-2'>
            <FaMapMarkerAlt className='w-5 h-5 text-slate-300/90' />
            <span className='font-light text-[14px] translate-y-[3px] text-slate-300/90'>Status: {selectedStation?.StatusType?.Title || "N/A"}</span>
          </div>
          {/* Charging Stations */}
          <div className='flex gap-4 items-center p-2'>
            <FaChargingStation
            className='w-5 h-5 text-slate-300/90 translate-x-1' />
            <span className='font-light text-[14px] translate-y-[3px] text-slate-300/90'>Charging Stations: {selectedStation?.Connections?.length || "N/A"}</span>
          </div>
        </div>

        {/* Nearby Locations Container */}
        <div className='w-full h-auto px-5 mt-5'>
          <h3 className='font-bold text-[18px] text-slate-300'>Nearby Locations</h3>
          {nearbyLocations.length > 0 ? (
            nearbyLocations.map((location, index) => (
              <div key={index} className='flex gap-4 items-center p-2'>
                <FaMapMarkerAlt className='w-5 h-5 translate-y-[-11px] text-slate-300/90' />
                <div className='flex flex-col'>
                  <span className='font-semibold text-[14px] translate-y-[3px] text-slate-300'>Address: {location.AddressInfo.AddressLine1}</span>
                  <span className='font-light text-[14px] translate-y-[3px] text-slate-300/90'>{location.AddressInfo.Title}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-300/90">No nearby locations available.</p>
          )}
        </div>

        {/* Photos */}
        <div className='w-full h-[200px] px-5 mt-5'>
          <div className='flex justify-between items-center'>
            <h3 className='font-bold text-slate-300'>Photos</h3>
            {user ? (
              <label className="cursor-pointer text-slate-300/90">
                <MdAddPhotoAlternate size={24} />
                <input type="file" className="hidden" onChange={handlePhotoUpload} />
              </label>
            ) : (
              <span className="text-slate-300/90">Log in to upload photos</span>
            )}
            {/* <span className='text-slate-300/90'>See All</span> */}
          </div>
          <div className='w-full flex gap-2 overflow-x-auto flex-grow-1 pt-5'>
            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <div
                  key={index}
                  className=' w-[120px] h-[120px] flex-shrink-0 cursor-pointer'
                  onClick={() => handlePhotoClick(index)}
                >
                  <img src={photo.url} alt={`Station Media ${index}`} className='w-full h-full object-cover rounded-xl' />
                </div>
              ))
            ) : (
              <p className="text-slate-300/90 flex justify-center w-full h-full mt-10">No photos available.</p>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className='w-full h-[300px] px-5 mt-5'>
          <div className='flex justify-between items-center'>
            <h3 className='font-bold text-slate-300'>Comments</h3>
            {user ? (
              <button
                onClick={() => setIsCommentModalOpen(true)}
                className="text-slate-300"
              >
                <MdMessage size={20} />
              </button>
            ) : (
              <span className="text-slate-300/90">Log in to leave a comment</span>
            )}
          </div>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className='w-full h-auto flex p-2 mb-2'>
                <div className='w-[70px] h-[60px] rounded-full overflow-hidden mt-4'>
                  <img src={comment.profilePicture} alt="Profile" className='w-full h-full object-cover' />
                </div>
                <div className='w-full h-auto text-white p-2 rounded-lg mt-4'>
                  <div className='flex justify-between'>
                    <p className='font-semibold'>{comment.userName}</p>
                    <p>{new Date(comment.timestamp).toLocaleString()}</p>
                  </div>
                  <p>{comment.userCar}</p>
                  <p className='text-[14px]'>{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-300/90 flex justify-center w-full h-full mt-10">No comments available.</p>
          )}
        </div>
      </motion.div>
      <Modal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)}>
        <div className="flex justify-center items-center w-full h-full relative">
          <button
            onClick={handlePrevPhoto}
            className="absolute w-10 h-10 left-0 top-1/2 transform -translate-y-1/2 bg-blue-500/50 hover:bg-blue-700/80 text-white rounded-full p-2"
          >
            &lt;
          </button>
          <img src={photos[selectedPhotoIndex]?.url} alt="Selected" className="w-[750px] h-auto rounded-lg max-w-full max-h-full" />
          <button
            onClick={handleNextPhoto}
            className="absolute w-10 h-10 right-0 top-1/2 transform -translate-y-1/2 bg-blue-500/50 hover:bg-blue-700/80 text-white rounded-full p-2"
          >
            &gt;
          </button>
        </div>
      </Modal>
      <Modal isOpen={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} width='853px' height='300px'>
        {user ? (
          <>
          <h2 className='text-2xl text-zinc-300'>Station: {selectedStation?.AddressInfo?.Title}</h2>
            <div className="flex items-center p-4 bg-[#131313] rounded-lg">
              <div className="w-[60px] h-[60px] rounded-full border overflow-hidden mr-4">
                <img src={user?.photoURL || "https://via.placeholder.com/150"} alt="Profile" className='w-full h-full object-cover' />
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full h-[100px] p-2 bg-zinc-800/70 rounded-lg text-white resize-none"
                placeholder="Write your comment here..."
              ></textarea>
            </div>
            <div className="flex justify-end p-4">
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-500 text-white rounded-full"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <p className="text-white p-4">You must be logged in to leave a comment.</p>
        )}
      </Modal>
    </>
  );
};

export default Drawer;
