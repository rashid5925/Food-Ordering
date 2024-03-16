import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToFavourite, removeFavourite } from "../redux/favouriteSlice";
import StarIcon from "@mui/icons-material/Star";
import Swal from "sweetalert2";
import calcRating from "../utils/calcRating";
import API from "../axios";
import { addToCart } from "../redux/cartSlice";

export default function ProductCard({ item }) {
  const dispatch = useDispatch();
  const { itemIds } = useSelector((state) => state.favourite);
  const { user } = useSelector((state) => state.user);
  const addToFav = async () => {
    const token = localStorage.getItem("access-token");
    if (token) {
      const response = await API.put(
        `/addtowishlist/${item._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(addToFavourite(item));
        Swal.fire({
          title: "Successfully!",
          text: "Added to wishlist!",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Cannot add to wishlist!",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "Error!",
        text: "Unauthorized request!",
        icon: "error",
      });
    }
  };
  const removeFromFav = async () => {
    const token = localStorage.getItem("access-token");
    if (token) {
      const response = await API.put(
        `/removefromwishlist/${item._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(removeFavourite(item));
        Swal.fire({
          title: "Successfully!",
          text: "Removed from wishlist!",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Cannot remove from wishlist!",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "Error!",
        text: "Unauthorized request!",
        icon: "error",
      });
    }
  };
  const pushToCart = async () => {
    const token = localStorage.getItem("access-token");
    if (token) {
      const response = await API.put(
        `/addtocart/${item._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(addToCart({product: item}));
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
        text: "Unauthorized request!",
        icon: "error",
      });
    }
  };
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Link to={`/product/${item._id}`}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="140"
          sx={{ height: 240 }}
          image={item.image}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {item.title}
          </Typography>
          <Typography variant="body1">Rs. {item.price}</Typography>
          <Typography variant="body2">
            <span className="text-yellow-600">
              {Array.from({ length: calcRating(item.rating) }).map(
                (_, index) => (
                  <StarIcon key={index} />
                )
              )}
              {calcRating(item.rating)?`(${Math.round(calcRating(item.rating) * 10) / 10} / 5)`:<span className="block mt-1">Not Rated</span>}
            </span>
          </Typography>
        </CardContent>
      </Link>
      <CardActions className="flex justify-end">
        {user ? (
          itemIds.includes(item._id) ? (
            <button
              onClick={removeFromFav}
              className="text-[#e10f37] z-99 p-2 rounded-full hover:bg-[#e10f37] hover:text-white"
            >
              <FavoriteIcon />
            </button>
          ) : (
            <button
              onClick={addToFav}
              className="text-[#e10f37] z-99 p-2 rounded-full hover:bg-[#e10f37] hover:text-white"
            >
              <FavoriteBorderIcon />
            </button>
          )
        ) : (
          <></>
        )}
        <button onClick={pushToCart} className="text-[#e10f37] p-2 rounded-full hover:bg-[#e10f37] hover:text-white">
          <AddShoppingCartIcon />
        </button>
        <Link to={`/product/${item._id}`} className="bg-[#e10f37] text-white py-2 px-3 rounded-md hover:bg-slate-100 hover:text-[#e10f37]">
          <VisibilityIcon /> Details
        </Link>
      </CardActions>
    </Card>
  );
}
