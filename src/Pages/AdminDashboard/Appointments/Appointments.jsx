import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Avatar,
  Divider
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getAxiosWithToken } from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid #f0f0f0',
  transition: 'all 0.3s ease',
  backgroundColor: '#ffffff',
  width: '90%',
  margin: '0 auto',
  marginBottom: theme.spacing(3),
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

const PatientName = styled(Typography)(({ theme }) => ({
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
      case 'no-show':
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

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  minWidth: '100px',
  transition: 'all 0.3s ease',
  fontSize: '0.875rem',
  ...(variant === 'contained' && {
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 15px rgba(66, 153, 225, 0.4)',
    },
  }),
  ...(variant === 'outlined' && {
    '&:hover': {
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

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [delayMessage, setDelayMessage] = useState("");
  const [cancellationMessage, setCancellationMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // Create axios instance with token once
  const axios = getAxiosWithToken();

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let url = "/appointment";
      const params = new URLSearchParams();
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await axios.get(url);
      setAppointments(res.data.appointments || res.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 404) {
        toast.error("Appointments endpoint not found. Please check your API routes.");
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch appointments");
      }
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      const response = await axios.patch(`/appointment/confirm/${id}`);
      toast.success("✅ Appointment confirmed successfully");
      fetchAppointments();
    } catch (error) {
      console.error('Confirm error:', error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to confirm appointment"));
    }
  };

  const handleOpenCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenCancelModal(true);
  };

  const handleCancel = async () => {
    if (!cancellationMessage.trim()) {
      toast.error("❌ Cancellation message is required");
      return;
    }

    try {
      await axios.patch(`/appointment/cancel/${selectedAppointment._id}`, {
        cancellationMessage
      });
      toast.success("✅ Appointment cancelled successfully");
      setOpenCancelModal(false);
      setCancellationMessage("");
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to cancel appointment"));
    }
  };

  const handleOpenRescheduleModal = (appointment) => {
    setSelectedAppointment(appointment);
    const appointmentDate = new Date(appointment.date);
    const formattedDate = appointmentDate.toISOString().split('T')[0];
    
    setNewDate(formattedDate);
    setNewStartTime(dayjs(appointment.startTime).format("HH:mm"));
    setNewEndTime(dayjs(appointment.endTime).format("HH:mm"));
    setOpenRescheduleModal(true);
  };

  const handleCloseRescheduleModal = () => {
    setOpenRescheduleModal(false);
    setSelectedAppointment(null);
    setNewDate("");
    setNewStartTime("");
    setNewEndTime("");
  };

  const handleReschedule = async () => {
    if (!newDate || !newStartTime || !newEndTime) {
      toast.error("❌ Please fill in all date and time fields");
      return;
    }

    try {
      const newStartDateTime = `${newDate}T${newStartTime}:00`;
      const newEndDateTime = `${newDate}T${newEndTime}:00`;
      
      const url = `/appointment/reschedule/${selectedAppointment._id}?newDate=${newDate}&newStartTime=${newStartDateTime}&newEndTime=${newEndDateTime}`;
      
      await axios.patch(url);
      toast.success("✅ Appointment rescheduled successfully");
      handleCloseRescheduleModal();
      fetchAppointments();
    } catch (error) {
      console.error('Reschedule error:', error);
      toast.error("❌ " + (error.response?.data?.message || "Reschedule failed"));
    }
  };

  const handleDelay = async (appointmentId) => {
    try {
      await axios.patch(`/appointment/delay/${appointmentId}`, {
        delayMinutes: 30,
        message: delayMessage,
      });
      toast.success("✅ Appointment delayed by 30 minutes");
      fetchAppointments();
      setDelayMessage("");
    } catch (error) {
      console.error('Delay error:', error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to delay appointment"));
    }
  };

  const handleNoShow = async (appointmentId) => {
    try {
      await axios.patch(`/appointment/no-show/${appointmentId}`);
      toast.success("✅ Appointment marked as no-show");
      fetchAppointments();
    } catch (error) {
      console.error('No-show error:', error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to mark as no-show"));
    }
  };

  const shouldShowButton = (appointment, buttonType) => {
    const { status } = appointment;
    
    switch (buttonType) {
      case 'confirm':
        return status === 'pending';
      case 'cancel':
        return ['pending', 'confirmed'].includes(status);
      case 'reschedule':
        return ['pending', 'confirmed'].includes(status);
      case 'delay':
        return status === 'confirmed';
      case 'noshow':
        return status === 'completed';
      default:
        return false;
    }
  };

  const getPatientInitials = (appointment) => {
    const firstName = appointment?.patientInfo?.firstName || appointment?.bookedBy?.firstName || '';
    const lastName = appointment?.patientInfo?.lastName || appointment?.bookedBy?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const statusLabels = {
    pending: "🕒 Pending",
    confirmed: "✅ Confirmed",
    completed: "🎉 Completed",
    cancelled: "❌ Cancelled",
    "no-show": "🚫 No Show"
  };

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress />
          <Typography>Loading appointments...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1a365d', mb: 3 }}>
        📅 Appointments Dashboard
      </Typography>

      {/* Status Filter */}
      <Box mb={4}>
        <FormControl size="small" sx={{ minWidth: 400 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="pending">🕒 Pending</MenuItem>
            <MenuItem value="confirmed">✅ Confirmed</MenuItem>
            <MenuItem value="completed">🎉 Completed</MenuItem>
            <MenuItem value="cancelled">❌ Cancelled</MenuItem>
            <MenuItem value="no-show">🚫 No Show</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {appointments.length === 0 ? (
        <Box textAlign="center" mt={8} p={6}>
          <Typography variant="h5" color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
            📋 No appointments found
          </Typography>
          <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
            {statusFilter ? `No appointments with status: ${statusFilter}` : 'No appointments to display'}
          </Typography>
        </Box>
      ) : (
        <Box>
          {appointments.map((appointment) => (
            <StyledCard key={appointment._id}>
              <CardContent sx={{ padding: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
                  {/* Patient and Doctor Info */}
                  <Box sx={{ flex: 1 }}>
                    <DoctorSection>
                      <DoctorAvatar>
                        {getPatientInitials(appointment)}
                      </DoctorAvatar>
                      <Box>
                        <PatientName variant="body1">
                          👤 {appointment?.patientInfo?.firstName || appointment?.bookedBy?.firstName || "Unknown"} {appointment?.patientInfo?.lastName || appointment?.bookedBy?.lastName || ""}
                        </PatientName>
                        {/* <DoctorName variant="h6">
                          Dr. {appointment?.doctorInfo?.name || appointment?.doctor?.firstName || "Doctor"}
                        </DoctorName> */}
                      </Box>
                    </DoctorSection>

                    <InfoSection>
                      <DateTimeInfo variant="body2">
                        📅 {dayjs(appointment.date).format("dddd, MMMM D, YYYY")}
                      </DateTimeInfo>
                      <DateTimeInfo variant="body2" sx={{ mt: 0.5 }}>
                        🕐 {dayjs(appointment.startTime).format("h:mm A")} - {dayjs(appointment.endTime).format("h:mm A")}
                      </DateTimeInfo>
                      {appointment?.service?.name && (
                        <DateTimeInfo variant="body2" sx={{ mt: 0.5 }}>
                          🏥 Service: {appointment.service.name}
                        </DateTimeInfo>
                      )}
                      {appointment?.patientInfo?.email && (
                        <DateTimeInfo variant="body2" sx={{ mt: 0.5 }}>
                          📧 {appointment.patientInfo.email}
                        </DateTimeInfo>
                      )}
                    </InfoSection>
                  </Box>

                  {/* Status and Actions */}
                  <Stack spacing={2} alignItems="flex-end" sx={{ minWidth: { md: '250px' } }}>
                    <StatusChip
                      label={statusLabels[appointment.status] || appointment.status}
                      status={appointment.status}
                    />

                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ justifyContent: 'flex-end' }}>
                      {shouldShowButton(appointment, 'confirm') && (
                        <ActionButton
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleConfirm(appointment._id)}
                        >
                          ✅ Confirm
                        </ActionButton>
                      )}
                      
                      {shouldShowButton(appointment, 'cancel') && (
                        <ActionButton
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleOpenCancelModal(appointment)}
                        >
                          ❌ Cancel
                        </ActionButton>
                      )}
                      
                      {shouldShowButton(appointment, 'reschedule') && (
                        <ActionButton
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleOpenRescheduleModal(appointment)}
                        >
                          📅 Reschedule
                        </ActionButton>
                      )}
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ justifyContent: 'flex-end' }}>
                      {shouldShowButton(appointment, 'delay') && (
                        <ActionButton
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() => handleDelay(appointment._id)}
                        >
                          ⏰ Delay 30min
                        </ActionButton>
                      )}
                      
                      {shouldShowButton(appointment, 'noshow') && (
                        <ActionButton
                          variant="outlined"
                          color="warning"
                          size="small"
                          onClick={() => handleNoShow(appointment._id)}
                        >
                          🚫 No Show
                        </ActionButton>
                      )}
                    </Stack>

                    {/* Delay message input - only show for confirmed appointments */}
                    {shouldShowButton(appointment, 'delay') && (
                      <TextField
                        label="💬 Delay message (optional)"
                        fullWidth
                        size="small"
                        value={delayMessage}
                        onChange={(e) => setDelayMessage(e.target.value)}
                        sx={{ 
                          mt: 1,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                        placeholder="Optional message for the delay..."
                      />
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </StyledCard>
          ))}
        </Box>
      )}

      {/* Cancel Modal */}
      <Dialog 
        open={openCancelModal} 
        onClose={() => setOpenCancelModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1a365d' }}>
          ❌ Cancel Appointment
        </DialogTitle>
        <DialogContent>
          <TextField
            label="💬 Cancellation Message"
            multiline
            rows={4}
            fullWidth
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
            value={cancellationMessage}
            onChange={(e) => setCancellationMessage(e.target.value)}
            required
            placeholder="Please provide a reason for cancellation..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <ActionButton 
            onClick={() => {
              setOpenCancelModal(false);
              setCancellationMessage("");
              setSelectedAppointment(null);
            }}
            variant="outlined"
          >
            Close
          </ActionButton>
          <ActionButton 
            onClick={handleCancel} 
            variant="contained" 
            color="error"
            disabled={!cancellationMessage.trim()}
          >
            Confirm Cancel
          </ActionButton>
        </DialogActions>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog 
        open={openRescheduleModal} 
        onClose={handleCloseRescheduleModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1a365d' }}>
          📅 Reschedule Appointment
        </DialogTitle>
        <DialogContent>
          <TextField
            label="📅 New Date"
            type="date"
            fullWidth
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split('T')[0] }}
            required
          />
          <TextField
            label="🕐 New Start Time"
            type="time"
            fullWidth
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
            value={newStartTime}
            onChange={(e) => setNewStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="🕑 New End Time"
            type="time"
            fullWidth
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <ActionButton onClick={handleCloseRescheduleModal} variant="outlined">
            Cancel
          </ActionButton>
          <ActionButton 
            onClick={handleReschedule} 
            variant="contained"
            disabled={!newDate || !newStartTime || !newEndTime}
          >
            Confirm Reschedule
          </ActionButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Appointments;