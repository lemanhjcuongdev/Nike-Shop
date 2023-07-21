import toast from "../components/toast/Toast.js";
import { orderAPIRoot } from "../constants.js";

export const getOrders = async () => {
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
            message: error.message,
            type: "error",
        });
    }
};

export const postOrder = async (orderData) => {
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
            message: error.message,
            type: "error",
        });
    }
};

export const deleteOrder = async (id) => {
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
            message: error.message,
            type: "error",
        });
    }
};
