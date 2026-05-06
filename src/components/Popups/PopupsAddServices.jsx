import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import ButtonSubmit from "../Buttons/ButtonSubmit";
import axios from "../../api/axiosInstance";
import { toast } from "react-toastify";

function PopupsAddServices({
  open,
  setOpen,
  isEdit = false,
  serviceData = null,
  onSuccess,
}) {
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sessions: "",
    duration: "",
    doctors: [],
    category: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!open) return;
      
      setLoading(true);
      try {
        const [doctorRes, categoryRes] = await Promise.all([
          axios.get("/doctor?limit=1000"),
          axios.get("/category"),
        ]);

        setDoctors(doctorRes.data.doctors || []);
        setCategories(categoryRes.data || []);
      } catch (error) {
        console.error("Error fetching doctors/categories", error);
        toast.error("Failed to load form options");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open]);

  useEffect(() => {
    if (isEdit && serviceData) {
      setFormData({
        name: serviceData.name || "",
        description: serviceData.description || "",
        price: serviceData.price || "",
        sessions: serviceData.sessions || "",
        duration: serviceData.duration || "",
        doctors: serviceData.doctors?.map((doc) => doc._id) || [],
        category: serviceData.category?._id || serviceData.category || "",
        image: null,
      });
      setImagePreview(serviceData.image || null);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        sessions: "",
        duration: "",
        doctors: [],
        category: "",
        image: null,
      });
      setImagePreview(null);
    }
  }, [isEdit, serviceData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (!formData.name) {
      toast.error("Service name is required");
      return;
    }
    
    if (!formData.description) {
      toast.error("Description is required");
      return;
    }
    
    if (!formData.price) {
      toast.error("Price is required");
      return;
    }
    
    if (!formData.duration) {
      toast.error("Duration is required");
      return;
    }
    
    if (!formData.category) {
      toast.error("Category is required");
      return;
    }
    
    if (!isEdit && !formData.image) {
      toast.error("Service image is required");
      return;
    }

    setSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("category", formData.category);
      
      if (formData.sessions) {
        formDataToSend.append("sessions", formData.sessions);
      }
      
      if (formData.doctors && formData.doctors.length > 0) {
        formData.doctors.forEach((doctorId) => {
          formDataToSend.append("doctors", doctorId);
        });
      }

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      console.log("Sending FormData:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const url = isEdit && serviceData?._id
        ? `/dashboard/services/${serviceData._id}`
        : "/dashboard/services";
      const method = isEdit ? "put" : "post";

      const response = await axios[method](url, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Service saved:", response.data);
      
      toast.success(
        isEdit
          ? "Service updated successfully!"
          : "Service created successfully!"
      );
      
      setOpen(false);
      if (onSuccess) onSuccess();
      
      setFormData({
        name: "",
        description: "",
        price: "",
        sessions: "",
        duration: "",
        doctors: [],
        category: "",
        image: null,
      });
      setImagePreview(null);
      
    } catch (error) {
      console.error("Error submitting service", error);
      
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        if (Array.isArray(serverErrors)) {
          toast.error(serverErrors.map((e) => e.message).join(" | "));
        } else if (typeof serverErrors === 'object') {
          const errorMessages = Object.values(serverErrors).flat().join(" | ");
          toast.error(errorMessages);
        } else {
          toast.error(serverErrors);
        }
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit service");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="w-full">
        <ButtonSubmit
          name="  + Add new Service  "
          onClick={() => setOpen(true)}
        />
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEdit ? "Edit Service" : "Add New Service"}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <IoMdClose />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <CircularProgress />
              <Typography>Loading form data...</Typography>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginTop: 16,
              }}
            >
              <TextField
                label="Service Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                required
                fullWidth
              />

              <TextField
                label="Price (EGP)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Number of Sessions"
                name="sessions"
                value={formData.sessions}
                onChange={handleChange}
                fullWidth
                placeholder="e.g., 3 sessions"
              />

              <TextField
                label="Duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                fullWidth
                placeholder="e.g., 30 min, 1 hour"
              />

              <FormControl fullWidth>
                <InputLabel>Doctors (Optional)</InputLabel>
                <Select
                  multiple
                  name="doctors"
                  value={formData.doctors}
                  onChange={handleMultiSelectChange}
                  input={<OutlinedInput label="Doctors (Optional)" />}
                  renderValue={(selected) => {
                    if (selected.length === 0) return "No doctors selected";
                    return selected
                      .map((id) => {
                        const doctor = doctors.find((doc) => doc._id === id);
                        return doctor ? `${doctor.firstName} ${doctor.lastName}` : id;
                      })
                      .join(", ");
                  }}
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor._id} value={doctor._id}>
                      <Checkbox checked={formData.doctors.includes(doctor._id)} />
                      <ListItemText 
                        primary={`${doctor.firstName} ${doctor.lastName}`} 
                        secondary={doctor.specialization?.join(", ")}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <Typography variant="subtitle2" gutterBottom>
                  Service Image {!isEdit && <span style={{ color: "red" }}>*</span>}
                </Typography>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ marginTop: "8px" }}
                />
                {imagePreview && (
                  <div style={{ marginTop: "10px" }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        width: "100px", 
                        height: "100px", 
                        objectFit: "cover",
                        borderRadius: "8px"
                      }} 
                    />
                  </div>
                )}
                {isEdit && !formData.image && serviceData?.image && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                    Current image will be kept if no new file selected
                  </Typography>
                )}
              </FormControl>

              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                disabled={submitting}
              >
                {submitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  isEdit ? "Update Service" : "Create Service"
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PopupsAddServices;