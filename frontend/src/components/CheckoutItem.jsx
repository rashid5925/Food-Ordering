export default function CheckoutItem({ item }) {
  return (
    <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
      <div className="flex flex-col rounded-lg bg-white sm:flex-row">
        <img
          className="m-2 h-24 w-28 rounded-md border object-cover object-center"
          src={item.product.image}
          alt=""
        />
        <div className="flex w-full flex-col px-4 py-4">
          <span className="font-semibold">{item.product.title}</span>
          <span className="float-right text-gray-400">
            Rs. {item.product.price} X {item.amount}
          </span>
          <p className="text-lg font-bold">
            Total: Rs. {item.product.price * item.amount}
          </p>
        </div>
      </div>
    </div>
  );
}
