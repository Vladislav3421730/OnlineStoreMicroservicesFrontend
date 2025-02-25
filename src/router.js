import { Route, Navigate, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Homepage } from './pages/Homepage';
import { ErrorPage } from './pages/ErrorPage';
import { ProductPage, productLoader } from './pages/ProductPage/ProductPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderPage, o, orderLoader } from './pages/OrderPage/OrderPage';
import { LoginPage } from './pages/LoginPage';
import { ErrorForbidden } from './pages/ErrorForbidden';
import { AdminPage } from './pages/AdminPage';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<Homepage />} />
    <Route path="products/:id" element={<ProductPage />} loader={productLoader} errorElement={<ErrorPage />} />
    <Route path="orders" element={<OrdersPage />} errorElement={<ErrorPage />} />
    <Route path="orders/:id" element={<OrderPage />} loader={orderLoader} errorElement={<ErrorPage />} />
    <Route path="admin/panel" element={<AdminPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="error403" element={<ErrorForbidden />} />
  </Route>
))

export default router