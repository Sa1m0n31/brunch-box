const editCart = (id, option, size, quantity) => {
    let currentCart = JSON.parse(localStorage.getItem('sec-cart'));

   /* Iterrate over array of products - find if product is on the list */
   let newProduct = 1;
   if(currentCart?.length) {
       currentCart.forEach(item => {
           if((item.id === id)&&(item.size === size)&&(item.option === option)) {
               item.quantity += 1;
               newProduct = 0;
           }
       });
       if(newProduct) {
           currentCart.push({
               id,
               option,
               size,
               quantity
           });
       }
   }
   else {
       currentCart = [{
           id,
           option,
           size,
           quantity
       }]
   }

    localStorage.setItem('sec-cart', JSON.stringify(currentCart));
}

const addToCartBanquet = (cartInfo) => {
    if(localStorage.getItem('sec-cart-banquet')) {
        const currentCart = JSON.parse(localStorage.getItem('sec-cart-banquet'));
        currentCart.push(cartInfo);
        localStorage.setItem('sec-cart-banquet', JSON.stringify(currentCart));
    }
    else {
        localStorage.setItem('sec-cart-banquet', JSON.stringify([cartInfo]));
    }
}

const deleteFromCart = ({ uuid, id, size, option, banquet }) => {
    if(banquet) {
        let currentCart = JSON.parse(localStorage.getItem('sec-cart-banquet'));

        const newCart = [];
        currentCart.forEach((item) => {
            newCart.push(item.filter((itemChild) => {
                return uuid !== itemChild.uuid;
            }));
        });

        localStorage.setItem('sec-cart-banquet', JSON.stringify(newCart));
    }
    else {
        let currentCart = JSON.parse(localStorage.getItem('sec-cart'));

        const newCart = currentCart.filter((item) => {
            return item.id !== id || item.size !== size || item.option !== option;
        });

        if(newCart.length === 0) localStorage.removeItem('sec-cart');
        else localStorage.setItem('sec-cart', JSON.stringify(newCart));
    }
}

const calculatePrice = (size, option, quantity, prices) => {
    let price;
    if(size === "M") {
        if(option === "Mięsna") price = prices.mMeat;
        else price = prices.mVege;
    }
    else {
        if(option === "Mięsna") price = prices.lMeat;
        else price = prices.lVege;
    }

    price *= quantity;
    return price;
}

export { editCart, deleteFromCart, calculatePrice, addToCartBanquet }
