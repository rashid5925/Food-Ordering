import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import API from "../axios";
import Swal from "sweetalert2";
import CheckoutItem from "./CheckoutItem";

const Modal = ({ open, handleClose, products }) => {
  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="products-dialog-title"
        aria-describedby="products-dialog-list"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">Products</DialogTitle>
        <DialogContent dividers={true}>
          {products.map((item) => <CheckoutItem key={item._id} item={item} />)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function OrdersTable({ title, cols, rows, deliver }) {
  const [disabledButtons, setDisabledButtons] = React.useState(
    Array(rows.length).fill(false)
  );
  const [open, setOpen] = React.useState(false);
  const [products, setProducts] = React.useState([]);

  const handleOpen = (index) => {
    setProducts(rows[index].products)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setProducts([])
  };
  const markDelivered = async (id, index) => {
    setDisabledButtons((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const responseCount = await API.put(
          `/admin/completeorder/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (responseCount.status === 200) {
          Swal.fire({
            title: "Successful!",
            text: "Marked Delivered!",
            icon: "success",
          });
          deliver();
        }
      } catch (error) {
        console.log(error);
      }
    }
    setDisabledButtons((prevState) => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };
  const confirmDeliver = (id, index) => {
    setDisabledButtons((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
    Swal.fire({
      title: "Do you want to deliver the order?",
      showCancelButton: true,
      confirmButtonText: "Deliver",
    }).then((result) => {
      if (result.isConfirmed) {
        markDelivered(id, index);
      }
    });

    setDisabledButtons((prevState) => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };
  const confirmDelete = async (id) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const responseCount = await API.delete(`/admin/deleteorder/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (responseCount.status === 200) {
          Swal.fire({
            title: "Successful!",
            text: "Deleted Successfully!",
            icon: "success",
          });
          deliver();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const deleteOrder = (id, index) => {
    setDisabledButtons((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
    Swal.fire({
      title: "Do you want to delete the order?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(id);
      }
    });

    setDisabledButtons((prevState) => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };
  return (
    <>
      <Title>{title}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            {cols.map((item, index) => (
              <TableCell key={index}>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.total}</TableCell>
              <TableCell>{row.products.length}</TableCell>
              <TableCell>{new Date(row.orderDate).toLocaleString()}</TableCell>
              <TableCell>
                {!row.delivered ? (
                  <Button
                    onClick={() => confirmDeliver(row._id, index)}
                    disabled={disabledButtons[index]}
                    variant="contained"
                    startIcon={<DeliveryDiningIcon />}
                  >
                    Deliver
                  </Button>
                ) : (
                  <></>
                )}
                <IconButton
                  onClick={() => handleOpen(index)}
                  color="primary"
                  aria-label="view"
                  size="large"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  disabled={disabledButtons[index]}
                  color="error"
                  aria-label="delete"
                  size="large"
                  onClick={() => deleteOrder(row._id, index)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal open={open} handleClose={handleClose} products={products} />
    </>
  );
}
