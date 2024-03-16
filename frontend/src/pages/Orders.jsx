import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import API from "../axios";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getOrders = async () => {
      const token = localStorage.getItem("access-token");
      if (token) {
        const response = await API.get(`/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          const data = await response.data;
          setOrders(data);
          setLoading(false);
        }
      }
    };
    getOrders();
  }, []);
  return (
    <div className="mx-3 sm:mx-40 mt-4 sm:mt-12 min-h-screen">
      <div className="flex justify-start mb-3 item-start space-y-2 flex-col">
        <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
          Orders
        </h1>
      </div>
      {loading ? (
        <>
          <Skeleton animation="wave" height={120} />
          <Skeleton animation="wave" height={120} />
          <Skeleton animation="wave" height={120} />
          <Skeleton animation="wave" height={120} />
        </>
      ) : (
        <>
          <ul role="list" className="divide-y divide-gray-100">
          {orders.map((order) => (
              <Link
                key={order._id}
                to={`/order/${order._id}`}
                className="flex flex-col hover:bg-slate-100 sm:px-4 sm:rounded-lg sm:flex-row text-center sm:text-start justify-between gap-x-6 py-5"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm truncate font-semibold leading-6 text-gray-900">
                      {order.email} 
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {order.address}
                    </p>
                    {!order.rated && order.delivered ? <p className="text-[#e10f37]">Please Rate</p>: ''}
                  </div>
                </div>
                <div className="sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900 truncate">#{order._id}</p>
                  {order.delivered ? (
                    <div className="mt-1 flex items-center gap-x-1.5">
                      <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-xs leading-5 text-gray-500">
                        Delivered
                      </p>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center justify-center gap-x-1.5">
                      <div className="flex-none rounded-full bg-yellow-500/20 p-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                      </div>
                      <p className="text-xs leading-5 text-gray-500">Pending</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
