import axios from "axios";
import settings from "./settings";

const isShorterDay = (day) => {
    return day === 0 || day === 2 || day === 3;
}

const areShopOpen = () => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentDayOfTheWeek = currentDate.getDay();

    /* Check if shop closed becouse of the time */
    if(isShorterDay(currentDayOfTheWeek)) {
        if((currentHour < 9)||(currentHour > 21)) return false;
    }
    else {
        if((currentHour < 9)||(currentHour > 22)) return false;
    }

    /* Check if shop closed becouse of admin settings */
    return axios.get(`${settings.API_URL}/dates/get-all`);
}

export { areShopOpen }
