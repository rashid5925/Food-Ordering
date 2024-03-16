import { useEffect, useState } from "react";
import Products from "../components/Products";
import Skeleton from "@mui/material/Skeleton";
import API from "../axios";
import { useParams } from "react-router-dom";

export default function Search() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const response = await API.get(`/product/search/${search}`);
      if (response.status === 200) {
        const data = await response.data;
        setProducts(data);
        setLoading(false);
      }
    };
    fetchData();
  }, [search]);

  return (
    <div className="bg-white">
      <div>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Search
            </h1>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Product grid */}
              <div className="lg:col-span-4">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Skeleton variant="rectangular" width={280} height={270} />
                    <Skeleton variant="rectangular" width={280} height={270} />
                    <Skeleton variant="rectangular" width={280} height={270} />
                    <Skeleton variant="rectangular" width={280} height={270} />
                    <Skeleton variant="rectangular" width={280} height={270} />
                  </div>
                ) : (
                  <>
                    {products.length > 0 ? (
                      <Products products={products} />
                    ) : (
                      <h3>No Product to show!</h3>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
