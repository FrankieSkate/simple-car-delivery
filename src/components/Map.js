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

  const handleFormSubmit = ({ pickup, dropoff }) => {
    if (typeof pickup !== "string") {
      pickup = pickup.label;
    }
    if (typeof dropoff !== "string") {
      dropoff = dropoff.label;
    }

    setDirectionsResponse(null);
    setStart(pickup);
    setEnd(dropoff);
    setMapKey(mapKey + 1);
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
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
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
            console.error(`error fetching directions ${result}`);
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
    </FullScreenMapContainer>
  );
};

export default Map;
