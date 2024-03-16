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
  Switch,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Edit from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import API from "../axios";
import Swal from "sweetalert2";
import calcRating from "../utils/calcRating";
import { useNavigate } from "react-router-dom";

const Modal = ({ open, handleClose, product }) => {
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
          <DialogTitle id="scroll-dialog-title">{product.title}</DialogTitle>
          <DialogContent dividers={true}>
            <img
                srcSet={`${product.image}?w=420&h=360&fit=crop&auto=format&dpr=2 2x`}
                src={`${product.image}?w=420&h=360&fit=crop&auto=format`}
                alt={product.title}
                loading="lazy"
            />
            <Typography variant="h4" gutterBottom>
                Description
            </Typography>
            <Typography variant="body1" gutterBottom>
                {product.decription}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };
  

export default function ProductsTable({ title, cols, rows, deliver }) {
  const [disabledButtons, setDisabledButtons] = React.useState(
    Array(rows.length).fill(false)
  );
  const [open, setOpen] = React.useState(false);
  const [product, setProduct] = React.useState([]);
  const navigate = useNavigate();

  const handleCheck = async (e, id) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        if (e.target.checked) {
            const responseAdd = await API.put(`/admin/addtofeatured/${id}`, 
            {}
            ,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            if (responseAdd.status === 200) {
            Swal.fire({
                title: "Successful!",
                text: "Add to home page successfully!",
                icon: "success",
            });
            deliver();
            }
        } else {
            const responseAdd = await API.put(`/admin/removefromfeatured/${id}`, 
            {}
            ,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            if (responseAdd.status === 200) {
            Swal.fire({
                title: "Successful!",
                text: "Add to home page successfully!",
                icon: "success",
            });
            deliver();
            }
        }
        
      } catch (error) {
        Swal.fire({
            title: "Error!",
            text: "Cannot add to home!",
            icon: "error",
        });
        console.log(error);
      }
    }
  };

  const handleOpen = (index) => {
    setProduct(rows[index])
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setProduct([])
  };

  const confirmDelete = async (id) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const responseCount = await API.delete(`/admin/deleteproduct/${id}`, {
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
        Swal.fire({
            title: "Error!",
            text: "Cannot delete Product!",
            icon: "error",
        });
        console.log(error);
      }
    }
  };
  const deleteProduct = (id, index) => {
    setDisabledButtons((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
    Swal.fire({
      title: "Do you want to delete the product?",
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
              <TableCell>{row.title}</TableCell>
              <TableCell>Rs. {row.price}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>
                <span className="text-yellow-600">
                    {Array.from({ length: calcRating(row.rating) }).map(
                        (_, index) => (
                        <StarIcon key={index} />
                        )
                    )}
                </span>
                {calcRating(row.rating)?`(${Math.round(calcRating(row.rating) * 10) / 10} / 5)`:"Not Rated"}
              </TableCell>
              <TableCell>
                <Switch
                    checked={row.featured}
                    onChange={(e) => handleCheck(e, row._id)}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  disabled={disabledButtons[index]}
                  color="primary"
                  aria-label="View"
                  size="large"
                  onClick={() => handleOpen(index)}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  disabled={disabledButtons[index]}
                  color="secondary"
                  aria-label="edit"
                  size="large"
                  onClick={() => navigate(`/admin/editproduct/${row._id}`)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  disabled={disabledButtons[index]}
                  color="error"
                  aria-label="delete"
                  size="large"
                  onClick={() => deleteProduct(row._id, index)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal open={open} handleClose={handleClose} product={product} />
    </>
  );
}
