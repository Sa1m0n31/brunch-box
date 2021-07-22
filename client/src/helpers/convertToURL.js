const convertToURL = (str) => {
    if(str) return str.toLowerCase()
        .replace(/ /g, "-")
        .replace(/ą/g, "a")
        .replace(/ć/g, "c")
        .replace(/ę/g, "e")
        .replace(/ń/g, "n")
        .replace(/ł/g, "l")
        .replace(/ó/g, "o")
        .replace(/ś/g, "s")
        .replace(/ź/g, "z")
        .replace(/ż/g, "z")
    else return "";
}

const convertToString = (url) => {
    if(url) return url.replace(/-/g, " ");
    else return "";
}

export default convertToURL;
export { convertToString }
