import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import API from "../axios";
import Input from "../components/Input";
import BadgeIcon from '@mui/icons-material/Badge';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Swal from "sweetalert2";
import Loader from "../components/Loader";

export default function Profile() {
  const [completedOrders, setCompletedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [user, setUser] = useState(null);
  const [inputs, setInputs] = useState({
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getOrders = async () => {
      const token = localStorage.getItem("access-token");
      if (token) {
        const responseUser = await API.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (responseUser.status === 200) {
          const dataUser = await responseUser.data;
          setUser(dataUser);
          setInputs({
            name: dataUser.name ? dataUser.name: '',
            phone: dataUser.phone ? dataUser.phone: ''
          })
        }
        const responseC = await API.get(`/orderscompleted`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (responseC.status === 200) {
          const data = await responseC.data;
          setCompletedOrders(data.length);
        }
        const responseP = await API.get(`/orderspending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (responseP.status === 200) {
          const data = await responseP.data;
          setPendingOrders(data.length);
          setLoading(false);
        }
      }
    };
    getOrders();
  }, []);
  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs({ ...inputs, [name]: value });
  };
  const updateUser = async () => {
    const token = localStorage.getItem("access-token");
    if (token) {
        const responseUser = await API.put("/update", 
        {
            name: inputs.name,
            phone: inputs.phone,
        },  
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (responseUser.status === 200) {
          Swal.fire({
            title: 'Success',
            text: 'User updated successfully',
            icon: 'success'
          })
        }
      }
  }
  return (
    <div className="min-h-screen m-4 sm:m-12">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
            <Loader />
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center mb-6">
            <Paper
              elevation={3}
              sx={{
                height: 150,
                width: 200,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: 2,
              }}
            >
              Completed Orders {completedOrders}
            </Paper>
            <Paper
              elevation={3}
              sx={{
                height: 150,
                width: 200,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: 2,
              }}
            >
              Pending Orders {pendingOrders}
            </Paper>
          </div>
          <div className="bg-white p-3 shadow-lg rounded-sm">
            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
              <span clas="text-green-500">
                <svg
                  className="h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <span className="trackingWide">About</span>
            </div>
            <div className="text-gray-700">
              <div className="grid md:grid-cols-2 text-sm">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Email</div>
                  <div className="px-4 py-2">{user.username}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Username</div>
                  <div className="px-4 py-2">{user.username}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2">
                    <Input
                      title="Name"
                      id="name"
                      placeholder="Name"
                      icon={
                        <BadgeIcon
                          fontSize="small"
                          className="text-gray-400"
                        />
                      }
                      input={inputs.name}
                      setInput={handleInputs}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2">
                    <Input
                      title="Contact No."
                      id="phone"
                      placeholder="Phone"
                      icon={
                        <LocalPhoneIcon
                          fontSize="small"
                          className="text-gray-400"
                        />
                      }
                      input={inputs.phone}
                      setInput={handleInputs}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button onClick={updateUser} className="block w-full text-[#e10f37] text-sm font-semibold rounded-lg hover:bg-[#e10f37] hover:text-white focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">
              Update Info
            </button>
          </div>
        </>
      )}
    </div>
  );
}
