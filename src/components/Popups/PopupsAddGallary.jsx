import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  Input,
  Typography,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import ButtonSubmit from "../Buttons/ButtonSubmit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PopupsAddGallary({ open, setOpen, onClose, onSuccess }) {
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Please select an image to upload");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:5000/api/gallery/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Image uploaded successfully");
        setImageFile(null);
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (err) {
      toast.error("Upload failed");
      console.error(err);
    }
  };

  return (
    <div>
      <ButtonSubmit name="  + Add New Image  " onClick={() => setOpen(true)} />
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Upload New Image
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <IoMdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <Typography variant="body1">Select an image:</Typography>
            <Input type="file" name="image" onChange={handleFileChange} />
            <Button type="submit" variant="contained" color="primary">
              Upload Image
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PopupsAddGallary;
