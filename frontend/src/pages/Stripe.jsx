import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { calculateTotal, setCart } from "../redux/cartSlice";
import Swal from "sweetalert2";
import API from "../axios";

export default function Stripe() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(calculateTotal());
  }, []);
  const { total } = useSelector((state) => state.cart);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      return;
    }

    // Create the PaymentIntent and obtain clientSecret from your server endpoint
    const res = await fetch("/create-intent", {
      method: "POST",
    });

    const { client_secret: clientSecret } = await res.json();

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret,
      confirmParams: {
        return_url: import.meta.env.VITE_REDIRECT_URL,
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      const createOrder = async () => {
        const token = localStorage.getItem("access-token");
        if (token) {
          const formData = JSON.parse(localStorage.getItem("checkoutdata"));
          const response = await API.post(
            `/placeorder`,
            { formData },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            dispatch(setCart([]));
          }
        }
      };
      createOrder();
      Swal.fire({
        title: "Successfully!",
        text: "Payment has been made successfully!",
        icon: "success",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || !elements}>
        Pay
      </button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}
