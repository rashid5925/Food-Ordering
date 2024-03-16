import Footer from "../components/Footer";
import Products from "../components/Products";
import { useSelector } from "react-redux";

export default function Favourites() {
  const { favouriteItems } = useSelector((state) => state.favourite);
  return (
    <div className="flex flex-col mt-10 justify-center items-center mx-3">
      <h2 className="text-4xl mb-4 text-[#e10f37]">Favourites</h2>
      <Products products={favouriteItems} />
    </div>
  );
}
