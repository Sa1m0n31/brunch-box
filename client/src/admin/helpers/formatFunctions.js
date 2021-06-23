const getDate = (dateTime) => {
    return dateTime.substr(0, 10);
}

const getTime = (dateTime) => {
    return dateTime.substr(11, 8);
}

export { getDate, getTime };
