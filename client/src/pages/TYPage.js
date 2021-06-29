import React from 'react'
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";

const TYPage = () => {
    return <>
        <TopMenu />
        <main className="tyPage">
            <h1 className="ty__header">
                Dziękujemy za złożenie zamówienia!
            </h1>
            <h2 className="ty__subheader">
                Wkrótce dostarczymy je pod Twoje drzwi!
            </h2>

            <button className="button button--landing button--ty marginTop30">
                <a className="button--landing__link" href="/">
                    Wróć na stronę główną
                </a>
            </button>
        </main>
        <Footer />
    </>
}

export default TYPage;
