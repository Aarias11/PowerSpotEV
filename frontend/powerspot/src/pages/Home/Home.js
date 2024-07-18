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
  const autocompleteRef = useRef(null);

  const fetchStations = async (center) => {
    if (!center) return;
    console.log("Fetching stations with center:", center);
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await axios.get("https://api.openchargemap.io/v3/poi/", {
        params: {
          key: process.env.REACT_APP_OPEN_CHARGE_API_KEY, // Replace with your OpenChargeMap API key
          latitude: center.lat,
          longitude: center.lng,
          distance: 5, // 5-mile radius
          distanceunit: "Miles",
          maxresults: 50, // Limit the number of stations to fetch
        },
      });
      console.log("Stations response:", response.data);
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
    }
  };

  const fetchCity = async (lat, lng) => {
    console.log("Fetching city with coordinates:", lat, lng);
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
      console.log("City name:", cityName);
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
          key: process.env.REACT_APP_OPEN_CHARGE_API_KEY, // Replace with your OpenChargeMap API key
          latitude,
          longitude,
          distance: 5, // 5-mile radius
          distanceunit: "Miles",
          maxresults: 5, // Limit the number of stations to fetch
        },
      });
      console.log("Nearby locations response:", response.data);
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
      if (place.geometry) {
        const { lat, lng } = place.geometry.location;
        const location = { lat: lat(), lng: lng() };
        setSearchedLocation(location); // Set the searched location
        map.panTo(location);
        map.setZoom(15); // Adjust the zoom level as needed
        fetchStations(location);
        fetchCity(lat(), lng());
      }
    }
  };

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

  useEffect(() => {
    // Fetch user's current location and set as map center
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSearchedLocation({ lat: latitude, lng: longitude });
          fetchStations({ lat: latitude, lng: longitude });
          fetchCity(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
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
          className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[480px] bg-white rounded-full shadow-lg z-40 flex items-center opacity-95"
        >
          <Autocomplete
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a location..."
              className="w-full border-none outline-none rounded-full px-4 py-2"
            />
          </Autocomplete>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-400 h-[39px] text-black rounded-full ml-2 flex items-center justify-center absolute right-0"
          >
            <FaSearch />
          </button>
        </form>
        {/* City Display */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[480px] bg-white rounded-full shadow-lg z-40 flex items-center justify-center opacity-95 py-2">
          <p className="text-lg font-semibold">{city}</p>
        </div>
        {searchedLocation && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={searchedLocation}
            zoom={15} // Zoom in if there's a searched location
            onLoad={(map) => setMap(map)}
            onIdle={handleIdle}
          >
            <Marker
              position={searchedLocation}
              icon={{
                url: "https://img.icons8.com/?size=100&id=43731&format=png&color=FA5252", // Location Icon
                scaledSize: new window.google.maps.Size(32, 32),
              }}
            />
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
                      : "https://img.icons8.com/?size=100&id=7880&format=png&color=FA5252", // Location Icon
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
                <div>
                  <img
                    src="https://via.placeholder.com/100"
                    alt="Station"
                    className="w-full"
                  />
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
        )}
      </div>
      <Drawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        selectedStation={selectedStation}
        nearbyLocations={nearbyLocations}
      />
    </LoadScript>
  );
};

export default Home;
