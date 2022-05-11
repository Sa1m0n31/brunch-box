const getNextDays = (daysToAdd, lang) => {
    let aryDates = [];

    for (let i=0; i<daysToAdd+3; i++) {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + i);
        /* Except Mondays */
        aryDates.push({
            humanDate: addTrailingZero(currentDate.getDate()) + "." + addTrailingZero(currentDate.getMonth()+1) + "." + currentDate.getFullYear(),
            checkForExcludeDate: currentDate.getFullYear() + "-" + addTrailingZero(currentDate.getMonth()+1) + "-" + addTrailingZero(currentDate.getDate()),
            fullDate: currentDate.getFullYear() + "-" + addTrailingZero(parseInt(currentDate.getMonth()+1)) + "-" + currentDate.getDate(),
            day: currentDate.getDate(),
            dayOfTheWeek: currentDate.getDay(),
            monthNumber: currentDate.getMonth()+1,
            month: numberToMonth(currentDate.getMonth(), lang),
            year: currentDate.getFullYear()
        });
    }

    return aryDates.slice(0, 12);
}

const addTrailingZero = (month) => {
    if(month < 10) {
        return "0" + month;
    }
    else {
        return month;
    }
}

const numberToMonth = (n, lang) => {
    let months = [];

    if(lang === 0) {
        months = [
            'Styczeń', 'Luty', 'Marzec', 'Kwiecień',
            'Maj', 'Czerwiec', 'Lipiec', 'Sierpień',
            'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
        ];
    }
    else {
        months = [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];
    }

    return months[n];
}

const numberToDayOfTheWeek = (n, lang) => {
    if(lang === 0) {
        switch(n) {
            case 0:
                return "ndz.";
            case 1:
                return "pon";
            case 2:
                return "wt.";
            case 3:
                return "śr.";
            case 4:
                return "czw.";
            case 5:
                return "pt.";
            case 6:
                return "sob.";
            default:
                return "";
        }
    }
    else {
        switch(n) {
            case 0:
                return "sun.";
            case 1:
                return "mon";
            case 2:
                return "tu.";
            case 3:
                return "wed.";
            case 4:
                return "thr.";
            case 5:
                return "fri.";
            case 6:
                return "sat.";
            default:
                return "";
        }
    }
}

export { getNextDays, numberToDayOfTheWeek };
