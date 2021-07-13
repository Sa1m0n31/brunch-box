const convertToURL = (str) => {
    if(str) return str.toLowerCase().replace(/ /g, "-");
    else return "";
}

const convertToString = (url) => {
    if(url) return url.replace(/-/g, " ");
    else return "";
}

export default convertToURL;
export { convertToString }
