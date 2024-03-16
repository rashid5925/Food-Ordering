import ProductCard from "./ProductCard";

export default function Products ({ products }) {
  return(
    <div className="grid sm:grid-cols-3 grid-cols-1 gap-5">
        {products.map((item) => (
          <ProductCard key={item._id} item={item} />
        ))}
    </div>
  );
}
