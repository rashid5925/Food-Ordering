import { getData } from "../utils/fetchData";
import Skeleton from '@mui/material/Skeleton';
import Products from "./Products";

export default function FeaturedProducts ({ title }) {
  const [products, loading, error] = getData('/featuredproducts');
  if (error) return <></>;
  return(
    <div className="flex flex-col mt-10 justify-center items-center mx-3">
        <h2 className="text-4xl mb-4 text-[#e10f37]">{title}</h2>
        {loading ? 
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton variant="rectangular" width={320} height={270} />
          <Skeleton variant="rectangular" width={320} height={270} />
          <Skeleton variant="rectangular" width={320} height={270} />
        </div>
        :
        products.length == 0 ? <></>
        :<Products products={products} />}
    </div>
  );
}
