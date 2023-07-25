import amountPicker from "../components/amount-picker/AmountPicker.js";
import { cartList, changeIndicator } from "../components/navbar/NavBar.js";
import {
    keyLocalStorageItemCart,
    keyLocalStorageListSP,
} from "../constants.js";
import {
    clearLocalStorage,
    getLocalStorage,
    setLocalStorage,
} from "../localStorage.js";
import getParentElement from "../utils/getParentElement.js";
import toast from "../components/toast/Toast.js";
import { getLocation } from "../api/location.js";
import validate from "../utils/validator.js";
import OrderInfo from "../models/OrderInfo.js";
import { getOrders, postOrder } from "../api/orders.js";

const productList = getLocalStorage(keyLocalStorageListSP);

const tbody = document.querySelector("tbody");
const totalPriceElement = document.querySelector(".total-price");

const buyBtn = document.querySelector(".buy-btn");
const modalElement = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".modal-close");
const formElement = document.querySelector("form");
const cancelFormBtn = document.querySelector("button[type=reset]");
const lastnameElement = document.querySelector("#lastname");
const firstnameElement = document.querySelector("#firstname");
const emailElement = document.querySelector("#email");
const telElement = document.querySelector("#tel");
const messageElement = document.querySelector("#message");

renderCartList(cartList);
getTotalPrice(cartList);

const decreaseBtns = document.querySelectorAll(".decrease-btn");
const increaseBtns = document.querySelectorAll(".increase-btn");
const removeBtns = document.querySelectorAll(".remove-btn");

const provinceElement = document.querySelector("#province");
const districtElement = document.querySelector("#district");
const wardElement = document.querySelector("#ward");
const addressElement = document.querySelector("#address");

let selectedProvince;
let selectedDistrict;
let selectedWard;

function renderCartList(list) {
    let html = "";

    list.forEach(function (item) {
        const processingProduct = productList.filter(
            (product) => item.idSP === product.id
        )[0];

        html += `
        <tr class="item-row" id=${item.idSP}>
            <td class="cart-item">
                <img src=${processingProduct.imgUrl}
                    width="100px" alt=${processingProduct.productName}>
                <div class="info">
                    <h2 class="product-name">${
                        processingProduct.productName
                    }</h2>
                    <p class="product-quantity">Quantity: ${
                        processingProduct.quantity
                    }</p>
                </div>
            </td>
            <td>
                <div class="amount-picker">
                    <div class="decrease-btn">
                        -
                    </div>
                    <input class="amount-picker-screen" type="number" min="1" max="10" readonly value=${
                        item.soLuong
                    }>
                    <div class="increase-btn">
                        +
                    </div>
                </div>
            </td>
            <td class="subtotal">
                $${processingProduct.price}
            </td>
            <td class="total">
                $${item.soLuong * processingProduct.price}
            </td>
            <td class="clear-cart">
                <i class="fa-regular fa-circle-xmark remove-btn" title="Remove item"></i>
            </td>
        </tr>
        `;

        tbody.innerHTML = html;
    });

    setEmptyState(list);
}

export function setEmptyState(list) {
    const container = document.querySelector(".container");

    //empty state
    if (list.length === 0) {
        container.innerHTML = `
    <div class="empty-state">
        <img src="./assets/img/empty-cart.png" alt="Empty Cart" draggable="false">
    </div>
    <div class="action-btns">
        <a href="./index.html" class="back-btn">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Back to Shopping</span>
        </a>
    </div>
    `;
    }
}

export function getTotalPrice(list) {
    const total = list.reduce(function (sum, item) {
        const processingProduct = productList.filter(
            (product) => item.idSP === product.id
        )[0];

        return (sum += item.soLuong * processingProduct.price);
    }, 0);

    totalPriceElement.innerText = `Total: $${total}`;
}

decreaseBtns.forEach(function (decreaseBtn) {
    decreaseBtn.addEventListener("click", function (e) {
        amountPicker(e.target, -1);
    });
});

increaseBtns.forEach(function (increaseBtn) {
    increaseBtn.addEventListener("click", function (e) {
        amountPicker(e.target, 1);
    });
});

removeBtns.forEach(function (removeBtn) {
    removeBtn.addEventListener("click", function (e) {
        if (confirm("Are you sure you want to remove this item?")) {
            const parentElement = getParentElement(e.target, ".item-row");

            parentElement.remove();

            //get data from localStorage again
            const processingCartList = getLocalStorage(keyLocalStorageItemCart);

            //remove item in local storage
            const newCartList = processingCartList.filter(
                (item) => item.idSP !== +parentElement.id
            );

            //save list to local storage and change cart indicator
            changeIndicator(newCartList);
            //update total price
            getTotalPrice(newCartList);

            //set empty state if necessary
            setEmptyState(newCartList);

            // showSuccess();
            toast({
                title: "Thành công!",
                message: "Đã xóa sản phẩm khỏi giỏ hàng!",
                type: "success",
            });
        }
    });
});

//on buy
buyBtn.addEventListener("click", function (e) {
    let errorMessage = "Sản phẩm ";
    const invalidProducts = [];

    cartList.forEach((item) => {
        const processingProduct = productList.filter(
            (product) => item.idSP === product.id
        )[0];

        if (item.soLuong > processingProduct.quantity) {
            invalidProducts.push(processingProduct.productName);
        }
    });

    //out of stock order
    if (invalidProducts.length > 0) {
        errorMessage += invalidProducts.join(", ");

        toast({
            title: "Thất bại!",
            message:
                errorMessage + " vượt quá số lượng trong kho, không thể mua!",
            type: "error",
        });
    } else {
        modalElement.classList.add("active");

        //load province on click buy btn
        loadLocation("/p/", "#province");
        districtElement.disabled = true;
        wardElement.disabled = true;
    }
});

function loadLocation(path, selector, value = "") {
    // fetchAPI
    getLocation(path).then((data) => {
        let filteredData = [];
        const selection = document.querySelector(selector);

        switch (selector) {
            case "#province":
                {
                    filteredData = data;
                }
                break;
            case "#district":
                {
                    //clean old result
                    selection.innerHTML = "";

                    //filter data by selected province code
                    filteredData = data.filter(
                        (item) => item.province_code === +value
                    );

                    //insert placeholder option
                    filteredData.unshift({
                        name: "--Chọn Quận / Huyện--",
                        code: 0,
                    });
                }
                break;
            case "#ward":
                {
                    selection.innerHTML = "";

                    filteredData = data.filter(
                        (item) => item.district_code === +value
                    );

                    filteredData.unshift({
                        name: "--Chọn Phường / Xã--",
                        code: 0,
                    });
                }
                break;
        }

        // renderData
        filteredData.map((item) => {
            const option = document.createElement("option");
            option.value = item.code;
            option.innerText = item.name;

            selection.appendChild(option);
        });
    });

    return value;
}

provinceElement.addEventListener("change", (e) => {
    loadLocation("/d/", "#district", +e.target.value);

    selectedProvince = e.target.options[e.target.selectedIndex].innerText;

    districtElement.disabled = false;
    wardElement.disabled = true;
});

districtElement.addEventListener("change", (e) => {
    loadLocation("/w/", "#ward", +e.target.value);

    selectedDistrict = e.target.options[e.target.selectedIndex].innerText;

    wardElement.disabled = false;
});

wardElement.addEventListener("change", (e) => {
    selectedWard = e.target.options[e.target.selectedIndex].innerText;
});

closeModalBtn.addEventListener("click", closeModal);
cancelFormBtn.addEventListener("click", closeModal);

function closeModal() {
    modalElement.classList.remove("active");
    document.querySelector("form").reset();
    document.querySelectorAll("small").forEach((item) => (item.innerText = ""));
}

//validate inputElement by type and event
validate(lastnameElement, "name", "onblur");
validate(lastnameElement, "name", "oninput");
validate(firstnameElement, "name", "onblur");
validate(firstnameElement, "name", "oninput");
validate(emailElement, "email", "onblur");
validate(emailElement, "email", "oninput");
validate(telElement, "tel", "onblur");
validate(telElement, "tel", "oninput");
validate(provinceElement, "", "onblur");
validate(provinceElement, "", "oninput");
validate(districtElement, "", "onblur");
validate(districtElement, "", "oninput");
validate(wardElement, "", "onblur");
validate(wardElement, "", "oninput");
validate(addressElement, "", "onblur");
validate(addressElement, "", "oninput");

formElement.onsubmit = function (e) {
    e.preventDefault();

    const validateList = [];

    validateList.push(validate(lastnameElement, "name", "onsubmit"));
    validateList.push(validate(firstnameElement, "name", "onsubmit"));
    validateList.push(validate(emailElement, "email", "onsubmit"));
    validateList.push(validate(telElement, "tel", "onsubmit"));
    validateList.push(validate(provinceElement, "", "onsubmit"));
    validateList.push(validate(districtElement, "", "onsubmit"));
    validateList.push(validate(wardElement, "", "onsubmit"));
    validateList.push(validate(addressElement, "", "onsubmit"));

    const isValid = validateList.every((item) => item === true);

    if (isValid) {
        const customerName = `${lastnameElement.value.trim()} ${firstnameElement.value.trim()}`;

        const customerAddress = `${addressElement.value.trim()}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;

        const orderDate = Date.now();

        const newOrder = new OrderInfo(
            Math.round(Math.random() * 1000000),
            customerName,
            telElement.value.trim(),
            emailElement.value.trim(),
            customerAddress,
            messageElement.value.trim(),
            orderDate,
            cartList
        );

        //call API
        postOrder(newOrder).then(() => {
            cartList.forEach((cartItem) => {
                productList.forEach((productItem) => {
                    if (cartItem.idSP === productItem.id) {
                        productItem.quantity -= cartItem.soLuong;
                    }
                });
            });

            //change quantity of product list
            setLocalStorage(keyLocalStorageListSP, productList);
            //clear cart
            clearLocalStorage(keyLocalStorageItemCart);
            //redirect to bills page (haven't finished yet)
            window.location.href = "bills.html";
        });
    }
};

getOrders().then((data) => console.log(data));
