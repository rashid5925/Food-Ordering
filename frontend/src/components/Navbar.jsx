import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import SearchAppBar from "./SearchAppBar";
import { Link, NavLink } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Badge from '@mui/material/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from "../redux/userSlice";
import Swal from "sweetalert2";
import { setFavourites } from '../redux/favouriteSlice';
import { setCart } from '../redux/cartSlice';

const navigation = [
  { name: "Home", to: "/" },
  { name: "Shop", to: "shop" },
  { name: "About", to: "about" },
  { name: "Contact", to: "contact" },
];

export default function Navbar() {
  const { amount } = useSelector((state) => state.cart);
  const { count } = useSelector((state) => state.favourite);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const logout = () => {
    localStorage.clear();
    dispatch(removeUser());
    dispatch(setFavourites([]));
    dispatch(setCart([]));
    Swal.fire({
      title: "Success!",
      text: "You have been logged out!",
      icon: "success",
    });
  }
  return (
    <Disclosure as="nav" className="bg-transparent z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link to='/'>
                    <img
                      className="h-10 w-auto"
                      src="./images/logo.svg"
                      alt="Your Company"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        className={({ isActive }) =>
                          isActive
                            ? `text-black rounded-md px-3 py-2 text-base font-medium`
                            : `text-[#79787e] hover:text-black rounded-md px-3 py-2 text-base font-medium`
                        }
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                    {
                      user && user.admin ? 
                      <NavLink
                        to='/admin'
                        className='text-[#79787e] hover:text-black rounded-md px-3 py-2 text-base font-medium'
                      >
                        Admin
                      </NavLink>
                      :
                      <></>
                    }
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="hidden sm:ml-6 sm:block">
                  <SearchAppBar />
                </div>
                {user ? 
                <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="relative flex rounded-full text-sm ring-1 ring-grey-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="./images/default_user.png"
                      alt=""
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <NavLink
                          to="/profile"
                          className={({ isActive }) =>
                          isActive
                            ? `bg-gray-100 block px-4 py-2 text-sm text-gray-700`
                            : `block px-4 py-2 text-sm text-gray-700`
                          }
                        >
                          Your Profile
                        </NavLink>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <NavLink
                          to="/orders"
                          className={({ isActive }) =>
                          isActive
                            ? `bg-gray-100 block px-4 py-2 text-sm text-gray-700`
                            : `block px-4 py-2 text-sm text-gray-700`
                          }
                        >
                          Orders
                        </NavLink>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className='block px-4 py-2 text-sm text-gray-700'
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
                :
                <Link to='/login' className="py-2 px-5 bg-[#e10f37] text-white rounded-full hover:bg-[#e8e8f4] hover:text-black">
                  Login / Signup
                </Link>
                }
                <div className="hidden sm:ml-6 sm:block">
                  <Link to='favourites' className="text-[#e10f37] p-2 ms-1 rounded-full hover:bg-[#e10f37] hover:text-white">
                    <Badge badgeContent={count} color="success">
                      <FavoriteBorderIcon />
                    </Badge>
                  </Link>
                  <Link to='cart' className="text-[#e10f37] p-2 rounded-full hover:bg-[#e10f37] hover:text-white">
                    <Badge badgeContent={amount} color="success">
                      <ShoppingCartIcon />
                    </Badge>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  as="a"
                  to={item.to}
                  className={({ isActive }) =>
                    isActive
                      ? `block text-black rounded-md px-3 py-2 text-base font-medium`
                      : `block text-[#79787e] hover:text-black rounded-md px-3 py-2 text-base font-medium`
                  }
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
            <div className="mx-2">
              <SearchAppBar />
              <Link to='favourites' className="text-[#e10f37] p-2 ms-1 rounded-full hover:bg-[#e10f37] hover:text-white">
                <Badge badgeContent={count} color="success">
                  <FavoriteBorderIcon />
                </Badge>
              </Link>
              <Link to='cart' className="text-[#e10f37] p-2 rounded-full hover:bg-[#e10f37] hover:text-white">
                <Badge badgeContent={amount} color="success">
                  <ShoppingCartIcon />
                </Badge>
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
