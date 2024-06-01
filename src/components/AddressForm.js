import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TextField, Button, Grid, Autocomplete } from "@mui/material";
import { GLOBAL_COLOR } from "./constants/GlobalStyles";
import { getAddress, getSuggestions } from "../hooks/openStreetMapApi";

const FormWrapper = styled.div`
  margin-top: 5rem;
  padding: 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin: 10px;
  background-color: ${GLOBAL_COLOR.primary};
  color: ${GLOBAL_COLOR.white};
  &:hover {
    background-color: ${GLOBAL_COLOR.dark};
  }
`;

const AddressForm = ({ onSubmit, currentPosition }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupOptions, setPickupOptions] = useState([]);
  const [dropoffOptions, setDropoffOptions] = useState([]);

  useEffect(() => {
    const updateGeolocationToAddress = async () => {
      if (currentPosition) {
        const { lat, lng } = currentPosition;
        try {
          const { address } = await getAddress(lat, lng);
          setPickup(address);
        } catch (error) {
          console.error("Error getting address:", error);
        }
      }
    };
    updateGeolocationToAddress();
  }, [currentPosition]);

  const handleSearchChange = async (value, optionsSetter) => {
    if (value.length > 0) {
      const results = await getSuggestions(value);
      optionsSetter(results);
    }
  };

  return (
    <FormWrapper>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit({ pickup, dropoff });
        }}
      >
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <Autocomplete
              options={pickupOptions}
              value={pickup}
              onChange={(event, newValue) => {
                setPickup(newValue);
              }}
              onInputChange={(event, newInputValue) => {
                handleSearchChange(newInputValue, setPickup, setPickupOptions);
              }}
              renderInput={params => <TextField {...params} label="Pickup" />}
            />
          </Grid>
          <Grid item>
            <Autocomplete
              options={dropoffOptions}
              value={dropoff}
              onChange={newValue => {
                setDropoff(newValue);
              }}
              onInputChange={newInputValue => {
                handleSearchChange(
                  newInputValue,
                  setDropoff,
                  setDropoffOptions
                );
              }}
              renderInput={params => <TextField {...params} label="Dropoff" />}
            />
          </Grid>
          <Grid item container spacing={4} justifyContent="center">
            <Grid item>
              <StyledButton variant="contained" type="submit">
                Submit
              </StyledButton>
            </Grid>
            <Grid item>
              <StyledButton
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setPickup("");
                  setDropoff("");
                  setPickupOptions([]);
                  setDropoffOptions([]);
                }}
              >
                Reset
              </StyledButton>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </FormWrapper>
  );
};

export default AddressForm;
