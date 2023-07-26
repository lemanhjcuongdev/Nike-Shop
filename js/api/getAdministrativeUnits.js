import toast from "../components/toast/Toast.js";
import { locationAPIRoot } from "../constants.js";

export const getLocation = async (path) => {
    try {
        const response = await fetch(`${locationAPIRoot}${path}`);

        const data = await response.json();

        return data;
    } catch (error) {
        toast({
            title: "Không lấy được dữ liệu địa chỉ",
            message: error.message,
            type: "error",
        });
    }
};
