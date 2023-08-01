import { keyLocalStorageListSP } from "../constants.js";
import { getLocalStorage } from "../localStorage.js";
import { cartList, changeIndicator } from "../components/navbar/NavBar.js";
import toast from "../components/toast/Toast.js";
import CartItem from "../models/CartItem.js";

const productList = getLocalStorage(keyLocalStorageListSP);

//IIFE
(function renderProductList(list) {
    const container = document.querySelector(".container");

    let html = "";

    list.forEach(function (item) {
        if (item.quantity > 0) {
            html += `
                <div class="product-item" id=${item.id}>
                    <img src=${item.imgUrl}
                        alt="${item.productName}">
                    <div class="product-name">${item.productName}</div>
                    <div class="product-info">
                        <div class=${item.price}>$200</div>
                        <div class="quantity">Quantity: ${item.quantity}</div>
                    </div>
                    <div class="add-to-cart">
                        <i class="fa-solid fa-cart-plus"></i>
                    </div>
                </div>
        `;
        }
    });

    container.innerHTML = html;
})(productList);

const addSPBtns = document.querySelectorAll(".add-to-cart");

function addSP(id) {
    const newCartItem = new CartItem(+id, 1);

    if (cartList.length === 0) {
        cartList.push(newCartItem);
    } else {
        let found = false;
        for (const item of cartList) {
            if (item.idSP === newCartItem.idSP) {
                item.soLuong += newCartItem.soLuong;

                found = true;
            }
        }

        if (!found) {
            cartList.push(newCartItem);
        }
    }

    changeIndicator(cartList);

    // showSuccess();
    toast({
        title: "Thành công!",
        message: "Đã thêm sản phẩm vào giỏ hàng!",
        type: "success",
    });
}

addSPBtns.forEach(function (button) {
    button.addEventListener("click", () => addSP(button.parentElement.id));
});
