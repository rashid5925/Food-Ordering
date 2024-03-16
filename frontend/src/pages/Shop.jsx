import { Fragment, useEffect, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import Products from "../components/Products";
import Skeleton from "@mui/material/Skeleton";
import API from "../axios";
import Loader from "../components/Loader";

const sortOptions = [
  { name: "Price: Low to High", by: "price", sort: "1" },
  { name: "Price: High to Low", by: "price", sort: "-1" },
];

const filters = {
  id: "Price",
  name: "Price",
  options: [
    { min: 0, max: 100, label: "Rs. 0 - Rs. 100" },
    { min: 100, max: 500, label: "Rs. 100 - Rs. 500" },
    { min: 500, max: 1000, label: "Rs. 500 - Rs. 1000" },
    { min: 1000, max: 5000, label: "Rs. 1000 - Rs. 5000" },
    { min: 5000, max: Infinity, label: "Rs. 5000+" },
    { min: 0, max: Infinity, label: "All" },
  ],
};

export default function Shop() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSideBar, setLoadingSideBar] = useState(true);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("*");
  const [minMax, setMinMax] = useState([0, Infinity]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const response = await API.get("/categories");
        if (response.status === 200) {
          const data = await response.data;
          setCategories(data);
          setLoadingSideBar(false);
        }
      } catch (error) {
        setError(true);
      }
    };
    const fetchData = async () => {
      try {
        const response = await API.get("/products");
        if (response.status === 200) {
          const data = await response.data;
          setProducts(data);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
      }
    };
    fetchData();
    fetchSidebar();
  }, []);

  const filterProducts = async (category, min, max) => {
    setLoading(true);
    setCategory(category);
    setMinMax([min, max]);
    try {
      const response = await API.get(`/productsfilter/${category}/${min}/${max}`);
      if (response.status === 200) {
        const data = await response.data;
        setProducts(data);
        setLoading(false);
      }
    } catch (error) {
      setError(true);
    }
  };

  const sortProducts = async (by, sort) => {
    setLoading(true);
    try {
      const response = await API.get(`/productssorted/${by}/${sort}`);
      if (response.status === 200) {
        const data = await response.data;
        setProducts(data);
        setLoading(false);
      }
    } catch (error) {
      setError(true);
    }
  };

  if (error) return <h3>An error occured. Please try to refresh!</h3>;

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>
                    {loadingSideBar ? (
                      <Loader />
                    ) : (
                      <ul
                        role="list"
                        className="px-2 py-3 font-medium text-gray-900"
                      >
                        <li>
                            <button
                              onClick={() => filterProducts("*", minMax[0], minMax[1])}
                              className="block px-2 py-3"
                            >
                              All
                            </button>
                          </li>
                        {categories.map((category) => (
                          <li key={category._id}>
                            <button
                              onClick={() => filterProducts(category.name, minMax[0], minMax[1])}
                              className="block px-2 py-3"
                            >
                              {category.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <Disclosure
                      as="div"
                      key={filters.id}
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {filters.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {filters.options.map((option, optionIdx) => (
                                <div
                                  key={optionIdx}
                                  className="flex items-center"
                                >
                                  <button
                                onClick={() => filterProducts(category, option.min, option.max)}
                                className="ml-3 text-sm text-gray-600 hover:bg-slate-200"
                              >
                                {option.label}
                              </button>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Shop
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                            <button
                              onClick={() =>
                                sortProducts(option.by, option.sort)
                              }
                              className="font-medium text-gray-500 p-2"
                            >
                              {option.name}
                            </button>
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <div className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
                {loadingSideBar ? (
                  <Loader />
                ) : (
                  <ul
                    role="list"
                    className="px-2 py-3 font-medium text-gray-900"
                  >
                    <li>
                        <button
                          onClick={() => filterProducts("*", minMax[0], minMax[1])}
                          className="block px-2 py-3"
                        >
                          All
                        </button>
                      </li>
                    {categories.map((category) => (
                      <li key={category._id}>
                        <button
                          onClick={() => filterProducts(category.name, minMax[0], minMax[1])}
                          className="block px-2 py-3"
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <Disclosure
                  as="div"
                  key={filters.id}
                  className="border-b border-gray-200 py-6"
                >
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            {filters.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {filters.options.map((option, optionIdx) => (
                            <div
                              key={optionIdx}
                              className="flex items-center"
                            >
                              <button
                                onClick={() => filterProducts(category, option.min, option.max)}
                                className="ml-3 text-sm text-gray-600 px-3 py-1 rounded-md hover:bg-slate-100"
                              >
                                {option.label}
                              </button>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>

              {/* Product grid */}
              <div className="lg:col-span-3">
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
                    {products.length > 0 ?
                    <Products products={products} />
                    :
                    <h3>No Product to show!</h3>
                    }
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
