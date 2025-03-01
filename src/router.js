import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Homepage } from './pages/Homepage';
import { ErrorPage } from './pages/ErrorPage';
import { ProductPage, productLoader } from './pages/ProductPage/ProductPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderPage, orderLoader } from './pages/OrderPage/OrderPage';
import { LoginPage } from './pages/LoginPage';
import { ErrorForbidden } from './pages/ErrorForbidden';
import { AdminPage } from './pages/AdminPage';
import { UserOrders } from './pages/UserOrders';
import { Products } from './pages/Products';
import { Registration } from './pages/Registration';
import { Account } from './pages/Account/Account';
import { CartPage } from './pages/CartPage';
import { Gallery } from './pages/Gallery/Gallery';
import { AddProductPage } from './pages/AddProductPage/AddProductPage';
import { EditProductPage } from './pages/EditProductPage';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<Homepage />} />
    <Route path="products" element={<Products />} />
    <Route path='products/edit/:id' element={<EditProductPage/>} loader={productLoader} errorElement={<ErrorPage/>}/>
    <Route path="products/:id" element={<ProductPage />} loader={productLoader} errorElement={<ErrorPage />} />
    <Route path="products/add" element={<AddProductPage/>}/>
    <Route path="orders" element={<OrdersPage />} errorElement={<ErrorPage />} />
    <Route path="orders/:id" element={<OrderPage />} loader={orderLoader} errorElement={<ErrorPage />} />
    <Route path="admin/panel" element={<AdminPage />} />
    <Route path="user/orders/:id" element={<UserOrders />} />
    <Route path="registration" element={<Registration />} />
    <Route path="gallery" element={<Gallery />} />
    <Route path="account" element={<Account />} />
    <Route path="cart" element={<CartPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="error403" element={<ErrorForbidden />} />
  </Route>
))

export default router