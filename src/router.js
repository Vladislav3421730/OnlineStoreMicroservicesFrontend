import { Route, Navigate, createBrowserRouter, createRoutesFromElements} from 'react-router-dom';
import { Layout } from './components/Layout';
import { Homepage } from './pages/Homepage';
import { ErrorPage} from './pages/ErrorPage';
import { ProductPage, productLoader } from './pages/ProductPage/ProductPage';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout />}>
       <Route index element={<Homepage/>}/>
       <Route path="products/:id" element={<ProductPage />} loader={productLoader} errorElement={<ErrorPage/>} />
    </Route>
  ))
  
export default router