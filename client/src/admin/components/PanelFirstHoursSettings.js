import React, { useState, useEffect } from 'react'
import axios from "axios";

const PanelFirstHoursSettings = () => {
    const [groupHours, setGroupHours] = useState(null);
    const [banquetHours, setBanquetHours] = useState(null);
    const [added, setAdded] = useState(-1);

    useEffect(() => {
        axios.get("https://brunchbox.pl/dates/get-first-hours-excluded")
            .then(res => {
                if(res.data.result) {
                    setGroupHours(res.data.result.group_menu);
                    setBanquetHours(res.data.result.banquet_menu);
                }
            })
    }, []);

    useEffect(() => {
        if(added !== -1) {
            setTimeout(() => {
                setAdded(-1);
            }, 3000);
        }
    }, [added]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("https://brunchbox.pl/dates/update-first-hours-excluded", {
            groupHours, banquetHours
        })
            .then(res => {
                if(res.data.result) {
                    setAdded(1);
                }
                else {
                    setAdded(0);
                }
            });
    }

    return <>
        <main className="panelContent__frame cart">
            <h2 className="shippingAndPayment__header">
                Ilość godzin (okien czasowych) wyłączonych z dostawy
            </h2>

            {added === -1 ? <form className="panelContent__form form--firstHours" onSubmit={(e) => { handleSubmit(e); }}>
                <label className="addProduct__label--frame addProduct__label--frame--margin">
                    Koszyk zawierający co najmniej jeden produkt z menu grupowego
                    <input className="addProduct__input"
                           name="groupMenu"
                           type="number"
                           value={groupHours}
                           onChange={(e) => { setGroupHours(e.target.value); }}
                           placeholder="Menu grupowe" />
                </label>

                <label className="addProduct__label--frame addProduct__label--frame--margin">
                    Koszyk zawierający co najmniej jeden produkt z menu bankietowego
                    <input className="addProduct__input"
                           name="banquetMenu"
                           type="number"
                           value={banquetHours}
                           onChange={(e) => { setBanquetHours(e.target.value); }}
                           placeholder="Menu bankietowe" />
                </label>

                <button className="addProduct__btn marginTop10" type="submit">
                    Edytuj
                </button>
            </form> : <h2 className='info'>
                {added === 1 ? "Godziny zostały zaktualizowane" : "Coś poszło nie tak... Prosimy spróbować później"}
            </h2>}
        </main>
        </>
}

export default PanelFirstHoursSettings;
