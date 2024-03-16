import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import API from "../axios";
import { setCart } from "../redux/cartSlice";
export default function Success() {
  const dispatch = useDispatch();
  const [orderCreated, setOrderCreated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const createOrder = async () => {
      if (!orderCreated) {
        const token = localStorage.getItem("access-token");
        if (token) {
          const responseUser = await API.get("/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (responseUser.status === 200) {
            const dataUser = await responseUser.data;
            if (dataUser.payment) {
              const localData = localStorage.getItem("checkoutdata");
              if (localData) {
                const formData = JSON.parse(localData);
                console.log(formData);
                const response = await API.post(
                  `/placeorder`,
                  {
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                if (response.status === 200) {
                  dispatch(setCart([]));
                  localStorage.removeItem("checkoutdata");
                }
              } else {
                navigate("/");
              }
            } else {
              navigate("/");
            }
          }
        } else {
          navigate("/");
        }
        setOrderCreated(true);
      }
    };
    createOrder();
  }, [orderCreated]);
  return (
    <div className="bg-gray-100 h-screen">
      <div className="bg-white p-6  md:mx-auto">
        <svg
          viewBox="0 0 24 24"
          className="text-green-600 w-16 h-16 mx-auto my-6"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Payment Done!
          </h3>
          <p className="text-gray-600 my-2">
            Thank you for completing your secure online payment.
          </p>
          <p> Have a great day! </p>
          <div className="py-10 text-center">
            <Link
              to="/"
              className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
            >
              GO BACK
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
