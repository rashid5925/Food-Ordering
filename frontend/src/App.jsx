import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './pages/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contactus from './pages/Contactus';
import Shop from './pages/Shop';
import Favourites from './pages/Favourites';
import Cart from './pages/Cart';
import Product from './pages/Product';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { removeUser, setUser } from './redux/userSlice';
import API from './axios';
import { setFavourites } from './redux/favouriteSlice';
import { setCart } from './redux/cartSlice';
import Swal from 'sweetalert2';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import OrderDetail from './pages/OrderDetails';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Search from './pages/Search';
import DashboardLayout from './dashboard/DashboardLayout';
import Dashboard from './dashboard/Dashboard';
import Charts from './dashboard/Charts';
import OrdersAdmin from './dashboard/Orders';
import Customers from './dashboard/Customers';
import Categories from './dashboard/Categories';
import AddProduct from './dashboard/AddProduct';
import Products from './dashboard/Products';
import EditProduct from './dashboard/EditProduct';
import Contacts from './dashboard/Contacts';


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const setStates = async () => {
      const token = localStorage.getItem('access-token');
      if (token) {
        const user = jwtDecode(token);
        dispatch(setUser(user));
        try {
          const response = await API.get('/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            const data = await response.data;
            dispatch(setFavourites(data.wishlist));
            dispatch(setCart(data.cart));
          } else {
            localStorage.clear();
            dispatch(removeUser());
          }
        } catch (error) {
          localStorage.clear();
          dispatch(removeUser());
          Swal.fire({
            title: "Warning!",
            text: "You have been logged out!",
            icon: "warning",
          });
        }
      }
    }
    setStates();
  }, []);
  
  const { user } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='shop' element={<Shop />} />
          <Route path='search/:search' element={<Search />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contactus />} />
          <Route path='profile' element={user ? <Profile /> : <Navigate to='/login' />} />
          <Route path='favourites' element={user ? <Favourites /> : <Navigate to='/login' />} />
          <Route path='cart' element={user ? <Cart /> : <Navigate to='/login' />} />
          <Route path='orders' element={user ? <Orders /> : <Navigate to='/login' />} />
          <Route path='order/:id' element={user ? <OrderDetail /> : <Navigate to='/login' />} />
          <Route path='checkout' element={user ? <Checkout /> : <Navigate to='/login' />} />
          <Route path='success' element={user ? <Success /> : null} />
          <Route path='cancel' element={user ? <Cancel /> : null} />
          <Route path='product/:id' element={<Product />} />
          <Route path='login' element={!user ? <Login /> : <Navigate to='/' />} />
          <Route path='signup' element={!user ? <Signup /> : <Navigate to='/' />} />
        </Route>
        <Route path='/admin' element={ <DashboardLayout /> } >
          <Route index element={user && user.admin ? <Dashboard /> : <Navigate to='/login' />} />
          <Route path='orders' element={user && user.admin ? <OrdersAdmin /> : <Navigate to='/login' />} />
          <Route path='charts' element={user && user.admin ? <Charts /> : <Navigate to='/login' />} />
          <Route path='products' element={user && user.admin ? <Products /> : <Navigate to='/login' />} />
          <Route path='categories' element={user && user.admin ? <Categories /> : <Navigate to='/login' />} />
          <Route path='addproduct' element={user && user.admin ? <AddProduct /> : <Navigate to='/login' />} />
          <Route path='editproduct/:id' element={user && user.admin ? <EditProduct /> : <Navigate to='/login' />} />
          <Route path='customers' element={user && user.admin ? <Customers /> : <Navigate to='/login' />} />
          <Route path='contacts' element={user && user.admin ? <Contacts /> : <Navigate to='/login' />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
