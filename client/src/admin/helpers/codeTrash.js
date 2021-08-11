/* SHIPPING AND PAYMENT */
// useEffect(() => {
//     if(fastest) {
//         /* Choose fastest possible hour */
//         chooseFastestPossibleHourInLoop();
//     }
//     else {
//         setDayOfDelivery(-1);
//         setHourOfDelivery(-1);
//     }
// }, [fastest]);

// useEffect(() => {
//     if(fastest) {
//         setChangeOnFastest(changeOnFastest+1);
//     }
//     else {
//         setChangeOnFastest(0);
//     }
//     if((changeOnFastest)||(!fastest)) {
//         setFastest(false);
//         setHourOfDelivery(-1);
//     }
//
//     ...
// }, [dayOfDeliver]);


// const chooseFastestPossibleHourInLoop = () => {
//     let i = 0;
//     while((!chooseFastestPossibleHour(i))&&(i<14*24)) {
//         i++;
//     }
// }

// const chooseFastestPossibleHour = (h) => {
//     const myDate = new Date().addHours(h);
//     const currentDate = new Date();
//     const hour = myDate.getHours();
//     const dayOfTheWeek = myDate.getDay();
//     if ((dayOfTheWeek === 4) || (dayOfTheWeek === 5) || (dayOfTheWeek === 6)) {
//         if (hour < 9) {
//             /* For today */
//             if (isHourAvailable(daysDifference(myDate, currentDate), 0)) {
//                 setDayOfDelivery(daysDifference(myDate, currentDate));
//                 setHourOfDelivery(2);
//                 return true;
//             } else return false;
//         } else if (hour < 19) {
//             /* For today */
//             if (isHourAvailable(daysDifference(myDate, currentDate), availableHours.findIndex(item => {
//                 return item.start === parseInt(parseInt(hour) + 3);
//             }))) {
//                 setDayOfDelivery(daysDifference(myDate, currentDate));
//                 setHourOfDelivery(availableHours.findIndex(item => {
//                     return item.start === parseInt(parseInt(hour) + 3);
//                 }));
//                 return true;
//             } else {
//                 return false;
//             }
//         } else {
//             /* For next day */
//             if (isHourAvailable(Math.max(1, daysDifference(myDate, currentDate)), 0)) {
//                 setDayOfDelivery(Math.max(1, daysDifference(myDate, currentDate)));
//                 setHourOfDelivery(0);
//                 return true;
//             } else return false;
//         }
//     } else {
//         if (hour < 9) {
//             /* For today */
//             if (isHourAvailable(daysDifference(myDate, currentDate), 0)) {
//                 setDayOfDelivery(daysDifference(myDate, currentDate));
//                 setHourOfDelivery(2);
//                 return true;
//             } else return false;
//         } else if (hour < 18) {
//             /* For today */
//             if (isHourAvailable(daysDifference(myDate, currentDate), availableHours.findIndex(item => {
//                 return item.start === hour + 3;
//             }))) {
//                 setDayOfDelivery(daysDifference(myDate, currentDate));
//                 setHourOfDelivery(availableHours.findIndex(item => {
//                     return item.start === hour + 3;
//                 }));
//                 return true;
//             } else return false;
//         } else {
//             /* For next day */
//             if (isHourAvailable(Math.max(1, daysDifference(myDate, currentDate)), 0)) {
//                 setDayOfDelivery(Math.max(1, daysDifference(myDate, currentDate)));
//                 setHourOfDelivery(0);
//                 return true;
//             } else return false;
//         }
//     }
// }

// const daysDifference = (date1, date2) => {
//     const diffTime = Math.abs(date2 - date1);
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// }

// const isHourAvailable = (dayIndex, hourIndex) => {
//     if(hourIndex !== -1) {
//         const newArr = excludedHours.filter(item => {
//             return item.hour === availableHours[hourIndex].start && item.day === calendar[dayIndex].fullDate;
//         });
//         return !newArr.length;
//     }
//     else {
//         return false;
//     }
// }
