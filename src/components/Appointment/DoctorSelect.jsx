import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "../../api/axiosInstance";

const DoctorSelect = ({
  selectedService,
  selectedDoctor,
  setSelectedDoctor,
}) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // If no service is selected, clear the doctors list and do nothing.
    if (!selectedService) {
      setDoctors([]);
      return;
    }

    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`/doctor?service=${selectedService}`);
        const fetchedDoctors = res.data.doctors || [];
        setDoctors(fetchedDoctors);

        // ✅ FIX: This logic is improved. We only clear the selected doctor
        // if the previously selected one is NOT in the new list of doctors.
        if (selectedDoctor) {
          const doctorStillExists = fetchedDoctors.some(
            (doc) => doc._id === selectedDoctor
          );
          if (!doctorStillExists) {
            setSelectedDoctor(""); // Reset if the doctor can't provide the new service
          }
        }
      } catch (err) {
        console.error("❌ Failed to fetch doctors", err);
        setDoctors([]); // Clear doctors on error
      }
    };

    fetchDoctors();
  }, [selectedService, setSelectedDoctor, selectedDoctor]); // ✅ FIX: Effect now correctly depends on selectedService.

  return (
    <FormControl fullWidth margin="normal" disabled={!selectedService || doctors.length === 0}>
      <InputLabel>Doctor</InputLabel>
      <Select
        value={doctors.some(d => d._id === selectedDoctor) ? selectedDoctor : ""} // ✅ FIX: Prevents out-of-range warning during loading
        label="Doctor"
        onChange={(e) => setSelectedDoctor(e.target.value)}
      >
        {doctors.map((doc) => (
          <MenuItem key={doc._id} value={doc._id}>
            {doc.fullName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DoctorSelect;
