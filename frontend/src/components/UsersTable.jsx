import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import {
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../axios";
import Swal from "sweetalert2";

export default function UsersTable({ title, cols, rows, deliver }) {
  const [disabledButtons, setDisabledButtons] = React.useState(
    Array(rows.length).fill(false)
  );

  const confirmDelete = async (id) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const responseCount = await API.delete(`/admin/deleteuser/${id}`, {
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
  const deleteUser = (id, index) => {
    setDisabledButtons((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
    Swal.fire({
      title: "Do you want to delete the user?",
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
              <TableCell>{row.username}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.phone ? row.phone : 'N/A'}</TableCell>
              <TableCell>
                <IconButton
                  disabled={disabledButtons[index]}
                  color="error"
                  aria-label="delete"
                  size="large"
                  onClick={() => deleteUser(row._id, index)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
