import { Grid, Paper, Skeleton } from "@mui/material";
import Chart from "../components/Chart";
import { useEffect, useState } from "react";
import API from "../axios";

export default function Charts() {
    const [loadingTen, setLoadingTen] = useState(true);
    const [tenDaysOrder, setTenDaysOrder] = useState(null);
    const [loadingMonth, setLoadingMonth] = useState(true);
    const [monthOrder, setMonthOrder] = useState(null);
    useEffect(() => {
      getOrders();
      getOrdersMonth();
    }, []);
  
    const getOrders = async () => {
      const token = localStorage.getItem("access-token");
      if (token) {
        try {
          const response = await API.get("/admin/orders/tendays", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            const data = await response.data;
            setTenDaysOrder(data);
            setLoadingTen(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    const getOrdersMonth = async () => {
      const token = localStorage.getItem("access-token");
      if (token) {
        try {
          const response = await API.get("/admin/orders/month", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            const data = await response.data;
            setMonthOrder(data);
            setLoadingMonth(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
  return (
    <>
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 420,
          }}
        >
          {loadingTen ? 
          <Skeleton variant="rectangular" width={740} height={280} />
          :
          <Chart data={tenDaysOrder} title={"Daily"} />
          }
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 420,
          }}
        >
          {loadingMonth ? 
          <Skeleton variant="rectangular" width={740} height={280} />
          :
          <Chart data={monthOrder} title={"Monthly"} />
          }
        </Paper>
      </Grid>
    </>
  );
}
