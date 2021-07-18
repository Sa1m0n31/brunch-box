import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const addCoupon = (code, from, to, percent, discountValue, timesToUse) => {
    let amount = null;
    if(percent) {
        percent = discountValue
    }
    else {
        amount = discountValue;
        percent = null;
    }
    return axios.post(`${API_URL}/coupon/add`, {
        code,
        from,
        to,
        percent,
        amount,
        timesToUse
    });
}

const updateCoupon = (id, code, from, to, percent, discountValue, timesToUse) => {
    let amount = null;
    if(percent) {
        percent = discountValue
    }
    else {
        amount = discountValue;
        percent = null;
    }
    return axios.post(`${API_URL}/coupon/update`, {
        id,
        code,
        from,
        to,
        percent,
        amount,
        timesToUse
    });
}

const getAllCoupons = () => {
    return axios.get(`${API_URL}/coupon/get-all`);
}

const deleteCoupon = (id) => {
    return axios.post(`${API_URL}/coupon/delete`, {
        id
    });
}

const getCouponDetails = (id) => {
    return axios.post(`${API_URL}/coupon/get-details`, {
        id
    });
}

export { addCoupon, getAllCoupons, updateCoupon, deleteCoupon, getCouponDetails };
