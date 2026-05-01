import { getAxiosWithToken } from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

const CreatePayment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const makePayment = async () => {
      try {
        const axiosAuth = getAxiosWithToken();

        const res = await axiosAuth.post(`/payments/initiate`, {
          appointmentId,
          paymentMethod: "online",
          gateway: "paypal"
        });

        const { paymentUrl } = res.data;

        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          navigate("/payment/failure");
        }
      } catch (err) {
        console.error("❌ Error during payment:", err);
        navigate("/payment/failure");
      }
    };

    makePayment();
  }, [appointmentId, navigate]);

  return <p>You will be redirected to payment page...</p>;
};

export default CreatePayment;
