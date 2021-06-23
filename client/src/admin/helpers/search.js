const orderSearch = (str) => {
    const allOrders = JSON.parse(sessionStorage.getItem('skylo-e-commerce-orders'));

    let filteredOrders;
    if(allOrders) {
        filteredOrders = allOrders.filter((item, index) => {
            const re = new RegExp(`.*${str}.*`, 'gi');

            /* Search by first name */
            if(item.first_name.search(re) !== -1) return true;

            /* Search by last name */
            if(item.last_name.search(re) !== -1) return true;

            /* Search by email */
            if(item.email.search(re) !== -1) return true;

            /* Search by id */
            if(item.id === parseInt(str)) return true;

            /* Search by name and surname */
            const searchArray = str.split(" ");
            const firstName = searchArray[0];
            const lastName = searchArray[1];

            console.log(firstName);
            console.log(lastName);

            const nameAndSurname = item.first_name + " " + item.last_name;
            console.log(nameAndSurname);

            if(nameAndSurname.search(re) !== -1) return true;

            return false;
        });
    }

    return filteredOrders;
}

const sortByDate = (asc) => {
    const allOrders = JSON.parse(sessionStorage.getItem('skylo-e-commerce-orders'));

    if(asc) {
        /* Sort from newest to oldest */
        return allOrders.sort();
    }
    else {
        /* Sort from oldest to newest */
        return allOrders.sort().reverse();
    }
}

const productSearch = (str) => {
    const allProducts = JSON.parse(sessionStorage.getItem('skylo-e-commerce-products'));
    const re = new RegExp(`.*${str}.*`, 'g');

    return allProducts.filter(item => {
       return item.name.search(re) !== -1;
    });
}

export { orderSearch, sortByDate, productSearch };
