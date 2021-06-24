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

    console.log(currentCart);

    localStorage.setItem('sec-cart', JSON.stringify(currentCart));
}

const deleteFromCart = ({ id, size, option }) => {
    let currentCart = JSON.parse(localStorage.getItem('sec-cart'));

    console.log("Delete: " + id + ", " + size + ", " + option);

    const newCart = currentCart.filter((item) => {
        return item.id !== id || item.size !== size || item.option !== option;
    });

    localStorage.setItem('sec-cart', JSON.stringify(newCart));
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

export { editCart, deleteFromCart, calculatePrice }
