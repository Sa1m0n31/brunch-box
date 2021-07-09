import React, { useEffect, useState } from 'react'
import './static/style/style.css'
import './static/style/admin.css'
import './static/style/mobile.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import HomePage from "./pages/HomePage";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Offer from "./pages/Offer";
import SingleProduct from "./pages/SingleProduct";
import CartPage from "./pages/CartPage";
import ShippingAndPaymentPage from "./pages/ShippingAndPaymentPage";
import LoginPage from "./admin/pages/LoginPage";
import PanelPage from "./admin/pages/PanelPage";
import PanelProducts from "./admin/pages/PanelProducts";
import PanelOrders from "./admin/pages/PanelOrders";
import PanelCategories from "./admin/pages/PanelCategories";
import PanelPayment from "./admin/pages/PanelPayment";
import PanelShipping from "./admin/pages/PanelShipping";
import PanelSettings from "./admin/pages/PanelSettings";
import AddProductPage from "./admin/pages/AddProductPage";
import OrderDetails from "./admin/pages/OrderDetails";
import TYPage from "./pages/TYPage";
import {getAllCategories} from "./helpers/categoryFunctions";
import convertToURL from "./helpers/convertToURL";
import PanelBlog from "./admin/pages/PanelBlog";
import AddPostPage from "./admin/pages/AddPostPage";
import BlogPage from "./pages/BlogPage";
import SinglePostPage from "./pages/SinglePostPage";
import AboutUsPage from "./pages/AboutUsPage";

function App() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
       getAllCategories()
           .then(res => {
               setCategories(res.data.result);
           });
    }, []);

  return (
    <div className="App">
        <Router>
            <Switch>
                {/* WEBSITE ROUTES */}
                <Route exact path="/">
                    <HomePage />
                </Route>
                <Route path="/dziekujemy">
                    <TYPage />
                </Route>
                <Route path="/oferta">
                    <Offer type="oferta" />
                </Route>
                <Route path="/blog">
                    <BlogPage />
                </Route>
                <Route path="/wpis">
                    <SinglePostPage />
                </Route>
                <Route path="/o-nas">
                    <AboutUsPage />
                </Route>

                {/* CATEGORIES */}
                {categories.map((item, index) => {
                    return <Route key={index} path={"/" + convertToURL(item.name)}>
                        <Offer type={item.name} />
                    </Route>
                })}

                {/* Page for all products */}
                <Route path="/produkt">
                    <SingleProduct />
                </Route>

                {/* Shipping and payment */}
                <Route path="/dostawa-i-platnosc">
                    <ShippingAndPaymentPage />
                </Route>

                {/* Cart */}
                <Route path="/koszyk">
                    <CartPage />
                </Route>

                {/* ADMIN ROUTES */}
                <Route exact path='/admin'>
                    <LoginPage />
                </Route>
                <Route exact path="/panel">
                    <PanelPage />
                </Route>
                <Route path="/panel/produkty">
                    <PanelProducts />
                </Route>
                <Route path="/panel/zamowienia">
                    <PanelOrders />
                </Route>
                <Route path="/panel/kategorie">
                    <PanelCategories />
                </Route>
                <Route path="/panel/platnosci">
                    <PanelPayment />
                </Route>
                <Route path="/panel/wysylka">
                    <PanelShipping />
                </Route>
                <Route path="/panel/ustawienia">
                    <PanelSettings />
                </Route>
                <Route path="/panel/blog">
                    <PanelBlog />
                </Route>

                {/* Add content pages */}
                <Route path="/panel/dodaj-produkt">
                    <AddProductPage />
                </Route>
                <Route path="/panel/dodaj-wpis">
                    <AddPostPage />
                </Route>

                {/* Order details */}
                <Route path="/panel/szczegoly-zamowienia">
                    <OrderDetails />
                </Route>
            </Switch>
        </Router>
    </div>
  );
}

export default App;
