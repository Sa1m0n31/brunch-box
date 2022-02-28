const getNextDays = (daysToAdd) => {
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
            month: numberToMonth(currentDate.getMonth()),
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

const numberToMonth = (n) => {
    const months = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień',
        'Maj', 'Czerwiec', 'Lipiec', 'Sierpień',
        'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];

    return months[n];
}

const numberToDayOfTheWeek = (n) => {
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

export { getNextDays, numberToDayOfTheWeek };
