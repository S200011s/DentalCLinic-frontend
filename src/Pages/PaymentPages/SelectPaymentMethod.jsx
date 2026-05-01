import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAxiosWithToken } from "../../api/axiosInstance";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Stack,
  Chip
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(16),
  paddingBottom: theme.spacing(10),
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  color: '#1a365d',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}));

const PageSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  color: '#718096',
  maxWidth: '600px',
  margin: '0 auto',
  lineHeight: 1.6,
}));

const PaymentCard = styled(Card)(({ theme }) => ({
  maxWidth: '500px',
  margin: '0 auto',
  borderRadius: '20px',
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  border: '1px solid #f0f0f0',
  overflow: 'visible',
}));

const PaymentHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
  color: 'white',
  padding: theme.spacing(4),
  textAlign: 'center',
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
    borderTop: '10px solid #3182ce',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#4299e1',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#4299e1',
    },
  },
}));

const PaymentOption = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '8px',
  margin: theme.spacing(0.5, 1),
  '&:hover': {
    backgroundColor: '#f7fafc',
  },
  '&.Mui-selected': {
    backgroundColor: '#e6fffa',
    '&:hover': {
      backgroundColor: '#e6fffa',
    },
  },
}));

const PaymentButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1.1rem',
  padding: theme.spacing(1.5, 4),
  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  color: 'white',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(72, 187, 120, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const SecurityBadge = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#f0fff4',
  border: '1px solid #c6f6d5',
  borderRadius: '12px',
  textAlign: 'center',
  marginTop: theme.spacing(3),
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#e6fffa',
  color: '#234e52',
  fontWeight: 600,
  margin: theme.spacing(0.5),
}));

const SelectPaymentMethod = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [gateway, setGateway] = useState("stripe");
  const [loading, setLoading] = useState(false);

  const paymentOptions = [
    { value: "stripe", label: "💳 Stripe", description: "Credit/Debit Cards" },
    { value: "paymob", label: "💵 Paymob", description: "Local Payment Gateway" },
    { value: "paypal", label: "🅿️ PayPal", description: "PayPal Account" },
  ];

  const handlePayment = async () => {
    setLoading(true);
    try {
      const axiosAuth = getAxiosWithToken();
      const res = await axiosAuth.post("/payments/initiate", {
        appointmentId,
        paymentMethod: "online",
        gateway,
      });

      const { paymentUrl, redirectUrl } = res.data;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        navigate("/payment/failure");
      }

    } catch (err) {
      console.error("Payment initiation failed:", err);
      navigate("/payment/failure");
    } finally {
      setLoading(false);
    }
  };

  const selectedOption = paymentOptions.find(option => option.value === gateway);

  return (
    <StyledContainer maxWidth="md">
      <HeaderSection>
        <PageTitle variant="h2">
          Secure Payment
        </PageTitle>
        <PageSubtitle variant="body1">
          Choose your preferred payment method to complete your appointment booking
        </PageSubtitle>
      </HeaderSection>

      <PaymentCard>
        <PaymentHeader>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            💳 Payment Gateway
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Your payment is secured with industry-standard encryption
          </Typography>
        </PaymentHeader>

        <CardContent sx={{ padding: 4 }}>
          <StyledFormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id="payment-gateway-label">Select Payment Method</InputLabel>
            <Select
              labelId="payment-gateway-label"
              value={gateway}
              label="Select Payment Method"
              onChange={(e) => setGateway(e.target.value)}
            >
              {paymentOptions.map((option) => (
                <PaymentOption key={option.value} value={option.value}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {option.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#718096', flex: 1 }}>
                      {option.description}
                    </Typography>
                  </Stack>
                </PaymentOption>
              ))}
            </Select>
          </StyledFormControl>

          {selectedOption && (
            <Box sx={{ mb: 4, p: 3, backgroundColor: '#f7fafc', borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#4a5568', fontWeight: 600 }}>
                Selected: {selectedOption.label}
              </Typography>
              <Typography variant="body2" sx={{ color: '#718096', mb: 2 }}>
                {selectedOption.description}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <FeatureChip label="🔒 Secure" size="small" />
                <FeatureChip label="⚡ Fast" size="small" />
                <FeatureChip label="🌍 Global" size="small" />
              </Stack>
            </Box>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <PaymentButton
              onClick={handlePayment}
              disabled={loading}
              size="large"
              fullWidth
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </PaymentButton>
          </Box>

          <SecurityBadge elevation={0}>
            <Typography variant="body2" sx={{ color: '#22543d', fontWeight: 600, mb: 1 }}>
              🛡️ Your Payment is Protected
            </Typography>
            <Typography variant="caption" sx={{ color: '#2f855a' }}>
              We use bank-level security and never store your payment information
            </Typography>
          </SecurityBadge>
        </CardContent>
      </PaymentCard>
    </StyledContainer>
  );
};

export default SelectPaymentMethod;

