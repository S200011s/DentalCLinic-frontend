import { useEffect, useState } from "react";
import {
  Box,
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
  Grid,
  CircularProgress,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import ButtonSubmit from "../Buttons/ButtonSubmit";
import axios from "../../api/axiosInstance";
import { toast } from "react-toastify";

const allSpecializations = [
  "Dentist",
  "Orthodontist",
  "Surgeon",
  "Neurologist",
  "Cardiologist",
  "Pediatrician",
  "Dermatologist",
  "Ophthalmologist",
];

const allCertifications = ["MBBS", "PhD", "FRCS", "DDS", "MD", "Board Certified"];

const allDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function PopupsAddDoctors({
  open,
  setOpen,
  isEdit = false,
  doctorData = null,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    specialization: [],
    experience: "",
    certifications: [],
    bio: "",
    availableTimes: [],
    profileImage: null,
    workImages: [],
    services: [],
  });

  const [allServices, setAllServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [existingProfileImage, setExistingProfileImage] = useState(null);
  const [existingWorkImages, setExistingWorkImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailableTimeChange = (index, field, value) => {
    const updatedTimes = [...formData.availableTimes];
    updatedTimes[index] = {
      ...updatedTimes[index],
      [field]: value,
      slots: updatedTimes[index].slots || [{ from: "", to: "" }],
    };
    setFormData((prev) => ({ ...prev, availableTimes: updatedTimes }));
  };

  const handleSlotChange = (dayIndex, slotIndex, field, value) => {
    const updatedTimes = [...formData.availableTimes];
    updatedTimes[dayIndex].slots[slotIndex][field] = value;
    setFormData((prev) => ({ ...prev, availableTimes: updatedTimes }));
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get("/services?limit=1000");
        setAllServices(data.services || []);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  const addAvailableDay = () => {
    setFormData((prev) => ({
      ...prev,
      availableTimes: [
        ...prev.availableTimes,
        { day: "", slots: [{ from: "", to: "" }] },
      ],
    }));
  };

  const addSlotToDay = (dayIndex) => {
    const updatedTimes = [...formData.availableTimes];
    updatedTimes[dayIndex].slots.push({ from: "", to: "" });
    setFormData((prev) => ({ ...prev, availableTimes: updatedTimes }));
  };

  const removeSlot = (dayIndex, slotIndex) => {
    const updatedTimes = [...formData.availableTimes];
    updatedTimes[dayIndex].slots.splice(slotIndex, 1);
    setFormData((prev) => ({ ...prev, availableTimes: updatedTimes }));
  };

  const removeDay = (dayIndex) => {
    const updatedTimes = [...formData.availableTimes];
    updatedTimes.splice(dayIndex, 1);
    setFormData((prev) => ({ ...prev, availableTimes: updatedTimes }));
  };
useEffect(() => {
  if (isEdit && doctorData) {
    console.log("Loading doctor data for edit:", doctorData);
    
    let cleanAvailableTimes = [];
    if (doctorData.availableTimes && doctorData.availableTimes.length > 0) {
      cleanAvailableTimes = doctorData.availableTimes.map(day => ({
        day: day.day,
        slots: (day.slots || []).map(slot => ({
          from: slot.from,
          to: slot.to
        }))
      }));
    }
    
    setFormData({
      firstName: doctorData.firstName || "",
      lastName: doctorData.lastName || "",
      specialization: doctorData.specialization || [],
      experience: doctorData.experience || "",
      certifications: doctorData.certifications || [],
      bio: doctorData.bio || "",
      availableTimes: cleanAvailableTimes, 
      profileImage: null,
      workImages: [],
      services: doctorData.services?.map((s) => (typeof s === "object" ? s._id : s)) || [],
    });
    
    setExistingProfileImage(doctorData.profileImage || null);
    setExistingWorkImages(doctorData.workImages || []);
  }
}, [isEdit, doctorData, open]);

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.firstName?.trim()) {
    toast.error("First name is required");
    return;
  }
  if (!formData.lastName?.trim()) {
    toast.error("Last name is required");
    return;
  }
  if (!formData.experience) {
    toast.error("Experience is required");
    return;
  }
  if (!formData.bio?.trim()) {
    toast.error("Bio is required");
    return;
  }
  if (!formData.specialization || formData.specialization.length === 0) {
    toast.error("At least one specialization is required");
    return;
  }
  if (!formData.certifications || formData.certifications.length === 0) {
    toast.error("At least one certification is required");
    return;
  }
  
  if (!isEdit) {
    if (!formData.profileImage) {
      toast.error("Profile image is required");
      return;
    }
    if (!formData.workImages || formData.workImages.length === 0) {
      toast.error("At least one work image is required");
      return;
    }
  }

  setSubmitting(true);
  
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("firstName", formData.firstName.trim());
    formDataToSend.append("lastName", formData.lastName.trim());
    if (!isEdit) {
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("password", formData.password);
    }
    formDataToSend.append("experience", String(formData.experience));
    formDataToSend.append("bio", formData.bio.trim());

    if (formData.specialization && formData.specialization.length > 0) {
      formData.specialization.forEach((item) => {
        if (item && item.trim()) {
          formDataToSend.append("specialization", item.trim());
        }
      });
    }

  
    if (formData.certifications && formData.certifications.length > 0) {
      formData.certifications.forEach((item) => {
        if (item && item.trim()) {
          formDataToSend.append("certifications", item.trim());
        }
      });
    }
    
   
    if (formData.services && formData.services.length > 0) {
      formData.services.forEach((id) => {
        if (id) formDataToSend.append("services", id);
      });
    }

    if (formData.availableTimes && formData.availableTimes.length > 0) {
      const cleanAvailableTimes = formData.availableTimes
        .map(day => ({
          day: day.day,
          slots: (day.slots || [])
            .filter(slot => slot.from && slot.to) 
            .map(slot => ({
              from: slot.from,
              to: slot.to
              
            }))
        }))
        .filter(day => day.day && day.slots.length > 0); 
      
      if (cleanAvailableTimes.length > 0) {
        formDataToSend.append("availableTimes", JSON.stringify(cleanAvailableTimes));
        console.log("📅 Clean availableTimes:", cleanAvailableTimes);
      }
    }

    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }

    if (formData.workImages && formData.workImages.length > 0) {
      formData.workImages.forEach((file) => {
        if (file) formDataToSend.append("workImages", file);
      });
    }

    let url = "/dashboard/doctors";
    let method = "post";
    
    if (isEdit) {
      if (!doctorData?._id) {
        toast.error("Doctor ID is missing");
        return;
      }
      url = `/dashboard/doctors/${doctorData._id}`;
      method = "put";
    }

    console.log(`📤 Sending ${method.toUpperCase()} request to:`, url);
    console.log("Doctor ID:", doctorData?._id);
    console.log("FormData contents:");
    for (let pair of formDataToSend.entries()) {
      console.log(`  ${pair[0]}:`, pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1]);
    }

    const response = await axios({
      method,
      url,
      data: formDataToSend,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Success response:", response.data);

    toast.success(
      isEdit ? "Doctor updated successfully" : "Doctor created successfully"
    );
    
    if (onSuccess) onSuccess();
    setOpen(false);
    
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      specialization: [],
      experience: "",
      certifications: [],
      bio: "",
      availableTimes: [],
      profileImage: null,
      workImages: [],
      services: [],
    });
    setExistingProfileImage(null);
    setExistingWorkImages([]);
    
  } catch (error) {
    console.error("❌ Error details:", error.response?.data || error.message);
    
    if (error.response?.data?.errors) {
      const serverErrors = error.response.data.errors;
      if (Array.isArray(serverErrors)) {
        toast.error(serverErrors.map((e) => e.message).join(" | "));
      } else if (typeof serverErrors === 'object') {
        const messages = Object.values(serverErrors).flat();
        toast.error(messages.join(" | "));
      } else {
        toast.error(String(serverErrors));
      }
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error(error.message || "Error submitting doctor");
    }
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div>
      <div className="w-full">
        <ButtonSubmit
          name={"  + Add new Doctor  "}
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
          {isEdit ? "Edit Doctor" : "Add New Doctor"}
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
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>

            {!isEdit && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Login Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}

            <FormControl fullWidth required>
              <InputLabel>Specializations</InputLabel>
              <Select
                multiple
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                input={<OutlinedInput label="Specializations" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {allSpecializations.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    <Checkbox checked={formData.specialization.includes(spec)} />
                    <ListItemText primary={spec} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Experience (Years)"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleChange}
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Certifications</InputLabel>
              <Select
                multiple
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                input={<OutlinedInput label="Certifications" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {allCertifications.map((cert) => (
                  <MenuItem key={cert} value={cert}>
                    <Checkbox checked={formData.certifications.includes(cert)} />
                    <ListItemText primary={cert} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Services (Optional)</InputLabel>
              <Select
                multiple
                name="services"
                value={formData.services}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, services: e.target.value }))
                }
                input={<OutlinedInput label="Services" />}
                renderValue={(selected) => {
                  if (selected.length === 0) return "No services selected";
                  return selected
                    .map((id) => {
                      const service = allServices.find((s) => s._id === id);
                      return service ? service.name : id;
                    })
                    .join(", ");
                }}
              >
                {allServices.map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    <Checkbox checked={formData.services.includes(service._id)} />
                    <ListItemText primary={service.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              multiline
              rows={3}
              required
            />

            <Box>
              <Typography variant="subtitle1" mt={2}>
                Profile Image {!isEdit && "(Required)"}
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    profileImage: e.target.files[0],
                  }))
                }
              />
              {isEdit && existingProfileImage && !formData.profileImage && (
                <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                  Current image will be kept. Select a new file to change.
                </Typography>
              )}

              <Typography variant="subtitle1" mt={2}>
                Work Images {!isEdit && "(Required)"}
              </Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workImages: Array.from(e.target.files),
                  }))
                }
              />
              {isEdit && existingWorkImages.length > 0 && formData.workImages.length === 0 && (
                <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                  {existingWorkImages.length} existing image(s) will be kept. Select new files to replace all.
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="h6" mb={1}>
                Available Times
              </Typography>
              {formData.availableTimes.map((day, dayIndex) => (
                <Box
                  key={dayIndex}
                  mb={2}
                  p={2}
                  border="1px solid #ccc"
                  borderRadius={2}
                  position="relative"
                >
                  <IconButton
                    size="small"
                    onClick={() => removeDay(dayIndex)}
                    sx={{ position: "absolute", top: 5, right: 5 }}
                  >
                    <IoMdClose />
                  </IconButton>
                  
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel>Day</InputLabel>
                    <Select
                      value={day.day}
                      onChange={(e) =>
                        handleAvailableTimeChange(dayIndex, "day", e.target.value)
                      }
                    >
                      {allDays.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {day.slots.map((slot, slotIndex) => (
                    <Grid container spacing={2} key={slotIndex} sx={{ mb: 1 }}>
                      <Grid size={{ xs: 12, sm: 5 }}>
                        <TextField
                          label="From"
                          type="time"
                          fullWidth
                          value={slot.from}
                          onChange={(e) =>
                            handleSlotChange(dayIndex, slotIndex, "from", e.target.value)
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 5 }}>
                        <TextField
                          label="To"
                          type="time"
                          fullWidth
                          value={slot.to}
                          onChange={(e) =>
                            handleSlotChange(dayIndex, slotIndex, "to", e.target.value)
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 2 }}>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeSlot(dayIndex, slotIndex)}
                          fullWidth
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                  <Button onClick={() => addSlotToDay(dayIndex)} sx={{ mt: 1 }}>
                    + Add Slot
                  </Button>
                </Box>
              ))}
              <Button onClick={addAvailableDay}>+ Add Day</Button>
            </Box>

            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : (isEdit ? "Update Now" : "Add Now")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PopupsAddDoctors;