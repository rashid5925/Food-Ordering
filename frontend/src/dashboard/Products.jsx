import { Grid, Paper, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import ProductsTable from "../components/ProductsTable";
import API from "../axios";

export default function Products () {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState(null);
    useEffect(() => {
      getProducts();
    }, []);
  
    const getProducts = async () => {
      const token = localStorage.getItem("access-token");
      if (token) {
        try {
          const response = await API.get("/admin/products", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            const data = await response.data;
            setProducts(data);
            setLoading(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
  
    const changeTable = () => {
        getProducts();
    };
  
    return (
      <>
        {loading ? (
          <Skeleton variant="rectangular" width={740} height={280} />
        ) : (
          <Grid item md={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <ProductsTable
                title={"Products"}
                cols={[
                  "#",
                  "Title",
                  "Price",
                  "Category",
                  "Ratings",
                  "Featured",
                  "Actions",
                ]}
                rows={products}
                deliver={changeTable}
              />
            </Paper>
          </Grid>
        )}
      </>
    );
}
