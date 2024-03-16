import { useDispatch } from "react-redux";
import { increase, calculateTotal, decrease, removeItem } from "../redux/cartSlice";
import API from "../axios";

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const increaseItem = async () => {
    const token = localStorage.getItem("access-token");
    if (token) {
      const response = await API.put(
        `/addtocart/${item.product._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(increase(item.product._id));
        dispatch(calculateTotal());
      }
    }
  }
  const decreaseItem = async () => {
    if (item.amount > 1) {
      const token = localStorage.getItem("access-token");
      if (token) {
        const response = await API.put(
          `/decreaseamountcart/${item.product._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          dispatch(decrease(item.product._id));
          dispatch(calculateTotal());
        }
      }
    } else {
      popItem();
    }
  }
  const popItem = async () => {
    const token = localStorage.getItem("access-token");
    if (token) {
      const response = await API.put(
        `/removefromcart/${item.product._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(removeItem(item.product._id));
        dispatch(calculateTotal());
      }
    }
  }
  return (
    <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
      <img
        src={item.product.image}
        alt="product-image"
        className="w-full rounded-lg sm:w-40"
      />
      <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
        <div className="mt-5 sm:mt-0">
          <h2 className="text-lg font-bold text-gray-900">{item.product.title}</h2>
        </div>
        <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
          <div className="flex items-center border-gray-100">
            <button onClick={decreaseItem} className="cursor-pointer rounded-l text-4xl bg-gray-100 py-[0.28rem] px-3.5 duration-100 hover:bg-[#e10f37] hover:text-white">
              {" "}
              -{" "}
            </button>
            <input
              className="h-12 w-12 border bg-white text-center text-xl outline-none"
              type="number"
              value={item.amount}
              onChange={() => item.amount}
              min="1"
            />
            <button onClick={increaseItem} className="cursor-pointer rounded-r text-4xl bg-gray-100 py-[0.28rem] px-3 duration-100 hover:bg-[#e10f37] hover:text-white">
              {" "}
              +{" "}
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-lg">Rs. {item.product.price}</p>
            <button onClick={popItem}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
