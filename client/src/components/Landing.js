import React from 'react'
import logo from '../static/img/brunch-box-logo.png'

const Landing = () => {
    return <main className="landing">
        <div className="landing__content">
            <img className="landing__logo" src={logo} alt="brunch-box-logo" />
            <h1 className="landing__header">
                Przekąski na <b>każdą okazję</b>
            </h1>
            <button className="button button--landing">
                <a className="button--landing__link" href="#zestawy">
                    Zobacz dostępne zestawy
                </a>
            </button>
        </div>
    </main>
}

export default Landing;
