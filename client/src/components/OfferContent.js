import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import productImg from '../static/img/product-image.png'

const OfferContent = ({type}) => {
    const [title, setTitle] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("");

    const dummyData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].fill({
        title: "Date Box (Romantyczny wieczór)",
        price: 119,
        link: "date-box"
    }, 0, 10);

    useEffect(() => {
        if(type === "indywidualna") {
            setTitle("Oferta indywidualna: pudełko");
            setDeliveryTime("(dostawa w 2-3 godziny)");
        }
        else if(type === "bankietowa") {
            setTitle("Menu Bankietowe");
            setDeliveryTime("(dostawa od 48 godzin)");
        }
        else {
            setTitle("Oferta dla grup: Pudełko");
            setDeliveryTime("(dostawa od 36 godzin)");
        }
    }, []);

    return <main className="offerContent">
        <h1 className="offerContent__header">
            {title} <span className="thin">{deliveryTime}</span>
        </h1>

        <div className="offerContent__grid">
            {dummyData.map((item, index) => (
                <Link className="offerContent__item"
                      key={index}
                      to={{
                       pathname: `/produkt/${item.link}`,
                       state: {
                           title: item.title,
                           price: item.price
                       }
                      }}
                >
                    <div className="offerContent__item__border">
                        <h3 className="offerContent__item__header">
                            {item.title}
                        </h3>
                        <img className="offerContent__item__img" src={productImg} alt="produkt" />
                    </div>
                    <button className="offerContent__item__btn">
                        Więcej informacji
                    </button>
                </Link>
            ))}
        </div>
    </main>
}

export default OfferContent;
