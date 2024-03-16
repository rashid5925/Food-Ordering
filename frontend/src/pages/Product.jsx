import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import StarIcon from "@mui/icons-material/Star";
import { Skeleton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getData } from "../utils/fetchData";
import calcRating from "../utils/calcRating";
import Footer from "../components/Footer";
import API from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import Swal from "sweetalert2";
import { useState } from "react";

export default function Product() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(1);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [products, loading, error] = getData(`/product/${id}`);
  const pushToCart = async () => {
    const token = localStorage.getItem("access-token");
    if (token) {
      if (!user) {
        Swal.fire({
          title: "Error!",
          text: "Please login first!",
          icon: "error",
        });
        navigate('/login');
        return;
      }
      const response = await API.put(
        `/addtocart/${products._id}/${amount}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(addToCart({product: products, amount: amount}));
        Swal.fire({
          title: "Successfully!",
          text: "Added to cart!",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Cannot add to cart!",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "Error!",
        text: "Please login first!",
        icon: "error",
      });
      navigate('/login');
    }
  };
  return (
    <div className="p-3 max-w-7xl m-auto">
      <div className="p-3 max-w-7xl m-auto">
        <div className="mt-6 sm:mt-10">
          <div className="grid gird-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6 h-max">
            {loading ? (
              <>
                <Skeleton variant="rectangular" width={400} height={400} />
                <div>
                  <Skeleton variant="text" sx={{ fontSize: "3rem" }} />
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
                  <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
                </div>
              </>
            ) : (
              <>
                {/* Product Image */}
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={products.image}
                    alt="Product-Image"
                    className="w-full"
                  />
                </div>
                {/* Product Details */}
                <div className="flex flex-col justify-between">
                  <div>
                    {/* Product Title */}
                    <h1 className="text-3xl text-red-500 font-semibold sm:text-4xl">
                      {products.title}
                    </h1>
                    {/* Product Description */}
                    <p className="mt-3 text-gray-600 text-md leading-6 text-justify sm:text-left sm:mt-4">
                      {products.decription}
                    </p>
                    {/* Star Ratings */}
                    <span className="my-3 text-xl text-yellow-600 flex items-center gap-1 sm:my-4">
                      {Array.from({ length: calcRating(products.rating) }).map(
                        (_, index) => (
                          <StarIcon key={index} />
                        )
                      )}
                    </span>
                    {/* Product Price */}
                    <span className="text-xl text-red-500 font-semibold sm:text-2xl">
                      Rs. {products.price}
                    </span>
                  </div>
                  {/* Quantity Input and Order Button */}
                  <div className=" ">
                    <div className="text-left flex flex-col gap-2 w-full">
                      {/* Quantity Label */}
                      <label className="font-semibold">Quantity</label>
                      {/* Quantity Input */}
                      <div className="flex items-center border-gray-100">
                        <button onClick={() => amount > 1? setAmount(amount - 1): null} className="cursor-pointer rounded-l text-4xl bg-gray-100 py-[0.28rem] px-3.5 duration-100 hover:bg-[#e10f37] hover:text-white">
                          {" "}
                          -{" "}
                        </button>
                        <input
                          className="h-12 w-12 border bg-white text-center text-xl outline-none"
                          type="number"
                          value={amount}
                          onChange={() => amount}
                          min="1"
                        />
                        <button onClick={() => setAmount(amount + 1)} className="cursor-pointer rounded-r text-4xl bg-gray-100 py-[0.28rem] px-3 duration-100 hover:bg-[#e10f37] hover:text-white">
                          {" "}
                          +{" "}
                        </button>
                      </div>
                    </div>
                    {/* Order Button */}
                    <div className="w-full text-left my-4">
                      <button
                        className="flex justify-center items-center gap-2 w-full py-3 px-4 bg-red-500 text-white text-md font-bold border border-red-500 rounded-md ease-in-out duration-150 shadow-slate-600 hover:bg-white hover:text-red-500 lg:m-0 md:px-6"
                        title="Confirm Order"
                        onClick={pushToCart}
                      >
                        <span>Add to Cart</span>
                        <ArrowCircleRightOutlinedIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
