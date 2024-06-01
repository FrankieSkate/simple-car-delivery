import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TextField, Button, Grid } from "@mui/material";
import { GLOBAL_COLOR } from "./constants/GlobalStyles";
import { getAddress } from "../hooks/openStreetMapApi";

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
            <TextField
              value={pickup}
              onChange={e => setPickup(e.target.value)}
              label="Pickup"
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              value={dropoff}
              onChange={e => setDropoff(e.target.value)}
              label="Dropoff"
              fullWidth
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
