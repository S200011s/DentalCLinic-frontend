import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Box,
  Avatar,
  Divider
} from "@mui/material";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid #f0f0f0',
  transition: 'all 0.3s ease',
  backgroundColor: '#ffffff',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
  },
}));

const DoctorSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const DoctorAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  backgroundColor: '#4299e1',
  fontSize: '1.5rem',
  fontWeight: 600,
}));

const DoctorName = styled(Typography)(({ theme }) => ({
  fontSize: '1.3rem',
  fontWeight: 700,
  color: '#1a365d',
  marginBottom: theme.spacing(0.5),
}));

const ServiceName = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: '#4299e1',
  marginBottom: theme.spacing(0.5),
}));

const DateTimeInfo = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: '#718096',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusColors = (status) => {
    switch (status) {
      case 'confirmed':
        return { bg: '#c6f6d5', color: '#22543d', border: '#9ae6b4' };
      case 'pending':
        return { bg: '#fef5e7', color: '#744210', border: '#f6e05e' };
      case 'cancelled':
        return { bg: '#fed7d7', color: '#742a2a', border: '#fc8181' };
      case 'completed':
        return { bg: '#bee3f8', color: '#2a4365', border: '#90cdf4' };
      case 'expired':
        return { bg: '#e2e8f0', color: '#4a5568', border: '#cbd5e0' };
      default:
        return { bg: '#f7fafc', color: '#4a5568', border: '#e2e8f0' };
    }
  };

  const colors = getStatusColors(status);
  
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    border: `1px solid ${colors.border}`,
    fontWeight: 600,
    fontSize: '0.85rem',
    height: '32px',
  };
});

const PaymentChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#e6fffa',
  color: '#234e52',
  border: '1px solid #81e6d9',
  fontWeight: 600,
  fontSize: '0.8rem',
  height: '28px',
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  minWidth: '100px',
  transition: 'all 0.3s ease',
  ...(variant === 'contained' && {
    background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 15px rgba(66, 153, 225, 0.4)',
    },
  }),
  ...(variant === 'outlined' && {
    borderColor: '#e53e3e',
    color: '#e53e3e',
    '&:hover': {
      backgroundColor: '#fed7d7',
      borderColor: '#c53030',
      transform: 'translateY(-1px)',
    },
  }),
}));

const InfoSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#f7fafc',
  padding: theme.spacing(2),
  borderRadius: '12px',
  marginTop: theme.spacing(2),
}));

const AppointmentCard = ({ appointment, onCancel }) => {
  const {
    doctor,
    service,
    date,
    startTime,
    endTime,
    status,
    paymentStatus,
    _id
  } = appointment;

  const isCancellable = status === "pending" || status === "confirmed";
  const isConfirmed = status === "confirmed";
  const isPayable = isConfirmed && paymentStatus !== "paid";

  const statusLabels = {
    pending: "🕒 Pending",
    confirmed: "✅ Confirmed",
    completed: "🎉 Completed",
    cancelled: "❌ Cancelled",
    "no-show": "🚫 No Show",
    expired: "⌛ Expired"
  };

  const statusLabel = statusLabels[status] || status;

  const getDoctorInitials = () => {
    const firstName = doctor?.user?.firstName || '';
    const lastName = doctor?.user?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <StyledCard>
      <CardContent sx={{ padding: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
          {/* Doctor and Service Info */}
          <Box sx={{ flex: 1 }}>
            <DoctorSection>
              <DoctorAvatar>
                {getDoctorInitials()}
              </DoctorAvatar>
              <Box>
                <DoctorName variant="h6">
                  Dr. {doctor?.user?.firstName} {doctor?.user?.lastName}
                </DoctorName>
                <ServiceName variant="body1">
                  {service?.name}
                </ServiceName>
              </Box>
            </DoctorSection>

            <InfoSection>
              <DateTimeInfo variant="body2">
                📅 {format(new Date(date), "EEEE, MMMM d, yyyy")}
              </DateTimeInfo>
              <DateTimeInfo variant="body2" sx={{ mt: 0.5 }}>
                🕐 {format(new Date(startTime), "h:mm a")} - {format(new Date(endTime), "h:mm a")}
              </DateTimeInfo>
              {service?.price && (
                <DateTimeInfo variant="body2" sx={{ mt: 0.5 }}>
                  💰 Appointment Fee: ${service.price}
                </DateTimeInfo>
              )}
            </InfoSection>
          </Box>

          {/* Status and Actions */}
          <Stack spacing={2} alignItems="flex-end" sx={{ minWidth: { md: '200px' } }}>
            <StatusChip
              label={statusLabel}
              status={status}
            />

            {paymentStatus === "paid" ? (
              <PaymentChip label="💳 Payment Completed" size="small" />
            ) : isPayable ? (
              <Link to={`/payment/method/${_id}`} style={{ textDecoration: 'none' }}>
                <ActionButton variant="contained" size="small">
                  💳 Pay Now
                </ActionButton>
              </Link>
            ) : null}

            {isCancellable && (
              <ActionButton
                variant="outlined"
                size="small"
                onClick={() => onCancel(appointment)}
              >
                Cancel
              </ActionButton>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </StyledCard>
  );
};

export default AppointmentCard;

