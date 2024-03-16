import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser } from "../redux/userSlice";
import { setFavourites } from "../redux/favouriteSlice";
import { setCart } from "../redux/cartSlice";
import Swal from "sweetalert2";

export function MainListItems() {
  const navigate = useNavigate();
  return (
    <>
      <ListItemButton onClick={() => navigate("/admin")}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate("/admin/orders")}>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate("/admin/charts")}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Charts" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate("/admin/products")}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Products" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate("/admin/addproduct")}>
        <ListItemIcon>
          <AddBusinessIcon />
        </ListItemIcon>
        <ListItemText primary="Add Product" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate("/admin/categories")}>
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary="Categories" />
      </ListItemButton>
    </>
  );
}

export function SecondaryListItems() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    localStorage.clear();
    dispatch(removeUser());
    dispatch(setFavourites([]));
    dispatch(setCart([]));
    Swal.fire({
      title: "Success!",
      text: "You have been logged out!",
      icon: "success",
    });
  };
  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Users
      </ListSubheader>
      <ListItemButton onClick={() => navigate("/admin/customers")}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate("/admin/contacts")}>
        <ListItemIcon>
          <LocalActivityIcon />
        </ListItemIcon>
        <ListItemText primary="Contacts" />
      </ListItemButton>
      <ListItemButton onClick={logout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </React.Fragment>
  );
}
