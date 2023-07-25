import { keyLocalStorageItemCart } from "../../constants.js";
import { getLocalStorage, setLocalStorage } from "../../localStorage.js";

export let cartList = getLocalStorage(keyLocalStorageItemCart);

const cartIndicator = document.querySelector(".indicator");
cartList.length === 0
    ? (cartIndicator.style.display = "none")
    : (cartIndicator.innerText = cartList.length);

export function changeIndicator(cartList) {
    setLocalStorage(keyLocalStorageItemCart, cartList);
    if (!cartList.length) {
        cartIndicator.style.display = "none";
    } else {
        cartIndicator.style.display = "flex";
        cartIndicator.innerText = cartList.length;
    }
}
