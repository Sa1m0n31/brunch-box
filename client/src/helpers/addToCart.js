const addToCart = (id, option, size, quantity) => {
    const currentCart = JSON.parse(localStorage.getItem('cart'));

    /* Iterrate over array of products - find if product is on the list */
    currentCart.forEach(item => {
        if(item.id === id) {
            item.option = "test1";
            item.size = "test2";
        }
    })

    localStorage.setItem('cart', JSON.stringify(currentCart));
}

export default addToCart;
