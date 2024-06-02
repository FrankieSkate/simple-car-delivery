import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";
import styled from "styled-components";
import AddressForm from "./AddressForm";
import { GLOBAL_COLOR } from "./constants/GlobalStyles";
import { submitRoute, getRoute } from "../hooks/mockApi";
import { ERROR_ON_FETCH } from "../utils/errors";
import { errorMessages } from "../utils/errorMessages";
import ShowDialog from "./ShowDialog";
import { getAddress } from "../hooks/openStreetMapApi";

const FullScreenMapContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
`;

const FormContainer = styled.div`
  width: 20%;
  /* padding: 20px; */
`;

const MapContainer = styled.div`
  width: 80%;
  height: 100%;
`;

const containerStyle = {
  width: "100%",
  height: "100%",
};

const LocateButton = styled.button`
  position: absolute;
  bottom: 2rem;
  right: 5rem;
  padding: 10px 20px;
  background-color: ${GLOBAL_COLOR.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 5;
`;

const Map = () => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const mapRef = useRef(null);
  const [mapKey, setMapKey] = useState(0);
  const [apiRoute, setApiRoute] = useState({});
  const [error, setError] = useState(null);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [wayPoints, setWayPoints] = useState([]);

  const handleReset = () => {
    setDirectionsResponse(null);
    setStart(null);
    setEnd(null);
    setWayPoints([]);
    setCurrentPosition(null);
    setMapKey(prevKey => prevKey + 1); // Optional: force a re-render if needed
  };

  const handleFormSubmit = async ({ pickup, dropoff }) => {
    handleReset();

    pickup = typeof pickup === "string" ? pickup : pickup.label;
    dropoff = typeof dropoff === "string" ? dropoff : dropoff.label;

    setDirectionsResponse(null);
    setStart(pickup);
    setEnd(dropoff);
    setMapKey(prevKey => prevKey + 1);

    let routeToken;
    try {
      routeToken = await submitRoute(pickup, dropoff);
    } catch (error) {
      setError(errorMessages.route.submit + error.message);
      setOpenErrorDialog(true);
      // throw new ERROR_ON_SUBMIT(errorMessages.route.submit);
    }
    try {
      if (routeToken) {
        const returnRoute = await getRouteAndRetry(routeToken);
        setApiRoute(returnRoute);
      }
    } catch (error) {
      setError(errorMessages.route.get);
      setOpenErrorDialog(true);
      // throw new ERROR_ON_GET(errorMessages.route.get);
    }
  };

  const getRouteAndRetry = async routeToken => {
    try {
      let returnRoute = await getRoute(routeToken);
      // retry the getting route when busy
      while (returnRoute.status === "in progress") {
        returnRoute = await getRoute(routeToken);
      }
      if (returnRoute.status === "failure") {
        setError(errorMessages.route.get + error.message);
        setOpenErrorDialog(true);
      }
      return returnRoute;
    } catch (error) {
      setError(errorMessages.route.get);
      setOpenErrorDialog(true);
      // throw new ERROR_ON_GET(errorMessages.route.get);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          if (mapRef.current) {
            mapRef.current.panTo({ lat: latitude, lng: longitude });
            mapRef.current.setZoom(16);
          }
        },
        error => {
          setError(errorMessages.geolocation.get);
          setOpenErrorDialog(true);
          // throw new ERROR_ON_FETCH(errorMessages.geolocation.get);
        }
      );
    } else {
      alert(errorMessages.geolocation.notSupported);
    }
  };

  const handleRouteAddresses = async apiRoute => {
    if (apiRoute && apiRoute.status === "success") {
      try {
        // Map all coordinate pairs to address lookups
        const addressPromises = apiRoute.path.map(([lat, lon]) =>
          getAddress(lat, lon)
        );

        const addresses = await Promise.all(addressPromises);
        return addresses;
      } catch (error) {
        setError(errorMessages.address.get);
        setOpenErrorDialog(true);
      }
    }
  };

  useEffect(() => {
    if (apiRoute && apiRoute.path) {
      const fetchWayPoints = async () => {
        const addresses = await handleRouteAddresses(apiRoute);
        const newWayPoints = addresses.map(address => ({
          location: address.address,
          stopover: true,
        }));
        setWayPoints(newWayPoints);
      };
      fetchWayPoints();
    }
  }, [apiRoute]);

  useEffect(() => {
    setDirectionsResponse(null);
    if (start && end && wayPoints.length > 0 && window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: start,
          destination: end,
          waypoints: wayPoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            setError(errorMessages.directions.fetch);
            setOpenErrorDialog(true);
          }
        }
      );
    }
  }, [start, end, wayPoints, mapKey]); // Depend on wayPoints to re-run when waypoints change

  return (
    <FullScreenMapContainer>
      <FormContainer>
        <AddressForm
          onSubmit={handleFormSubmit}
          currentPosition={currentPosition}
          handleReset={handleReset}
        />
      </FormContainer>
      <MapContainer>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        >
          <GoogleMap
            key={mapKey}
            mapContainerStyle={containerStyle}
            center={currentPosition || { lat: 22.29361, lng: 114.17101 }}
            zoom={16}
            onLoad={map => (mapRef.current = map)}
          >
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
            {currentPosition && <Marker position={currentPosition} />}
          </GoogleMap>
          <LocateButton onClick={handleLocateMe}>Locate Me</LocateButton>
        </LoadScript>
      </MapContainer>
      <ShowDialog
        isOpen={openErrorDialog}
        setIsOpen={setOpenErrorDialog}
        error={error}
        setError={setError}
      />
    </FullScreenMapContainer>
  );
};

export default Map;
