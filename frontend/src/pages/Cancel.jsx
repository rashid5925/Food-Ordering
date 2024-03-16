import { Link, useNavigate } from "react-router-dom";
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect } from "react";
import API from "../axios";

export default function Cancel() {
  const navigate = useNavigate();
  useEffect(() => {
    const createOrder = async () => {
        const token = localStorage.getItem("access-token");
        if (token) {
          const responseUser = await API.get('/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (responseUser.status === 200) {
            const dataUser = await responseUser.data;
            if (!dataUser.payment) {
              navigate('/');
            }
            await API.put(
              `/cancelOrder`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }
        } else {
          navigate('/');
        }
    };
    createOrder();
  }, []);
  return (
    <div className="bg-gray-100 h-screen">
      <div className="bg-white p-6 mt-10 md:mx-auto">
        <div className="flex justify-center">
          <CancelIcon sx={{ fontSize: 60, color: "#e10f37" }} />
        </div>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Payment Unsccessfull!
          </h3>
          <p className="text-gray-600 my-2">
            Thank you.
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
