import { getOrders } from "../api/orders.js";
import { keyLocalStorageListSP } from "../constants.js";
import { getLocalStorage } from "../localStorage.js";
import { dateConverter } from "../utils/dateConverter.js";
import { cartList, changeIndicator } from "../components/navbar/NavBar.js";

const productList = getLocalStorage(keyLocalStorageListSP);

const tbody = document.querySelector("tbody");

function renderOrderList() {
    //load cart status
    changeIndicator(cartList);

    //get API then render orders
    getOrders().then((data) => {
        let html = "";

        console.log(data);

        data.forEach((order) => {
            const orderDate = dateConverter(order.order_date);

            const itemNumbers = order.cart_items.length;

            const totalQuantity = order.cart_items.reduce(
                (sum, item) => sum + item.soLuong,
                0
            );

            const totalPrice = order.cart_items.reduce((sum, cartProduct) => {
                const processingProduct = productList.filter(
                    (product) => cartProduct.idSP === product.id
                )[0];

                return (sum += cartProduct.soLuong * processingProduct.price);
            }, 0);

            html += `
                <tr class="item-row" id=${order.id}>
                    <td class="order-item">
                        <p class="code-id">${order.id}</p>
                        <div class="dropdown">
                            <button class="details">
                                Details
                                <i class="fa-solid fa-caret-down"></i>
                            </button>
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

        //fake delay for showing loading status
        setTimeout(() => (tbody.innerHTML = html), 3000);
    });
}

renderOrderList();
