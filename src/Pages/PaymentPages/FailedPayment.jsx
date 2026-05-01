import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Paper,
  Stack
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

const FailureCard = styled(Card)(({ theme }) => ({
  maxWidth: '500px',
  width: '100%',
  borderRadius: '20px',
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  border: '1px solid #f0f0f0',
  overflow: 'visible',
  textAlign: 'center',
}));

const FailureHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
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
    borderTop: '10px solid #c53030',
  },
}));

const FailureIcon = styled(Box)(({ theme }) => ({
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

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1rem',
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  transition: 'all 0.3s ease',
  margin: theme.spacing(1),
  ...(variant === 'contained' && {
    background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(66, 153, 225, 0.4)',
    },
  }),
  ...(variant === 'outlined' && {
    borderColor: '#4299e1',
    color: '#4299e1',
    '&:hover': {
      backgroundColor: '#f7fafc',
      borderColor: '#3182ce',
      transform: 'translateY(-1px)',
    },
  }),
}));

const InfoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#fff5f5',
  border: '1px solid #fed7d7',
  borderRadius: '12px',
  marginTop: theme.spacing(3),
}));

const SupportPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f7fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  marginTop: theme.spacing(2),
}));

const FailedPayment = () => {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate(-1); // Go back to payment method selection
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleContactSupport = () => {
    // You can implement contact support functionality here
    window.location.href = 'mailto:support@dentalclinic.com';
  };

  return (
    <StyledContainer maxWidth="sm">
      <FailureCard>
        <FailureHeader>
          <FailureIcon>
            ❌
          </FailureIcon>
          
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Payment Failed
          </Typography>
          
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            We couldn't process your payment
          </Typography>
        </FailureHeader>

        <CardContent sx={{ padding: 4 }}>
          <Typography variant="h6" sx={{ color: '#4a5568', mb: 3, fontWeight: 600 }}>
            Don't worry, your appointment slot is still reserved for a short time
          </Typography>

          <InfoPaper elevation={0}>
            <Typography variant="body2" sx={{ color: '#742a2a', fontWeight: 600, mb: 2 }}>
              🔍 Common reasons for payment failure:
            </Typography>
            <Typography variant="body2" sx={{ color: '#9b2c2c', mb: 1 }}>
              • Insufficient funds in your account
            </Typography>
            <Typography variant="body2" sx={{ color: '#9b2c2c', mb: 1 }}>
              • Incorrect card details or expired card
            </Typography>
            <Typography variant="body2" sx={{ color: '#9b2c2c', mb: 1 }}>
              • Network connectivity issues
            </Typography>
            <Typography variant="body2" sx={{ color: '#9b2c2c' }}>
              • Bank security restrictions
            </Typography>
          </InfoPaper>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
            <ActionButton
              variant="contained"
              onClick={handleRetryPayment}
              fullWidth
            >
              🔄 Try Again
            </ActionButton>
            <ActionButton
              variant="outlined"
              onClick={handleGoHome}
              fullWidth
            >
              🏠 Go Home
            </ActionButton>
          </Stack>

          <SupportPaper elevation={0}>
            <Typography variant="body2" sx={{ color: '#4a5568', fontWeight: 600, mb: 1 }}>
              💬 Need Help?
            </Typography>
            <Typography variant="body2" sx={{ color: '#718096', mb: 2 }}>
              If you continue to experience issues, our support team is here to help
            </Typography>
            <ActionButton
              variant="outlined"
              onClick={handleContactSupport}
              size="small"
            >
              📧 Contact Support
            </ActionButton>
          </SupportPaper>

          <Typography variant="caption" sx={{ color: '#718096', mt: 3, display: 'block' }}>
            Your appointment slot will be held for 15 minutes
          </Typography>
        </CardContent>
      </FailureCard>
    </StyledContainer>
  );
};

export default FailedPayment;

