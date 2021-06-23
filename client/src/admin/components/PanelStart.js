import React from 'react'
import back from '../static/img/back.png'
import settings from "../helpers/settings";

const PanelStart = () => {
    return <main className="panelContent">
        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Start
            </h1>

            <a className="panelContent__header__back" href={settings.homepage}>
                Wróć na stronę główną
                <img className="panelContent__header__back__img" src={back} alt="wroc-na-strone-glowna" />
            </a>
        </header>
    </main>
}

export default PanelStart;
