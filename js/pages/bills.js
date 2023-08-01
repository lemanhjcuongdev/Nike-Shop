import orders from "../api/orders.js";
import { cartList, changeIndicator } from "../components/navbar/NavBar.js";
import toast from "../components/toast/Toast.js";
import { keyLocalStorageListSP } from "../constants.js";
import { getLocalStorage, setLocalStorage } from "../localStorage.js";
import calculateTotalPrice from "../utils/calculateTotalPrice.js";
import { dateConverter } from "../utils/dateConverter.js";
import getParentElement from "../utils/getParentElement.js";

const productList = getLocalStorage(keyLocalStorageListSP);

const tbody = document.querySelector("tbody");

//IIFE
(async function renderOrderList() {
    //load cart status
    changeIndicator(cartList);

    //get API then render orders
    const data = await orders.getOrders();

    let html = "";

    data.forEach((order) => {
        const orderDate = dateConverter(order.order_date);

        const itemNumbers = order.cart_items.length;

        const totalQuantity = order.cart_items.reduce(
            (sum, item) => sum + item.soLuong,
            0
        );

        const totalPrice = calculateTotalPrice(order.cart_items);

        let cartItemHtml = "";
        order.cart_items.forEach((cart_item) => {
            const processingProduct = productList.filter(
                (product) => cart_item.idSP === product.id
            )[0];

            cartItemHtml += `
            <tr class="item-row" id=${cart_item.idSP}>
                <td class="cart-item">
                    <img src=${processingProduct.imgUrl}
                        width="100px" alt=${processingProduct.productName}>
                    <div class="info">
                        <h2 class="product-name">${
                            processingProduct.productName
                        }</h2>
                    </div>
                </td>
                <td>
                    <p>${cart_item.soLuong}</p>
                </td>
                <td class="subtotal">
                    $${processingProduct.price}
                </td>
                <td class="total">
                    $${cart_item.soLuong * processingProduct.price}
                </td>
            </tr>
            `;
        });

        html += `
                <tr class="item-row" id=${order.id}>
                    <td class="order-item">
                        <p class="code-id">${order.id}</p>
                        <div class="dropdown">
                            <button class="dropbtn">
                                Details
                                <i class="fa-solid fa-caret-down"></i>
                            </button>
                            <div id="myDropdown" class="dropdown-content">
                                <h3>Thông tin khách hàng</h3>
                                <p>Địa chỉ: ${order.address}</p>
                                <p>Số điện thoại: ${order.phone_number}</p>
                                <p>Email: ${order.email}</p>
                                <p>Ghi chú: ${order.message}</p>
                                <h3>Thông tin đơn hàng</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>
                                                Product Name
                                            </th>
                                            <th>
                                                Quantity
                                            </th>
                                            <th>
                                                Subtotal
                                            </th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${cartItemHtml}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </td>
                    <td class="customer-name">
                    ${order.name}
                    </td>
                    <td class="order-date">${orderDate}</td>
                    <td class="item-numbers">${itemNumbers}</td>
                    <td class="total-quantity">${totalQuantity}</td>
                    <td class="price">$${totalPrice}</td>
                    <td class="return">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                    </td>
                </tr>
        `;
    });

    tbody.innerHTML = html;

    toggleDropdownList();

    handleReturn(data);
})();

function toggleDropdownList() {
    const dropdownElements = document.querySelectorAll(".dropdown");

    dropdownElements.forEach((item) => {
        item.addEventListener("click", () => {
            getParentElement(item, ".dropdown")
                .querySelector(".dropdown-content")
                .classList.toggle("show");
        });
    });

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches(".dropbtn")) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains("show")) {
                    openDropdown.classList.remove("show");
                }
            }
        }
    };
}

function handleReturn(data) {
    const returnElements = document.querySelectorAll(".return");

    returnElements.forEach((returnElement) => {
        returnElement.addEventListener("click", async (e) => {
            if (confirm("Bạn có chắc chắn muốn hủy đơn hàng?")) {
                const itemRow = getParentElement(e.target, ".item-row");
                const returnId = +itemRow.id;

                const processingOrder = data.filter(
                    (order) => order.id === returnId
                )[0];

                const cartItems = processingOrder.cart_items;

                cartItems.forEach((cartItem) => {
                    productList.forEach((productItem) => {
                        if (cartItem.idSP === productItem.id) {
                            productItem.quantity += cartItem.soLuong;
                        }
                    });
                });

                //change quantity of product list
                setLocalStorage(keyLocalStorageListSP, productList);

                itemRow.remove();

                await orders.deleteOrder(returnId);

                toast({
                    title: "Thành công",
                    message: "Đã hủy đơn hàng!",
                    type: "success",
                });
            }
        });
    });
}
