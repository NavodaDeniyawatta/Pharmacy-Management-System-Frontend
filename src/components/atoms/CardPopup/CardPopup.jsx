import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useBaseUrl } from "../../../contexts/BaseUrl";
import axios from "axios";
import { useNavigate } from "react-router";
import FileUpload from "../../../helpers/FileUpload";

const STRIPE_PUBLISH_KEY = import.meta.env.VITE_STRIPE_PUBLISH_KEY;
const StripePromise = loadStripe(STRIPE_PUBLISH_KEY);

const CheckoutForm = ({ amount, onClose, cart, pdfFile }) => {
  let sessionExpiredHandled = false; // move this outside CheckoutForm
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const storedUser = localStorage.getItem("userData");
  const Token = storedUser ? JSON.parse(storedUser).accessToken : null;
  const UserId = storedUser ? JSON.parse(storedUser).id : null;
  const navigate = useNavigate();

  const { baseUrl } = useBaseUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
    });

    if (error) {
      alert(error.message);
      setIsProcessing(false);
      return;
    }

    try {
      const uploadResponse = await FileUpload(pdfFile, baseUrl);

      if (!uploadResponse) {
        alert("Prescription upload failed. Please try again.");
        return;
      }

      const pdf = `http://localhost:3300/uploads/${uploadResponse}`;
      const response = await axios.post(
        `${baseUrl}/order/create`,
        {
          userId: UserId,
          paymentMethodId: paymentMethod.id,
          items: cart.map((item) => ({
            itemId: item._id || item.id,
            count: String(item.quantity.toString()),
            price: String(item.salePrice.toString()),
          })),
          total: String(amount.toFixed(2)),
          pdf,
          deliveryStatus: "Pending",
        },
        {
          headers: {
            token: `Bearer ${Token}`,
          },
        }
      );
      if (response.data.status) {
        alert("Payment successful!");
        onClose();
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      setIsProcessing(false);
      if (
        error.response &&
        error.response.data.error.message ===
          "Your session has expired. Please log in again."
      ) {
        if (!sessionExpiredHandled) {
          sessionExpiredHandled = true;
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("userData");
          navigate("/login");
        }
      } else {
        console.error("Error creating order data:", error);
        alert("An error occurred while creating order.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
    >
      <h2 className="text-lg font-bold mb-4">Enter Card Details</h2>

      <label className="block mb-2 text-sm font-medium">Card Number</label>
      <CardNumberElement className="border p-2 rounded mb-4" />

      <label className="block mb-2 text-sm font-medium">Expiry Date</label>
      <CardExpiryElement className="border p-2 rounded mb-4" />

      <label className="block mb-2 text-sm font-medium">CVC</label>
      <CardCvcElement className="border p-2 rounded mb-4" />

      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${
            isProcessing
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-400"
          }`}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay $ ${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

const CardPopup = ({ amount, onClose, cart, pdf }) => (
  <div className="fixed inset-0 bg-black/15 bg-opacity-50 flex justify-center items-center z-50">
    <Elements stripe={StripePromise}>
      <CheckoutForm
        amount={amount}
        onClose={onClose}
        cart={cart}
        pdfFile={pdf}
      />
    </Elements>
  </div>
);

export default CardPopup;
