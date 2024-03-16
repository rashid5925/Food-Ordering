import { Grid, Paper, Skeleton } from "@mui/material";
import OrdersTable from "../components/OrdersTable";
import API from "../axios";
import { useEffect, useState } from "react";

export default function OrdersAdmin() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState(null);
  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const responseOrders = await API.get("/admin/orderscompleted", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (responseOrders.status === 200) {
          const data = await responseOrders.data;
          setOrders(data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const changeTable = () => {
    getOrder();
  };

  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={740} height={280} />
      ) : (
        <Grid item md={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <OrdersTable
              title={"Orders"}
              cols={[
                "#",
                "User",
                "Address",
                "Phone",
                "Total",
                "Products",
                "Time",
                "Actions",
              ]}
              rows={orders}
              deliver={changeTable}
            />
          </Paper>
        </Grid>
      )}
    </>
  );
}
