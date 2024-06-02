import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

export const ShowDialog = ({ isOpen, setIsOpen, error, setError }) => {
  return (
    <>
      {/* Other component markup */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            {error}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ShowDialog;
