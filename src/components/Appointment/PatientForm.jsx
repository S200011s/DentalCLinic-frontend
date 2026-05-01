import React from "react";
import TextField from "@mui/material/TextField";

const PatientForm = ({ patientData = {}, setPatientData }) => {
  const { firstName, lastName, email, phone, age } = patientData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4 mt-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="First Name"
          name="firstName"
          value={firstName}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={lastName}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Phone"
          name="phone"
          value={phone}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Age"
          name="age"
          value={age}
          onChange={handleChange}
          type="number"
          fullWidth
        />
      </div>
    </div>
  );
};

export default PatientForm;
