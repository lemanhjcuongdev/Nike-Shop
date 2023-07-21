import { getTotalPrice, setEmptyState } from "../../pages/cart.js";
import getParentElement from "../../utils/getParentElement.js";
import { cartList, changeIndicator } from "../navbar/NavBar.js";
import toast from "../toast/Toast.js";

export default function amountPicker(target, amount) {
    const parentElement = getParentElement(target, ".item-row");

    const amountValue = parentElement.querySelector(".amount-picker-screen");
    const subTotal = parentElement.querySelector(".subtotal");
    const total = parentElement.querySelector(".total");

    cartList.map((item) => {
        if (
            item.idSP === +parentElement.id &&
            item.soLuong === 1 &&
            amount === -1
        ) {
            if (confirm("Are you sure to remove this item?")) {
                item.soLuong = 0;
                parentElement.remove();

                // showSuccess();
                toast({
                    title: "Thành công!",
                    message: "Đã xóa sản phẩm khỏi giỏ hàng!",
                    type: "success",
                });

                return;
            }
        } else if (item.idSP === +parentElement.id) {
            item.soLuong += amount;
            amountValue.value = item.soLuong;

            //clear "$" before subtotal price to get subtotal value
            total.innerText = `$${
                +amountValue.value * +subTotal.innerText.substring(1)
            }`;
        }
    });

    //remove item with amount = 0 and replace new array
    const newCartList = cartList.filter((item) => item.soLuong > 0);

    //save list to local storage and change cart indicator
    changeIndicator(newCartList);
    //update total price
    getTotalPrice(newCartList);

    //set empty state
    setEmptyState(newCartList);
}
