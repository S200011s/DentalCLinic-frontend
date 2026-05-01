import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAxiosWithToken } from "../../api/axiosInstance";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Paper
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(16),
  paddingBottom: theme.spacing(10),
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const SuccessCard = styled(Card)(({ theme }) => ({
  maxWidth: '500px',
  width: '100%',
  borderRadius: '20px',
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  border: '1px solid #f0f0f0',
  overflow: 'visible',
  textAlign: 'center',
}));

const SuccessHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  color: 'white',
  padding: theme.spacing(4),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderTop: '10px solid #38a169',
  },
}));

const SuccessIcon = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  fontSize: '2.5rem',
}));

const LoadingIcon = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1rem',
  padding: theme.spacing(1.5, 3),
  background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
  color: 'white',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(66, 153, 225, 0.4)',
  },
}));

const InfoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f0fff4',
  border: '1px solid #c6f6d5',
  borderRadius: '12px',
  marginTop: theme.spacing(3),
}));

const SuccessPayment = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your payment...");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const paymentId = queryParams.get("paymentId");

      if (!paymentId) {
        setMessage("Payment ID not found.");
        setIsLoading(false);
        setTimeout(() => navigate("/payment/failure"), 3000);
        return;
      }

      try {
        const axiosInstance = getAxiosWithToken();
        await axiosInstance.get(`/payments/verify/${paymentId}`);
        setMessage("Payment successful!");
        setIsSuccess(true);
        setIsLoading(false);
        setTimeout(() => navigate("/my-appointments"), 10000);
      } catch (err) {
        console.error("❌ Payment verification error:", err);
        setMessage("Payment verification failed!");
        setIsLoading(false);
        setTimeout(() => navigate("/payment/failure"), 3000);
      }
    };

    verify();
  }, [navigate]);

  return (
    <StyledContainer maxWidth="sm">
      <SuccessCard>
        <SuccessHeader>
          {isLoading ? (
            <LoadingIcon>
              <CircularProgress size={40} sx={{ color: 'white' }} />
            </LoadingIcon>
          ) : isSuccess ? (
            <SuccessIcon>
              ✅
            </SuccessIcon>
          ) : (
            <SuccessIcon>
              ❌
            </SuccessIcon>
          )}
          
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {isLoading ? "Processing..." : isSuccess ? "Payment Successful!" : "Payment Failed"}
          </Typography>
          
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {isLoading ? "Please wait while we verify your payment" : 
             isSuccess ? "Your appointment has been confirmed" : 
             "There was an issue with your payment"}
          </Typography>
        </SuccessHeader>

        <CardContent sx={{ padding: 4 }}>
          <Typography variant="h6" sx={{ color: '#4a5568', mb: 3, fontWeight: 600 }}>
            {message}
          </Typography>

          {isSuccess && (
            <InfoPaper elevation={0}>
              <Typography variant="body2" sx={{ color: '#22543d', fontWeight: 600, mb: 1 }}>
                🎉 What's Next?
              </Typography>
              <Typography variant="body2" sx={{ color: '#2f855a', mb: 2 }}>
                • You will receive a confirmation email shortly
              </Typography>
              <Typography variant="body2" sx={{ color: '#2f855a', mb: 2 }}>
                • Check your appointment details in "My Appointments"
              </Typography>
              <Typography variant="body2" sx={{ color: '#2f855a' }}>
                • Arrive 15 minutes early for your appointment
              </Typography>
            </InfoPaper>
          )}

          {!isLoading && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <ActionButton
                onClick={() => navigate(isSuccess ? "/my-appointments" : "/payment/failure")}
                size="large"
              >
                {isSuccess ? "View My Appointments" : "Try Again"}
              </ActionButton>
            </Box>
          )}

          {isSuccess && (
            <Typography variant="caption" sx={{ color: '#718096', mt: 3, display: 'block' }}>
              You will be redirected to your appointments in 5 seconds...
            </Typography>
          )}
        </CardContent>
      </SuccessCard>
    </StyledContainer>
  );
};

export default SuccessPayment;

