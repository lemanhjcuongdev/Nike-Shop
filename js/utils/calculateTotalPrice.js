import { keyLocalStorageListSP } from "../constants.js";
import { getLocalStorage } from "../localStorage.js";

const productList = getLocalStorage(keyLocalStorageListSP);

export default function calculateTotalPrice(listItem) {
    const totalPrice = listItem.reduce((sum, item) => {
        const processingProduct = productList.filter(
            (product) => item.idSP === product.id
        )[0];

        return (sum += item.soLuong * processingProduct.price);
    }, 0);

    return totalPrice;
}
