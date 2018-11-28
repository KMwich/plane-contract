import $ from 'jquery';

const url = "http://localhost:8080"

export const login = (address, password) => {
    return new Promise((resolve) => {
        $.post(url + "/login", {address, password}, (res, status) => {
            if (status === "success") {
                resolve(res)
            }
        })
    })
}

export const signup = (password) => {
    return new Promise((resolve) => {
        $.post(url + "/signup", {password}, (res, status) => {
            if (status === "success") {
                resolve(res)
            }
        })
    })
}

export const getFlights = (address) => {
    return new Promise((resolve) => {
        $.post(url + "/flights", {address}, (res, status) => {
            if (status === "success") {
                resolve(res)
            }
        })
    })
}

export const getSeats = (address, plane) => {
    return new Promise((resolve) => {
        $.post(url + "/getSeats", {address, plane}, (res, status) => {
            if (status === "success") {
                resolve(res)
            }
        })
    })
}

export const buySeat = (address, plane, seats) => {
    return new Promise((resolve) => {
        $.post(url + "/buySeat", {address, plane, seats}, (res, status) => {
            if (status === "success") {
                resolve(res)
            }
        })
    })
}