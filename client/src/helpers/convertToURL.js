const convertToURL = (str) => {
    if(str) return str.toLowerCase().replace(/ /g, "-");
    else return "";
}

export default convertToURL;
