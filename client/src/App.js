import React from 'react'
import './static/style/style.css'
import './static/style/mobile.css'
import HomePage from "./pages/HomePage";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Offer from "./pages/Offer";
import SingleProduct from "./pages/SingleProduct";
import CartPage from "./pages/CartPage";
import ShippingAndPaymentPage from "./pages/ShippingAndPaymentPage";

function App() {
  return (
    <div className="App">
        <Router>
            <Switch>
                <Route exact path="/">
                    <HomePage />
                </Route>
                <Route path="/oferta-indywidualna">
                    <Offer type="indywidualna" />
                </Route>
                <Route path="/dla-grup">
                    <Offer type="grupowa" />
                </Route>
                <Route path="/menu-bankietowe">
                    <Offer type="bankietowa" />
                </Route>

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
            </Switch>
        </Router>
    </div>
  );
}

export default App;
