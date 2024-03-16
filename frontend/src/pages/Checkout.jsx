import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import Input from "../components/Input";
import CheckoutItem from "../components/CheckoutItem";
import CheckoutTopbar from "../components/CheckoutTopbar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { calculateTotal } from "../redux/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import API from "../axios";
import Loader from "../components/Loader";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(calculateTotal());
  }, []);
  const { total } = useSelector((state) => state.cart);
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [inputs, setInputs] = useState({
    email: user.username,
    phone: "",
    address: "",
  });
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("access-token");
      if (token) {
        const responseUser = await API.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (responseUser.status === 200) {
          const dataUser = await responseUser.data;
          setInputs({
            ...inputs, phone: dataUser.phone ? dataUser.phone : ""
          });
        }
      }
    };
    getUser();
  }, []);
  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs({ ...inputs, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem("checkoutdata", JSON.stringify(inputs));
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY);
    const token = localStorage.getItem("access-token");
    if (token) {
      const response = await API.post(
        `/stripecheckout`,
        { inputs },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const session = await response.data;
      const result = stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <CheckoutTopbar />
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400">Check your items.</p>
          {cartItems.map((item) => (
            <CheckoutItem key={item._id} item={item} />
          ))}
        </div>
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Shipping Details</p>
          <p className="text-gray-400">
            Complete your order by providing your shipping details.
          </p>
          {loading ? (
            <div className="flex h-full justify-center items-center">
              <Loader />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                title="Email"
                id="email"
                placeholder="your.email@gmail.com"
                icon={
                  <AlternateEmailIcon
                    fontSize="small"
                    className="text-gray-400"
                  />
                }
                input={inputs.email}
                setInput={handleInputs}
              />
              <Input
                title="Phone"
                id="phone"
                placeholder="Phone"
                icon={<PhoneIcon fontSize="small" className="text-gray-400" />}
                input={inputs.phone}
                setInput={handleInputs}
              />
              <Input
                title="Address"
                id="address"
                placeholder="Address"
                icon={
                  <BusinessIcon fontSize="small" className="text-gray-400" />
                }
                input={inputs.address}
                setInput={handleInputs}
              />
              <div className="mt-6 border-t border-b py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Subtotal</p>
                  <p className="font-semibold text-gray-900">Rs. {total}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Shipping</p>
                  <p className="font-semibold text-gray-900">Rs. 0</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  Rs. {total}
                </p>
              </div>

              <button className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">
                Place Order
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
