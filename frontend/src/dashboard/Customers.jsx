import { Grid, Paper, Skeleton } from "@mui/material";
import API from "../axios";
import { useEffect, useState } from "react";
import UsersTable from "../components/UsersTable";

export default function Customers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const responseUsers = await API.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (responseUsers.status === 200) {
          const data = await responseUsers.data;
          setUsers(data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const changeTable = () => {
    getUser();
  };

  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={740} height={280} />
      ) : (
        <Grid item md={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <UsersTable
              title={"Customers"}
              cols={[
                "#",
                "Email",
                "Name",
                "Phone",
                "Actions",
              ]}
              rows={users}
              deliver={changeTable}
            />
          </Paper>
        </Grid>
      )}
    </>
  );
}
