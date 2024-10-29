import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";
import axios from "axios";
import _ from "lodash";
import Drawer from "../../components/Drawer/Drawer";
import { FaSearch, FaRegHeart, FaHeart } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import { auth, db } from '../../firebase';
import { collection, doc, getDocs, query, where, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import LoadingBar from 'react-top-loading-bar';
import { useLocation } from 'react-router-dom';

const containerStyle = {
  width: "100%",
  height: "100vh",
  position: "relative",
};

// Define the libraries array outside the component
const libraries = ['places'];

const Home = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [map, setMap] = useState(null);
  const [city, setCity] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false); // For loading indicator
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [favoriteStations, setFavoriteStations] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState(null); // State for the searched location
  const [mapLoading, setMapLoading] = useState(true); // New state for map loading
  const autocompleteRef = useRef(null);
  const loadingBarRef = useRef(null);
  const location = useLocation();
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  useEffect(() => {
    loadingBarRef.current.continuousStart();
  }, [location]);

  const fetchStations = async (center) => {
    if (!center) return;
    // console.log("Fetching stations with center:", center);
    setLoading(true); // Set loading to true when fetching starts
    loadingBarRef.current.continuousStart(); // Start the loading bar
    try {
      const response = await axios.get("https://api.openchargemap.io/v3/poi/", {
        params: {
          key: process.env.REACT_APP_OPEN_CHARGE_API_KEY, 
          latitude: center.lat,
          longitude: center.lng,
          distance: 5, // 5-mile radius
          distanceunit: "Miles",
          maxresults: 50, // Limit the number of stations to fetch
        },
      });
      // console.log("Stations response:", response.data);
      if (response.data && response.data.length > 0) {
        setStations(response.data);
      } else {
        console.warn("No stations found in response");
        setStations([]);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
      setStations([]);
    } finally {
      setLoading(false); // Set loading to false when fetching completes
      loadingBarRef.current.complete(); // Complete the loading bar
    }
  };

  const fetchCity = async (lat, lng) => {
    // console.log("Fetching city with coordinates:", lat, lng);
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            latlng: `${lat},${lng}`,
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          },
        }
      );
      const addressComponents = response.data.results[0].address_components;
      const cityComponent = addressComponents.find((component) =>
        component.types.includes("locality")
      );
      const cityName = cityComponent ? cityComponent.long_name : "";
      // console.log("City name:", cityName);
      setCity(cityName);
    } catch (error) {
      console.error("Error fetching city:", error);
      setCity("");
    }
  };

  const fetchNearbyLocations = async (latitude, longitude) => {
    try {
      const response = await axios.get("https://api.openchargemap.io/v3/poi/", {
        params: {
          key: process.env.REACT_APP_OPEN_CHARGE_API_KEY, 
          latitude,
          longitude,
          distance: 5, // 5-mile radius
          distanceunit: "Miles",
          maxresults: 5, // Limit the number of stations to fetch
        },
      });
      // console.log("Nearby locations response:", response.data);
      if (response.data && response.data.length > 0) {
        setNearbyLocations(response.data);
      } else {
        setNearbyLocations([]);
      }
    } catch (error) {
      console.error("Error fetching nearby locations:", error);
      setNearbyLocations([]);
    }
  };

  const debouncedFetchStations = useCallback(
    _.debounce(fetchStations, 1000),
    []
  );
  const debouncedFetchCity = useCallback(_.debounce(fetchCity, 1000), []);

  const handleIdle = useCallback(() => {
    if (map) {
      const center = map.getCenter();
      if (center) {
        const centerCoords = { lat: center.lat(), lng: center.lng() };
        debouncedFetchStations(centerCoords);
        debouncedFetchCity(center.lat(), center.lng());
      }
    }
  }, [map, debouncedFetchStations, debouncedFetchCity]);

  useEffect(() => {
    if (map) {
      const center = map.getCenter();
      if (center) {
        const centerCoords = { lat: center.lat(), lng: center.lng() };
        fetchStations(centerCoords);
        fetchCity(center.lat(), center.lng());
      }
    }
  }, [map]);

  useEffect(() => {
    const fetchFavoriteStations = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const favoritesCollectionRef = collection(db, 'favorites');
        const q = query(favoritesCollectionRef, where("userId", "==", user.uid));
        const favoriteStationsSnapshot = await getDocs(q);

        if (favoriteStationsSnapshot.empty) {
          console.log("No favorite stations found for the user");
          setFavoriteStations([]);
          return;
        }

        const favoriteStationsData = favoriteStationsSnapshot.docs.map(doc => doc.data());

        if (favoriteStationsData.length === 0) {
          console.log("No favorite stations found for the user");
          setFavoriteStations([]);
          return;
        }

        setFavoriteStations(favoriteStationsData);
      } catch (error) {
        console.error("Error fetching favorite stations:", error);
      }
    };

    fetchFavoriteStations();
  }, []);

  const handleToggleFavorite = async (station) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const stationDocRef = doc(db, 'favorites', `${user.uid}_${station.ID}`);
      const stationDocSnap = await getDoc(stationDocRef);

      if (stationDocSnap.exists()) {
        // If the station is already a favorite, remove it from favorites
        await deleteDoc(stationDocRef);
        setFavoriteStations(favoriteStations.filter(fav => fav.stationId !== station.ID));
      } else {
        // If the station is not a favorite, add it to favorites
        await setDoc(stationDocRef, {
          userId: user.uid,
          stationId: station.ID,
          operatorTitle: station.OperatorInfo?.Title || 'Unnamed Station',
          address: station.AddressInfo?.AddressLine1 || 'No address available',
          powerKW: station.Connections[0]?.PowerKW || 'N/A',
          status: station.StatusType?.Title || 'N/A',
          isFavorite: true
        });
        setFavoriteStations([...favoriteStations, { stationId: station.ID, isFavorite: true }]);
      }
    } catch (error) {
      console.error("Error toggling favorite status: ", error);
    }
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setSearchedLocation(location);
        if (map) {
          map.panTo(location);
          map.setZoom(15);
        }
        setSearchTerm(""); // Clear the search input
      }
    }
  };

  useEffect(() => {
    if (map && !mapLoading) {
      const center = map.getCenter();
      if (center) {
        fetchStations({ lat: center.lat(), lng: center.lng() });
        fetchCity(center.lat(), center.lng());
      }
    }
  }, [map, mapLoading]);

  const onSelect = (item) => {
    setSelectedStation(item);
    setDrawerOpen(true);
    fetchNearbyLocations(item.AddressInfo.Latitude, item.AddressInfo.Longitude);
  };

  const filteredStations = useMemo(
    () =>
      stations.filter((station) =>
        station.AddressInfo.Title.toLowerCase().includes(
          searchTerm.toLowerCase()
        )
      ),
    [stations, searchTerm]
  );

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedStation(null), 300);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setSearchedLocation(location);
          fetchStations(location);
          fetchCity(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Handle location error (e.g., default location, show message)
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Handle browser not supporting geolocation
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <>
      <LoadingBar color="#f11946" ref={loadingBarRef} />
      <LoadScript
    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
    libraries={libraries}
    onLoad={() => console.log("Google Maps API loaded successfully")}
    onError={(error) => console.error("Error loading Google Maps API:", error)}
>
{isApiLoaded && (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
        >
            {/* Markers, InfoWindows, etc. */}
        </GoogleMap>
    )}

        <div style={containerStyle}>
          {/* Loading Indicator */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-full bg-transparent flex items-center justify-center z-50">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {/* SearchBar */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-[480px] bg-white rounded-full shadow-lg z-40 flex items-center opacity-95"
          >
            <Autocomplete className="w-full"
              onLoad={(ref) => (autocompleteRef.current = ref)}
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a location"
                className="w-full border-none outline-none rounded-full px-4 py-2 bg-slate-300/70 backdrop-blur-sm"
              />
            </Autocomplete>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-400/70 h-[40px] backdrop-blur-sm text-black rounded-xl ml-2 flex items-center justify-center absolute right-0"
            >
              <FaSearch />
            </button>
          </form>
          
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={searchedLocation} // Removed defaultCenter
            zoom={searchedLocation ? 15 : 10} // Zoom in if there's a searched location
            onLoad={(map) => {
              setMap(map);
              setMapLoading(false); // Set mapLoading to false once map is loaded
              loadingBarRef.current.complete(); // Complete the loading bar
            }}
            onIdle={handleIdle}
          >
            {searchedLocation && (
              <Marker
                position={searchedLocation}
                icon={{
                  url: "https://img.icons8.com/?size=100&id=43731&format=png&color=FA5252", // Location Icon
                  scaledSize: new window.google.maps.Size(32, 32),
                }}
              />
            )}
            {filteredStations.map((station) => {
              const isFavorite = favoriteStations.some(
                (fav) => fav.stationId === station.ID
              );

              return (
                <Marker
                  key={station.ID}
                  position={{
                    lat: station.AddressInfo.Latitude,
                    lng: station.AddressInfo.Longitude,
                  }}
                  onClick={() => onSelect(station)}
                  icon={{
                    url: isFavorite
                      ? "https://img.icons8.com/?size=100&id=yUGu5KXHNq3O&format=png&color=FA5252" // Heart Icon
                      : "https://img.icons8.com/?size=100&id=NLPilHTzLqby&format=png&color=FA5252", // Location Icon
                    scaledSize: new window.google.maps.Size(32, 32),
                  }}
                />
              );
            })}

            {selectedStation && (
              <InfoWindow
                position={{
                  lat: selectedStation.AddressInfo.Latitude,
                  lng: selectedStation.AddressInfo.Longitude,
                }}
                onCloseClick={() => setSelectedStation(null)}
              >
                <div className=" flex flex-col gap-4">
                  
                  <h2>{selectedStation.AddressInfo.Title}</h2>
                  <p>
                    Connectors:{" "}
                    {selectedStation.Connections.map(
                      (conn) => conn.ConnectionType.Title
                    ).join(", ")}
                  </p>
                  <button onClick={() => handleToggleFavorite(selectedStation)}>
                    {favoriteStations.some(
                      (fav) => fav.stationId === selectedStation.ID
                    ) ? (
                      <FaHeart size={20} className="text-red-500" />
                    ) : (
                      <FaRegHeart size={20} className="text-gray-500" />
                    )}
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
        <Drawer
          isOpen={drawerOpen}
          onClose={closeDrawer}
          selectedStation={selectedStation}
          nearbyLocations={nearbyLocations}
        />
      </LoadScript>
    </>
  );
};

export default Home;
