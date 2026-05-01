import React, { useEffect, useState } from "react";
import { getAxiosWithToken } from "../../api/axiosInstance";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { CircularProgress, Box, Typography, Button, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

const SectionContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid #f0f0f0',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#1a365d',
  marginBottom: theme.spacing(3),
  textAlign: 'center',
}));

const DaysContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  overflowX: 'auto',
  padding: theme.spacing(1, 0),
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#c1c1c1',
    borderRadius: '3px',
  },
}));

const DayButton = styled(Button)(({ theme, selected }) => ({
  minWidth: '80px',
  height: '80px',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  border: selected ? '2px solid #4299e1' : '2px solid #e2e8f0',
  backgroundColor: selected ? '#4299e1' : '#ffffff',
  color: selected ? '#ffffff' : '#4a5568',
  boxShadow: selected ? '0 4px 15px rgba(66, 153, 225, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: selected ? '#3182ce' : '#f7fafc',
    transform: 'translateY(-2px)',
    boxShadow: selected ? '0 6px 20px rgba(66, 153, 225, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const DayText = styled(Typography)(({ theme, selected }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

const DateText = styled(Typography)(({ theme, selected }) => ({
  fontSize: '1.25rem',
  fontWeight: 700,
}));

const TimeSlotsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(2),
}));

const TimeSlotButton = styled(Button)(({ theme, selected, available }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: '12px',
  border: selected ? '2px solid #4299e1' : available ? '2px solid #e2e8f0' : '2px solid #fed7d7',
  backgroundColor: selected ? '#4299e1' : available ? '#ffffff' : '#fed7d7',
  color: selected ? '#ffffff' : available ? '#4a5568' : '#e53e3e',
  fontSize: '0.9rem',
  fontWeight: 600,
  minHeight: '50px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  cursor: available ? 'pointer' : 'not-allowed',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: selected ? '#3182ce' : available ? '#f7fafc' : '#fed7d7',
    transform: available ? 'translateY(-1px)' : 'none',
    boxShadow: available ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
  },
  '&:disabled': {
    cursor: 'not-allowed',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontSize: '0.7rem',
  height: '20px',
  backgroundColor: 
    status === 'available' ? '#c6f6d5' :
    status === 'pending' ? '#fef5e7' :
    status === 'booked' ? '#fed7d7' : '#e2e8f0',
  color: 
    status === 'available' ? '#22543d' :
    status === 'pending' ? '#744210' :
    status === 'booked' ? '#742a2a' : '#4a5568',
}));

const SlotPicker = ({ doctorId, serviceId, onSlotSelect }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const generateWeekDays = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      days.push(addDays(new Date(), i));
    }
    return days;
  };

  const weekDays = generateWeekDays();

  useEffect(() => {
    const fetchSlots = async () => {
      if (!doctorId || !serviceId || !selectedDate) return;

      setLoading(true);
      try {
        const axiosAuth = getAxiosWithToken();
        const dateParam = selectedDate.toISOString().split("T")[0];
        const res = await axiosAuth.get("/appointment/slots", {
          params: { doctorId, serviceId, date: dateParam },
        });

        setSlots(res.data.slots || []);
        setError("");
      } catch (err) {
        console.error("❌ Failed to load slots:", err);
        setError("Failed to load available slots. Please try again.");
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [doctorId, serviceId, selectedDate]);

  const handleSlotSelect = (slot) => {
    if (slot.status?.toLowerCase() !== "available") {
      return;
    }
    setSelectedSlot(slot);
    onSlotSelect(slot);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset selected slot when date changes
  };

  return (
    <SectionContainer>
      <SectionTitle>Booking slots</SectionTitle>
      
      {/* Days Selection */}
      <DaysContainer>
        {weekDays.map((day, index) => (
          <DayButton
            key={index}
            selected={isSameDay(day, selectedDate)}
            onClick={() => handleDateSelect(day)}
          >
            <DayText selected={isSameDay(day, selectedDate)}>
              {format(day, 'EEE').toUpperCase()}
            </DayText>
            <DateText selected={isSameDay(day, selectedDate)}>
              {format(day, 'd')}
            </DateText>
          </DayButton>
        ))}
      </DaysContainer>

      {/* Time Slots */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={40} sx={{ color: '#4299e1' }} />
        </Box>
      ) : error ? (
        <Typography sx={{ color: '#e53e3e', textAlign: 'center', py: 2 }}>
          {error}
        </Typography>
      ) : slots.length === 0 ? (
        <Typography sx={{ color: '#718096', textAlign: 'center', py: 2 }}>
          No slots available for the selected date.
        </Typography>
      ) : (
        <TimeSlotsContainer>
          {slots.map((slot, index) => {
            const isAvailable = slot.status?.toLowerCase() === "available";
            const isSelected = selectedSlot?.startTime === slot.startTime;
            
            return (
              <TimeSlotButton
                key={index}
                selected={isSelected}
                available={isAvailable}
                onClick={() => handleSlotSelect(slot)}
                disabled={!isAvailable}
              >
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {format(new Date(slot.startTime), "h:mm a")}
                </Typography>
                <StatusChip 
                  label={slot.status} 
                  status={slot.status?.toLowerCase()}
                  size="small"
                />
              </TimeSlotButton>
            );
          })}
        </TimeSlotsContainer>
      )}
      
      {selectedSlot && (
        <Box sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: '#e6fffa', 
          borderRadius: '12px',
          border: '1px solid #81e6d9',
          textAlign: 'center'
        }}>
          <Typography sx={{ color: '#234e52', fontWeight: 600 }}>
            ✅ Selected: {format(selectedDate, 'EEEE, MMMM d')} at {format(new Date(selectedSlot.startTime), "h:mm a")}
          </Typography>
        </Box>
      )}
    </SectionContainer>
  );
};

export default SlotPicker;

