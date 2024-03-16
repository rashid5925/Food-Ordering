import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../components/Title";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Skeleton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import API from "../axios";
import Swal from "sweetalert2";
import Input from "../components/Input";

const Modal = ({ open, handleClose, title, categoryId, category }) => {
  const descriptionElementRef = React.useRef(null);
  const [input, setInput] = React.useState("");
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
    setInput(category);
  }, [open]);

  const handleInputs = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (input === "") return;
    if (title === "Edit") {
      const token = localStorage.getItem("access-token");
      if (token) {
        try {
          const responseOrders = await API.put(
            `/admin/updatecategory/${categoryId}`,
            {
              name: input,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (responseOrders.status === 200) {
            Swal.fire({
                title: "Successful!",
                text: "Updated Successfully!",
                icon: "success",
              });
            handleClose();
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      const token = localStorage.getItem("access-token");
      if (token) {
        try {
          const responseOrders = await API.post(
            "/admin/addcategory",
            {
              name: input,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (responseOrders.status === 200) {
            Swal.fire({
                title: "Successful!",
                text: "Added Successfully!",
                icon: "success",
              });
            handleClose();
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

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
        <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
        <DialogContent dividers={true}>
          <Input
            title="Category"
            id="category"
            placeholder="Name"
            icon={<AddIcon fontSize="small" className="text-gray-400" />}
            input={input}
            setInput={handleInputs}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSubmit}>
            {title}
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function Categories() {
  const [disabledButtons, setDisabledButtons] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");

  React.useEffect(() => {
    getOrder();
  }, []);

  const [open, setOpen] = React.useState(false);

  const handleOpen = (id, edit) => {
    if (edit !== "") {
      setCategoryId(id);
      setCategory(edit);
      setTitle("Edit");
    } else {
      setCategory("");
      setCategoryId("");
      setTitle("Add");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    getOrder();
    setTitle("");
    setCategoryId("");
    setCategory("");
  };

  const getOrder = async () => {
    setLoading(true);
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const responseOrders = await API.get("/admin/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (responseOrders.status === 200) {
          const data = await responseOrders.data;
          setRows(data);
          setDisabledButtons(Array(rows.length).fill(false));
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const confirmDelete = async (id) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const responseCount = await API.delete(`/admin/deletecategory/${id}`, {
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
  const deleteCategory = (id, index) => {
    setDisabledButtons((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
    Swal.fire({
      title: "Do you want to delete the category?",
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
      {loading ? (
        <Skeleton variant="rectangular" width={740} height={280} />
      ) : (
        <Grid item md={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <div className="flex justify-between">
              <Title>Categories</Title>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpen("", "")}
              >
                Add Category
              </Button>
            </div>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        disabled={disabledButtons[index]}
                        color="primary"
                        aria-label="delete"
                        size="large"
                        onClick={() => handleOpen(row._id, row.name)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        disabled={disabledButtons[index]}
                        color="error"
                        aria-label="delete"
                        size="large"
                        onClick={() => deleteCategory(row._id, index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      )}
      <Modal
        open={open}
        handleClose={handleClose}
        title={title}
        categoryId={categoryId}
        category={category}
      />
    </>
  );
}
