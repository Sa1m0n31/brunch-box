import React from 'react'

const AboutUsSection = ({left, image, title, content}) => {
    return <section className="aboutUs__section">
        <img className={left ? "aboutUs__img" : "aboutUs__img order-2"} src={image} alt={title} />

        <section className={left ? "aboutUs__content" : "aboutUs__content order-1 textAlignRight"}>
            <h2 className="aboutUs__header">
                {title}
            </h2>
            <section className="aboutUs__text">
                {content.map(item => (
                    <p className="aboutUs__p">
                        {item}
                    </p>
                ))}
            </section>
        </section>
    </section>
}

export default AboutUsSection;
