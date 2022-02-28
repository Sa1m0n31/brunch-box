import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import './static/style/style.css'
import './static/style/admin.css'
import './static/style/mobile.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import HomePage from "./pages/HomePage";
import ReactGA from 'react-ga';
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

import "aos/dist/aos.css";
import AOS from 'aos';
import PanelAboutUs from "./admin/pages/PanelAboutUs";
import ContactPage from "./pages/ContactPage";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PanelOthers from "./admin/pages/PanelOthers";
import PanelCoupons from "./admin/pages/PanelCoupons";
import CustomMenu from "./pages/CustomMenu";
import PanelDelivery from "./admin/pages/PanelDelivery";
import PanelHomepage from "./admin/pages/PanelHomepage";

ReactGA.initialize('G-2YV1L21QB9');
ReactGA.pageview(window.location.pathname + window.location.search);

function App() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
       AOS.init({
           delay: 200,
           duration: 500
       });

       getAllCategories()
           .then(res => {
               setCategories(res.data.result);
           });
    }, []);

  return (<>
          <Helmet>
              <title>BrunchBox - przekąski na każdą okazję</title>
              <meta name="description" content="Nowy koncept- wyselekcjonowane  zestawy fingerfood w eleganckim pudełku. Zamów z 2 godzinnym wyprzedzeniem i ciesz się pysznym jedzeniem z bliskimi." />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Helmet>
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
                <Route path="/kontakt">
                    <ContactPage />
                </Route>
                <Route path="/regulamin">
                    <TermsOfService />
                </Route>
                <Route path="/polityka-prywatnosci">
                    <PrivacyPolicy />
                </Route>

                {/* CATEGORIES */}
                {categories?.map((item, index) => {
                   if(index === 2) {
                       /* Banquet menu */
                       return <Route key={index} path="/przekaski-bankietowe">
                           <CustomMenu />
                       </Route>
                   }
                   else {
                       /* Normal menu */
                       return <Route key={index} path={"/" + convertToURL(item.name)}>
                           <Offer type={item.name} />
                       </Route>
                   }
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
                <Route path="/panel/o-nas">
                    <PanelAboutUs />
                </Route>
                <Route path="/panel/kupony">
                    <PanelCoupons />
                </Route>
                <Route path="/panel/dostawa">
                    <PanelDelivery />
                </Route>
                <Route path="/panel/pozostale">
                    <PanelOthers />
                </Route>
                <Route path="/panel/strona-glowna">
                    <PanelHomepage />
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
      </>
  );
}

export default App;
