import { useState } from "react";
import Loader from "../components/Loader";
import axios from "../axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { jwtDecode } from "jwt-decode";
import API from "../axios";
import { setFavourites } from "../redux/favouriteSlice";
import { setCart } from "../redux/cartSlice";

export default function Signup () {
    const [inputs, setInputs] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [match, setMatch] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs({ ...inputs, [name]: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputs.password && inputs.email && inputs.name) {
            if (inputs.password == inputs.confirmPassword) {
                setLoading(true);
                try {
                    axios
                        .post("/auth/register", {
                            name: inputs.name,
                            username: inputs.email,
                            phone: inputs.phone,
                            password: inputs.password,
                        })
                        .then(async (response) => {
                            if (response.status === 200 && response.data.success) {
                                Swal.fire({
                                    position: "top-end",
                                    icon: "success",
                                    title: "Signed up successfully.",
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                const data = await response.data.token;
                                localStorage.setItem('access-token', data);
                                const user = jwtDecode(data);
                                dispatch(setUser(user));
                                const responseUser = await API.get("/user", {
                                    headers: {
                                    Authorization: `Bearer ${data}`,
                                    },
                                });
                                const dataUser = await responseUser.data;
                                dispatch(setFavourites(dataUser.wishlist));
                                dispatch(setCart(dataUser.cart));
                                navigate('/');
                            } else {
                                setError(true);
                                Swal.fire({
                                    position: "top-end",
                                    icon: "error",
                                    title: "Cannot signup.",
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            }
                        })
                        .catch((err) => {
                            setError(true);
                            Swal.fire({
                                position: "top-end",
                                icon: "error",
                                title: "Cannot signup.",
                                showConfirmButton: false,
                                timer: 1500
                            });

                        });
                } catch (error) {
                    setError(true);
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Cannot signup.",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
                setLoading(false);
            } else {
                setMatch("ring-red-900");
            }
        }
    };
    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                {error ? (
                    <Alert severity="error" onClose={() => { setError(false) }}>
                        <AlertTitle>Error</AlertTitle>
                        Cannot signup.
                    </Alert>
                ) : null}
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <img
                                className="mx-auto h-10 w-auto"
                                src="./images/logo.svg"
                                alt="Your Company"
                            />
                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Sign in to your account
                            </h2>
                        </div>

                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                                action="#"
                                method="POST"
                            >
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="name"
                                            name="name"
                                            type="name"
                                            autoComplete="given-name"
                                            required
                                            onChange={handleChange}
                                            className="block w-full rounded-md ps-1 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Phone
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="phone"
                                            autoComplete="phone"
                                            onChange={handleChange}
                                            className="block w-full ps-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            onChange={handleChange}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Password
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            onChange={handleChange}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="confirmPassword"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Confirm Password {match!=''?<span className="text-red-800">Password donot match</span>:null}
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            onChange={handleChange}
                                            onFocus={() => setMatch("")}
                                            className={"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "+match}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>

                        </div>
                    </>
                )}
            </div>
        </>
    );
}
