import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AddressForm from "../components/AddressForm";
import Map from "../components/Map";
import { GLOBAL_COLOR } from "../components/constants/GlobalStyles";
import "leaflet/dist/leaflet.css";

const HomeWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  font-size: 24px;
`;

const LeftScreen = styled.div`
  width: 30%;
  height: 100%;
  background-color: ${GLOBAL_COLOR.background};
  color: ${GLOBAL_COLOR.dark};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightScreen = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Home = () => {
  const [route, setRoute] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState([51.505, -0.09]);

  const handleFormSubmit = ({ pickup, dropoff }) => {
    const [startLat, startLng] = pickup.split(",").map(Number);
    const [endLat, endLng] = dropoff.split(",").map(Number);

    setMarkers([
      [startLat, startLng],
      [endLat, endLng],
    ]);
    setRoute([
      [startLat, startLng],
      [endLat, endLng],
    ]);
    setCenter([startLat, startLng]);
  };

  return (
    <HomeWrapper>
      <LeftScreen>
        <AddressForm onSubmit={handleFormSubmit} />
      </LeftScreen>
      <RightScreen>
        <Map center={center} markers={markers} route={route} />
      </RightScreen>
    </HomeWrapper>
  );
};

export default Home;
