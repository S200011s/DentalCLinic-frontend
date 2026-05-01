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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [doctorRes, categoryRes] = await Promise.all([
          axios.get("/doctor?limit=1000", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/category", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDoctors(doctorRes.data.doctors || []);
        setCategories(categoryRes.data || []);
      } catch (error) {
        console.error("Error fetching doctors/categories", error);
        toast.error("Failed to load form options");
      }
    };

    fetchData();
  }, []);

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
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("sessions", formData.sessions);
    data.append("duration", formData.duration);
    data.append("category", formData.category);
    formData.doctors.forEach((docId) => data.append("doctors[]", docId));
    if (formData.image) data.append("image", formData.image);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

       formDataToSend.append("type", "service");

      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("sessions", formData.sessions);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("category", formData.category);
      formData.doctors.forEach((doctorId) =>
        formDataToSend.append("doctors[]", doctorId)
      );

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const url =
        isEdit && serviceData?._id
          ? `/services/${serviceData._id}`
          : "/services";
      const method = isEdit ? "put" : "post";

      await axios[method](url, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        isEdit
          ? "Service updated successfully!"
          : "Service created successfully!"
      );
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting service", error);
      toast.error("Failed to submit service");
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
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              required
            />

            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <TextField
              label="Number of Sessions"
              name="sessions"
              value={formData.sessions}
              onChange={handleChange}
            />

            <TextField
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Doctors</InputLabel>
              <Select
                multiple
                name="doctors"
                value={formData.doctors}
                onChange={handleMultiSelectChange}
                input={<OutlinedInput label="Doctors" />}
                renderValue={(selected) =>
                  selected
                    .map(
                      (id) =>
                        doctors.find((doc) => doc._id === id)?.userName || id
                    )
                    .join(", ")
                }
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor._id} value={doctor._id}>
                    <Checkbox checked={formData.doctors.includes(doctor._id)} />
                    <ListItemText primary={doctor.fullName} />
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
              <label htmlFor="image">Upload Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
            </FormControl>

            <Button type="submit" variant="contained" color="primary">
              {isEdit ? "Update" : "Add Now"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PopupsAddServices;
