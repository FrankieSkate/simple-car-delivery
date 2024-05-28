import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TextField, Button, Grid } from "@mui/material";
import { GLOBAL_COLOR } from "./constants/GlobalStyles";

const FormWrapper = styled.div`
  margin: 2rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  margin: 10px;
  background-color: ${GLOBAL_COLOR.primary};
  color: ${GLOBAL_COLOR.white};

  &:hover {
    background-color: ${GLOBAL_COLOR.dark};
  }
`;

const AddressForm = ({ onSubmit }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setPickup(`${latitude}, ${longitude}`);
        },
        error => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ pickup, dropoff });
  };

  const handleReset = () => {
    setPickup("");
    setDropoff("");
  };

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <StyledTextField
              label="Starting location"
              variant="outlined"
              fullWidth
              value={pickup}
              onChange={e => setPickup(e.target.value)}
            />
          </Grid>
          <Grid item>
            <StyledTextField
              label="Drop-off point"
              variant="outlined"
              fullWidth
              value={dropoff}
              onChange={e => setDropoff(e.target.value)}
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
                onClick={handleReset}
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
