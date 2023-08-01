import toast from "../components/toast/Toast.js";
import { orderAPIRoot } from "../constants.js";

const getOrders = async () => {
    try {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(`${orderAPIRoot}/orders`, options);

        const data = await response.json();

        return data;
    } catch (error) {
        toast({
            title: "Không lấy được dữ liệu đơn hàng",
            message: "Có thể JSON Server đã bị tắt",
            type: "error",
        });
    }
};

const postOrder = async (orderData) => {
    try {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData) || {},
        };

        const response = await fetch(`${orderAPIRoot}/orders`, options);

        const data = await response.json();

        return data;
    } catch (error) {
        toast({
            title: "Không gửi được dữ liệu đơn hàng",
            message: "Có thể JSON Server đã bị tắt",
            type: "error",
        });
    }
};

const deleteOrder = async (id) => {
    try {
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(`${orderAPIRoot}/orders/${id}`, options);

        const data = await response.json();

        return data;
    } catch (error) {
        toast({
            title: "Không thể xóa dữ liệu đơn hàng",
            message: "Có thể JSON Server đã bị tắt",
            type: "error",
        });
    }
};

//IIFE
const orders = (function () {
    return {
        getOrders,
        postOrder,
        deleteOrder,
    };
})();

export default orders;
