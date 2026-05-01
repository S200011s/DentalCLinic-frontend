import React from "react";
import { Card, CardContent, Typography, Avatar, Stack, Box, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid #f0f0f0',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '4px solid #ffffff',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
}));

const DoctorName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  color: '#1a365d',
  marginBottom: theme.spacing(0.5),
}));

const ServiceName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1.1rem',
  color: '#4299e1',
  marginBottom: theme.spacing(1),
}));

const SpecializationText = styled(Typography)(({ theme }) => ({
  color: '#718096',
  fontSize: '0.95rem',
  marginBottom: theme.spacing(1),
}));

const FeeBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f7fafc',
  padding: theme.spacing(1.5, 2),
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  marginTop: theme.spacing(1),
}));

const FeeText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#2d3748',
  fontSize: '1.1rem',
}));

const VerifiedChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#48bb78',
  color: 'white',
  fontSize: '0.75rem',
  height: '24px',
  '& .MuiChip-icon': {
    color: 'white',
  },
}));

const DoctorCard = ({ doctor, selectedServiceId }) => {
  if (!doctor) return null;

  const currentService = doctor.services?.find(
    (s) => s._id === selectedServiceId
  );

  const selectedService =
    doctor.services?.find((service) => service._id === selectedServiceId) || doctor.services?.[0];

  return (
    <StyledCard>
      <CardContent sx={{ padding: 3 }}>
        <Stack direction="row" spacing={3} alignItems="flex-start">
          <StyledAvatar
            src={doctor.profileImage || "/default-doc.png"}
            alt={doctor.fullName}
          />
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <DoctorName variant="h5">
                Dr. {doctor.fullName}
              </DoctorName>
              <VerifiedChip 
                icon={<span>✓</span>} 
                label="Verified" 
                size="small" 
              />
            </Stack>
            
            <ServiceName variant="h6">
              {currentService?.name || "General Consultation"}
            </ServiceName>
            
            <SpecializationText variant="body2">
              MBBS - {(doctor.specialization || []).join(", ")} • {doctor.experience || 0} Years
            </SpecializationText>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.6 }}>
                <strong>About</strong> 📋
              </Typography>
              <Typography variant="body2" sx={{ color: '#718096', mt: 0.5, lineHeight: 1.6 }}>
                Dr. {doctor.fullName} has a strong commitment to delivering comprehensive medical care, 
                focusing on preventive medicine, early diagnosis, and effective treatment strategies.
              </Typography>
            </Box>
            
            <FeeBox>
              <FeeText>
                Appointment fee: ${selectedService?.price || 40}
              </FeeText>
            </FeeBox>
          </Box>
        </Stack>
      </CardContent>
    </StyledCard>
  );
};

export default DoctorCard;

