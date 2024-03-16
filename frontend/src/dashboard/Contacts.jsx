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
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import API from "../axios";
import Swal from "sweetalert2";
import Input from "../components/Input";

const Modal = ({ open, handleClose, email, message }) => {
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
        <DialogTitle id="scroll-dialog-title">{email}</DialogTitle>
        <DialogContent dividers={true}>
            <Typography variant="body1" gutterBottom>
                {message}
            </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function Contacts() {
  const [disabledButtons, setDisabledButtons] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    getContacts();
  }, []);

  const [open, setOpen] = React.useState(false);

  const handleOpen = (email, message) => {
    setEmail(email);
    setMessage(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    getContacts();
    setEmail("");
    setMessage("");
  };

  const getContacts = async () => {
    setLoading(true);
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const responseOrders = await API.get("/admin/contact", {
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
        const responseCount = await API.delete(`/admin/deletecontact/${id}`, {
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
          getContacts();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const deleteContact = (id, index) => {
    setDisabledButtons((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
    Swal.fire({
      title: "Do you want to delete?",
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
            <Title>Contacts</Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone ? row.phone : "--"}</TableCell>
                    <TableCell>{row.message.slice(0, 15) + "..."}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        disabled={disabledButtons[index]}
                        color="primary"
                        aria-label="delete"
                        size="large"
                        onClick={() => handleOpen(row.email, row.message)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        disabled={disabledButtons[index]}
                        color="error"
                        aria-label="delete"
                        size="large"
                        onClick={() => deleteContact(row._id, index)}
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
        email={email}
        message={message}
      />
    </>
  );
}
