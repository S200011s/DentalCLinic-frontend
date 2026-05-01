import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

const CancelModal = ({ open, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setErrorMessage("Please enter a cancellation reason.");
      return;
    }

    try {
      await onSubmit(reason); // ممكن ترجع رمية خطأ
      setReason("");
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Something went wrong.");
    }
  };

  const handleClose = () => {
    setReason("");
    setErrorMessage("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Cancel Appointment</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Cancellation Reason"
          type="text"
          fullWidth
          multiline
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        {errorMessage && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
        <Button onClick={handleSubmit} color="error" variant="contained">
          Cancel Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelModal;
