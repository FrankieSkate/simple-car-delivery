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
import { ERROR_ON_SUBMIT, ERROR_ON_GET, ERROR_ON_FETCH } from "../utils/errors";
import { errorMessages } from "../utils/errorMessages";
import ShowDialog from "./ShowDialog";

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
  const [route, setRoute] = useState(null);

  const handleFormSubmit = async ({ pickup, dropoff }) => {
    if (typeof pickup !== "string") {
      pickup = pickup.label;
    }
    if (typeof dropoff !== "string") {
      dropoff = dropoff.label;
    }

    setDirectionsResponse(null);
    setStart(pickup);
    setEnd(dropoff);
    setMapKey(prevKey => prevKey + 1);

    let routeToken;
    try {
      routeToken = await submitRoute(pickup, dropoff);
    } catch (error) {
      throw new ERROR_ON_SUBMIT(errorMessages.route.submit);
    }
    try {
      if (routeToken) {
        const returnRoute = await getRouteAndRetry(routeToken);
        setRoute(returnRoute);
      }
    } catch (error) {
      setRoute(errorMessages.route.get + error.message);
      throw new ERROR_ON_GET(errorMessages.route.get);
    }
  };

  const getRouteAndRetry = async routeToken => {
    try {
      let returnRoute = await getRoute(routeToken);

      // retry the getting route when busy
      while (returnRoute.status === "in progress") {
        returnRoute = await getRoute(routeToken);
      }
      return returnRoute;
    } catch (error) {
      setRoute(errorMessages.route.get + error.message);
      throw new ERROR_ON_GET(errorMessages.route.get);
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
          setRoute(errorMessages.geolocation.get + error.message);
          throw new ERROR_ON_FETCH(errorMessages.geolocation.get);
        }
      );
    } else {
      alert(errorMessages.geolocation.notSupported);
    }
  };

  useEffect(() => {
    if (start && end && window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: start,
          destination: end,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            setRoute(errorMessages.directions.fetch);
            throw new ERROR_ON_FETCH(errorMessages.directions.fetch);
          }
        }
      );
    }
  }, [start, end, mapKey]);

  return (
    <FullScreenMapContainer>
      <FormContainer>
        <AddressForm
          onSubmit={handleFormSubmit}
          currentPosition={currentPosition}
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
      <ShowDialog error={route?.error} setError={setRoute} />
    </FullScreenMapContainer>
  );
};

export default Map;
