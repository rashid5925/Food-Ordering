import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import API from "../axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import OrderItem from "../components/OrderItem";

export default function OrderDetail() {
    const [order, setOrder] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ratings, setRatings] = useState([]);
    const [rated, setRated] = useState(false);
    const { id } = useParams();
    useEffect(() => {
        const getOrder = async () => {
            const token = localStorage.getItem("access-token");
            if (token) {
                const response = await API.get(
                    `/order/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    const data = await response.data;
                    setOrder(data);
                }
                const responseUser = await API.get('/user', {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                });
                if (responseUser.status === 200) {
                    const dataUser = await responseUser.data;
                    setUser(dataUser);
                    setLoading(true);
                }
            }
        }
        getOrder();
        
    }, [rated]);
    const handleClick = (clickedRating, id) => {
        setRatings((prevArray) => {
            const index = prevArray.findIndex((obj) => obj.id === id);
            if (index === -1) {
              return [...prevArray, {id, rating: clickedRating}];
            } else {
              const updatedArray = [...prevArray];
              updatedArray[index] = { ...prevArray[index], rating: clickedRating };
              return updatedArray;
            }
        });
    };

    const submitRating = async () => {
        const token = localStorage.getItem("access-token");
        if (token) {
            const response = await API.put(
                `/rate/${id}`,
                {ratings},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setRatings([]);
                setRated(true);
                Swal.fire({
                    title: "Successfully!",
                    text: "Rated successfully!",
                    icon: "success",
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Something went wrong!",
                    icon: "error",
                });
            }
        }
    }

    return (
        <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
            {loading ?
                <>
                    <div className="flex justify-start item-start space-y-2 flex-col">
                        <div className="sm:flex">
                        <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
                            Order #{order._id}
                        </h1>
                        {order.delivered ? (
                            <div className="mt-1 ms-2 flex items-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-emerald-500/20 p-2">
                                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                            </div>
                            <p className="text-lg leading-5 text-gray-500">
                                Delivered
                            </p>
                            </div>
                        ) : (
                            <div className="mt-1 ms-2 flex items-center justify-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-yellow-500/20 p-2">
                                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            </div>
                            <p className="text-lg leading-5 text-gray-500">Pending</p>
                            </div>
                        )}
                        </div>
                        <p className="text-base font-medium leading-6 text-gray-600">
                            {new Date(order.orderDate).toLocaleString()}
                        </p>
                        
                    </div>
                    <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                        <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                            <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                                <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">
                                    Customer's Cart
                                </p>
                                
                                {order.products.map((item) => <OrderItem key={item._id} rate={ratings.find((rating) => rating.id === item.product._id)} handleClick={handleClick} rated={order.rated} item={item} />)}
                                {!order.rated ? 
                                <button onClick={submitRating} className="ms-auto bg-[#e10f37] text-white py-2 px-3 rounded-md hover:bg-slate-100 hover:text-[#e10f37]">
                                    Submit Rating
                                </button>
                                :''}
                            </div>
                            <div className="flex justify-center flex-col md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                                <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6">
                                    <h3 className="text-xl font-semibold leading-5 text-gray-800">
                                        Summary
                                    </h3>
                                    <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                                        <div className="flex justify-between w-full">
                                            <p className="text-base leading-4 text-gray-800">
                                                Subtotal
                                            </p>
                                            <p className="text-base leading-4 text-gray-600">
                                                Rs. {order.total}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center w-full">
                                            <p className="text-base leading-4 text-gray-800">
                                                Shipping
                                            </p>
                                            <p className="text-base leading-4 text-gray-600">
                                                Rs. 0
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-base font-semibold leading-4 text-gray-800">
                                            Total
                                        </p>
                                        <p className="text-base font-semibold leading-4 text-gray-600">
                                            Rs. {order.total}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
                            <h3 className="text-xl font-semibold leading-5 text-gray-800">
                                Customer
                            </h3>
                            <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                                <div className="flex flex-col justify-start items-start flex-shrink-0">
                                    <div className="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                                        <img
                                            className="h-16 w-16 rounded"
                                            src="/images/default_user.png"
                                            alt="avatar"
                                        />
                                        <div className="flex justify-start items-start flex-col space-y-2">
                                            <p className="text-base font-semibold leading-4 text-left text-gray-800">
                                                {user.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-center text-gray-800 md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M3 7L12 13L21 7"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <p className="cursor-pointer text-sm leading-5 ">
                                            {order.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                                    <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                                        <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                                            <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">
                                                Shipping Address
                                            </p>
                                            <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                                                {order.address}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                                        <span className="mt-6 text-center md:mt-0 py-5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 font-medium w-96 2xl:w-full text-base font-medium leading-4 text-gray-800">
                                            Order Details
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </> :
                <div className="grid gird-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6 h-max">
                    <Skeleton variant="rectangular" width={400} height={400} />
                    <Skeleton variant="rectangular" width={200} height={300} />
                </div>
            }
        </div>
    );
}
