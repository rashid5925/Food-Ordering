import { Grid, Paper, Skeleton } from "@mui/material";
import StatsCard from "../components/StatsCard";
import { useEffect, useState } from "react";
import API from "../axios";
import OrdersTable from "../components/OrdersTable";

export default function Dashboard() {
  const [totalOrder, setTotalOrder] = useState("");
  const [totalEarning, setTotalEarning] = useState("");
  const [monthlyOrders, setMonthlyOrders] = useState("");
  const [pendingOrders, setPendingOrders] = useState(null);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  useEffect(() => {
    const getAnalytics = async () => {
      const token = localStorage.getItem("access-token");
      if (token) {
        try {
          const responseCount = await API.get("/admin/orders/count", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (responseCount.status === 200) {
            const data = await responseCount.data;
            setTotalOrder(data.count);
          }
          const responseTotal = await API.get("/admin/orders/earnings", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (responseTotal.status === 200) {
            const data = await responseTotal.data;
            setTotalEarning(data.total);
          }
          const responseMonthly = await API.get("/admin/orders/monthlyorders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (responseMonthly.status === 200) {
            const data = await responseMonthly.data;
            setMonthlyOrders(data.orders);
            setLoadingCards(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    getAnalytics();
  }, []);
  useEffect(() => {
    getOrder();
  }, []);
  const getOrder = async () => {
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const responseOrders = await API.get("/admin/orderspending", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (responseOrders.status === 200) {
          const data = await responseOrders.data;
          setPendingOrders(data);
          setLoadingTable(false);
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
      {loadingCards ? (
        <div className="grid grid-cols-1 ms-1 sm:grid-cols-3 gap-2 mb-2">
          <Skeleton variant="rectangular" width={240} height={180} />
          <Skeleton variant="rectangular" width={240} height={180} />
          <Skeleton variant="rectangular" width={240} height={180} />
        </div>
      ) : (
        <>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 180,
              }}
            >
              <StatsCard
                title={"Monthly Orders"}
                body1={`${monthlyOrders}`}
                body2={new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 180,
              }}
            >
              <StatsCard
                title={"Total Earnings"}
                body1={`Rs. ${totalEarning}`}
                body2={"All Time"}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 180,
              }}
            >
              <StatsCard
                title={"Total Orders"}
                body1={`${totalOrder}`}
                body2={"All Time"}
              />
            </Paper>
          </Grid>
        </>
      )}
      {loadingTable ? (
        <Skeleton variant="rectangular" width={740} height={280} />
      ) : (
        <Grid item md={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <OrdersTable
              title={"Pending Orders"}
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
              rows={pendingOrders}
              deliver={changeTable}
            />
          </Paper>
        </Grid>
      )}
    </>
  );
}
