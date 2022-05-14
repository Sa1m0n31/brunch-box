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
import PanelSlider from "./admin/pages/PanelSlider";

ReactGA.initialize('G-2YV1L21QB9');
ReactGA.pageview(window.location.pathname + window.location.search);

const LangContext = React.createContext(null);

function App() {
    const [categories, setCategories] = useState([]);
    const [langIndex, setLangIndex] = useState(localStorage.getItem('langIndex') ? parseInt(localStorage.getItem('langIndex')) : 0);

    const content = [
        {
            homepageHeader: 'Każde zamówienie pakujemy z wielką starannością i załączamy specjalną dedykację dla Ciebie!',
            homepageCallToAction: 'Zamów teraz',
            phone: 'Telefon',
            orderNow: 'Zamów teraz',
            menu: ['Strona główna', 'O nas', 'Menu', 'Kontakt'],
            footerCopyright: 'Wszelkie prawa zastrzeżone',
            footerMenu: ['Polityka prywatności', 'Regulamin', 'Kontakt'],
            cartHeader: 'Podsumowanie koszyka',
            cartCols: ['Nazwa produktu', 'Opcja', 'Rozmiar', 'Ilość', "Wartość", 'Działania'],
            cartSum: 'Łącznie do zapłaty',
            cartBtn: 'Przejdź dalej',
            checkoutHeader: 'Wpisz swoje dane i dokończ zamówienie',
            checkoutSubheaders: ['Wybierz dzień dostawy', 'Wybierz godzinę dostawy', 'Dane osobowe', 'Pozostałe informacje'],
            checkoutForm: ['Twoje imię', 'Twoje nazwisko', 'Adres e-mail', 'Numer telefonu', 'Miejscowość', 'Kod pocztowy', 'Ulica, numer domu, numer mieszkania'],
            checkoutCheckboxes: ['Odbiór osobisty', 'Płatność przy odbiorze', 'Płatność gotówką', 'Płatność kartą', 'Mam kupon rabatowy', 'Wstążka z dedykacją', 'Chcę otrzymać fakturę'],
            checkoutCompanyForm: ['Nazwa firmy', 'NIP', 'Miejscowość', 'Kod pocztowy', 'Ulica, numer domu, numer mieszkania'],
            checkoutDiscountCodeInput: 'Tu wpisz swój kupon',
            checkoutDiscountCodeBtn: 'Dodaj kupon',
            checkoutDiscountCodeError: 'Podany kupon rabatowy nie istnieje',
            checkoutDiscountCodeSuccess: ['Kupon', 'Zniżka'],
            checkoutFromTo: ['Od kogo', 'Dla kogo'],
            checkoutTextarea: 'Komentarz do zamówienia (opcjonalnie)',
            checkoutDelivery: 'Dostawa',
            checkoutBtn: 'Przechodzę do płatności',
            checkoutBackToCart: 'Powrót do koszyka',
            offerSubheader: 'Wybierz idealny zestaw skomponowany do Twoich potrzeb.',
            offerBtn: 'Zamów teraz',
            availableSizes: 'Dostępne rozmiary',
            availableOptions: 'Dostępne opcje',
            addToCart: 'Dodaj do koszyka',
            meatVersion: 'Mieszana',
            vegeVersion: 'Wegetariańska',
            allergens: 'Alergeny',
            addedToCart: "Produkt został dodany do koszyka",
            halfBoxError: 'Połowa boxa została dodana do koszyka. Uzupełnij swój box o drugą połówkę.',
            cartHalfBoxError: 'Musisz skompletować całkowitą liczbę boxów',
            continueShopping: 'Kontynuuj zakupy',
            goToCheckout: 'Przejdź do kasy',
            chooseSecondHalf: 'Wybierz drugą połowę',
            aboutUs: 'O nas',
            emptyCart: 'Twój koszyk jest pusty',
            backToShop: 'Wróć do sklepu',
            noDelivery: 'Brak możliwości dostawy na podany adres',
            checkoutMobile: 'Wybierz datę i godzinę zamówienia',
            aboutUsBtn: 'Zobacz dostępne zestawy',
            bestsellers: 'Bestsellery',
            newProducts: 'Nowości',
            ty: 'Dziękujemy za złożenie zamówienia!',
            ty2: 'Wkrótce dostarczymy je pod Twoje drzwi!',
            ty3: 'Wróć na stronę główną'
        },
        {
            homepageHeader: 'Each order is packed with special care by our team and we\'ll even include a message from you!',
            homepageCallToAction: 'Order now',
            phone: 'Phone',
            orderNow: 'Order now',
            menu: ['Homepage', 'About us', 'Menu', 'Contact'],
            footerCopyright: 'All rights reserved',
            footerMenu: ['Privacy policy', 'Terms of service', 'Contact'],
            cartHeader: 'Cart',
            cartCols: ['Product name', 'Option', 'Size', 'Quantity', "Total", 'Edit'],
            cartSum: 'Total',
            cartBtn: 'Next',
            checkoutHeader: 'Fill the data',
            checkoutSubheaders: ['Choose day of delivery', 'Choose hour of delivery', 'Personal data', 'Additional information'],
            checkoutForm: ['First name', 'Last name', 'E-mail', 'Phone number', 'City', 'Postal code', 'Street, building, flat'],
            checkoutCheckboxes: ['Collection', 'Payment on delivery', 'Cash', 'Card', 'Discount code', 'Dedication', 'Get invoice'],
            checkoutCompanyForm: ['Company name', 'NIP', 'City', 'Postal code', 'Street, building, flat'],
            checkoutDiscountCodeInput: 'Your discount code',
            checkoutDiscountCodeBtn: 'Add discount code',
            checkoutDiscountCodeError: 'Discount code does not exists',
            checkoutDiscountCodeSuccess: ['Code', 'Discount'],
            checkoutFromTo: ['From', 'To'],
            checkoutTextarea: 'Additional comment (optionally)',
            checkoutDelivery: 'Delivery',
            checkoutBtn: 'Go pay',
            checkoutBackToCart: 'Back to cart',
            offerSubheader: 'Choose your perfect box',
            offerBtn: 'Order now',
            availableSizes: 'Available sizes',
            availableOptions: 'Available options',
            addToCart: 'Add to cart',
            meatVersion: 'Mix',
            vegeVersion: 'Vege',
            allergens: 'Allergens',
            addedToCart: "Produkt added to cart",
            halfBoxError: 'First half of the box has been added to cart. Fulfill your box with second half.',
            cartHalfBoxError: 'You have to complete full box',
            continueShopping: 'Continue',
            goToCheckout: 'Checkout',
            chooseSecondHalf: 'Choose second half',
            aboutUs: 'About us',
            emptyCart: 'Your cart is empty',
            backToShop: 'Back to shop',
            noDelivery: 'Sorry, we are not deliver to your location',
            checkoutMobile: 'Choose day and hour of delivery',
            aboutUsBtn: 'Choose your box',
            bestsellers: 'Bestsellers',
            newProducts: 'New',
            ty1: 'Thank you for your order!',
            ty2: 'Soon we will deliver it to you',
            ty3: 'Back to homepage'
        }
    ];

    useEffect(() => {
        localStorage.setItem('langIndex', langIndex.toString());
    }, [langIndex]);

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
        <LangContext.Provider value={{
            content: content[langIndex],
            langIndex,
            changeLanguage: setLangIndex
        }}>
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
                        <Route path="/panel/slider">
                            <PanelSlider />
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
        </LangContext.Provider>
      </>
  );
}

export default App;
export { LangContext }
