import { useDispatch, useSelector } from "react-redux";
import CartItem from "../components/CartItem";
import { useEffect } from "react";
import { calculateTotal } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(calculateTotal());
  }, []);
  const navigate = useNavigate();
  const { total } = useSelector((state) => state.cart);
  const { cartItems } = useSelector((state) => state.cart);
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20">
        <h1 className="mb-10 text-center text-2xl font-bold">Cart is Empty</h1>
      </div>
    );
  }
  return (
    <div className="min-h-screen pt-20">
      <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
      <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
        <div className="rounded-lg md:w-2/3">
          {cartItems.map((item) => 
            <CartItem key={item._id} item={item} />
          )}
        </div>
        {/* Sub total */}
        <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
          <div className="mb-2 flex justify-between">
            <p className="text-gray-700">Subtotal</p>
            <p className="text-gray-700">Rs. {total}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700">Shipping</p>
            <p className="text-gray-700">Rs. 0</p>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between">
            <p className="text-lg font-bold">Total</p>
            <div className="">
              <p className="mb-1 text-lg font-bold">Rs. {total}</p>
            </div>
          </div>
          <button onClick={() => navigate('/checkout')} className="mt-6 w-full rounded-md bg-[#e10f37] py-1.5 font-medium text-white hover:bg-[#DA2E4F]">
            Check out
          </button>
        </div>
      </div>
    </div>
  );
}
