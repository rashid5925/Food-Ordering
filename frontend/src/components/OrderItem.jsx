import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function OrderItem({ item, rated, handleClick, rate }) {
  const [rating, setRating] = useState(0);
  const { user } = useSelector((state) => state.user);
  
  useEffect(() => {
    if (rated) {
      const rate = item.product.rating.find((rate) => rate.user == user._id);
      if (rate) {
        setRating(rate.value);
      }
    }
    else if (rate) {
      setRating(rate.rating)
    }
  }, [rating]);
  const handleHover = (hoveredRating) => {
    setRating(hoveredRating);
  };
  
  return (
    <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
      <div className="pb-4 md:pb-8 w-full md:w-40">
        <img
          className="w-full hidden md:block"
          src={item.product.image}
          alt="dress"
        />
        <img
          className="w-full md:hidden"
          src={item.product.image}
          alt="dress"
        />
      </div>
      <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
        <div className="w-full flex flex-col justify-start items-start space-y-8">
          <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
            {item.product.title}
          </h3>
          <div className="flex">
            {!rated ? (
              [1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-3xl ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onMouseEnter={() => handleHover(star)}
                  onMouseLeave={() => handleHover(0)}
                  onClick={() => handleClick(star, item.product._id)}
                >
                  &#9733;
                </span>
              ))
            ) : (
              <span className="text-yellow-600">
                {Array.from({ length: rating }).map((_, index) => (
                  <span
                  key={index}
                  className="cursor-pointer text-3xl  text-yellow-500"
                >
                  &#9733;
                </span>
                ))}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between space-x-8 items-start w-full">
          <p className="text-base xl:text-lg leading-6">
            Rs. {item.product.price}
          </p>
          <p className="text-base xl:text-lg leading-6 text-gray-800">
            X {item.amount}
          </p>
          <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
            Rs. {item.product.price * item.amount}
          </p>
        </div>
      </div>
    </div>
  );
}
