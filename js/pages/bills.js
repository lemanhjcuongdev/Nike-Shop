import { getOrders } from "../api/orders.js";

function renderOrderList() {
    getOrders().then((data) => console.log(data));
}
