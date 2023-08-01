import orders from "../api/orders.js";

export default async function createRandomId() {
    const bills = await orders.getOrders();

    const billIds = bills.map((bill) => bill.id);

    const newId = Math.round(Math.random() * 1000000);

    //check duplicate bill id
    billIds.forEach((billId) => {
        if (newId === billId) {
            createRandomId();
            return;
        }
    });

    return newId;
}
