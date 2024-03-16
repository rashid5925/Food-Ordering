import CategoryCard from "./CategoryCard";
import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Skeleton } from "@mui/material";
import { getData } from "../utils/fetchData";

export default function Categories() {
  const [scrollLeft, setScrollLeft] = useState(0);

  const [products, loading, error] = getData('/categories');

  const handleScroll = (scrollAmount) => {
    const container = document.getElementById("categories-container");
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const newScrollLeft = Math.max(
      0,
      Math.min(scrollLeft + scrollAmount, scrollWidth)
    );
    container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    setScrollLeft(newScrollLeft);
  };

  if (error) return <></>;

  return (
    <div className="flex flex-col mt-16">
      <h2 className="text-4xl mb-4 text-center text-[#e10f37]">Categories</h2>
      <div className="relative">
        <button
          className="absolute left-5 sm:left-12 top-1/2 transform -translate-y-1/2 bg-white p-2 text-black hover:text-white hover:bg-[#e10f37] rounded-full"
          onClick={() => handleScroll(-150)}
        >
          <ArrowBackIosIcon sx={{ marginLeft: 1 }} />
        </button>
        <div
          id="categories-container"
          className="flex flex-row mt-5 justify-start items-center overflow-x-auto overflow-y-hidden no-scrollbar"
        >
          {loading ? (
            <>
              <Skeleton
                variant="rectangular"
                sx={{
                  m: 2,
                }}
                width={286}
                height={146}
              />
              <Skeleton
                variant="rectangular"
                sx={{
                  m: 2,
                }}
                width={286}
                height={146}
              />
              <Skeleton
                variant="rectangular"
                sx={{
                  m: 2,
                }}
                width={286}
                height={146}
              />
              <Skeleton
                variant="rectangular"
                sx={{
                  m: 2,
                }}
                width={286}
                height={146}
              />
              <Skeleton
                variant="rectangular"
                sx={{
                  m: 2,
                }}
                width={286}
                height={146}
              />
            </>
          ) : 
            products.length == 0 ? <></>
          :
          (
            products.map((item) => <CategoryCard key={item._id} category={item.name} image={"./images/category.png"} />)
          )}
        </div>
        <button
          className="absolute right-5 sm:right-12 top-1/2 transform -translate-y-1/2 bg-white p-2 text-black hover:text-white hover:bg-[#e10f37] rounded-full"
          onClick={() => handleScroll(150)}
        >
          <ArrowForwardIosIcon sx={{ marginRight: 0.5, marginLeft: 0.5 }} />
        </button>
      </div>
    </div>
  );
}
