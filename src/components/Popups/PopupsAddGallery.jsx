import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import ButtonSubmit from "../Buttons/ButtonSubmit";
import axios from "../../api/axiosInstance";
import { toast } from "react-toastify";

function PopupsAddGallery({ open, setOpen, onSuccess, isEdit = false, imageData = null }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && imageData) {
      setPreview(imageData.imageUrl);
    } else {
      setPreview(null);
      setSelectedFile(null);
    }
  }, [isEdit, imageData, open]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile && !isEdit) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      let response;
      if (isEdit && imageData?._id) {
        response = await axios.put(`dashboard/gallery/${imageData._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Image updated successfully");
      } else {
        response = await axios.post("/dashboard/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Image uploaded successfully");
      }

      if (onSuccess) onSuccess();
      setOpen(false);
      setSelectedFile(null);
      setPreview(null);
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full">
        <ButtonSubmit
          name={isEdit ? "Edit Image" : "+ Add New Image"}
          onClick={() => setOpen(true)}
        />
      </div>
      
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {isEdit ? "Edit Image" : "Add New Image"}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <IoMdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {isEdit ? "Select New Image (optional)" : "Select Image"}
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!isEdit}
              />
              {preview && (
                <Box mt={2}>
                  <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }} />
                </Box>
              )}
            </Box>
            
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? "Processing..." : (isEdit ? "Update Image" : "Upload Image")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PopupsAddGallery;