import getParentElement from "./getParentElement.js";

export default function validate(inputElement, type = "", event = "") {
    let errorMessage = getParentElement(
        inputElement,
        ".form-item"
    ).querySelector("small");

    // listen event
    switch (event) {
        case "onblur":
            {
                inputElement.onblur = function () {
                    handleValidate(inputElement.value);
                };
            }
            break;
        case "oninput":
            {
                inputElement.oninput = function () {
                    errorMessage.innerHTML = "";
                };
            }
            break;
        case "onsubmit":
            handleValidate(inputElement.value);
            break;
    }

    function handleValidate(value) {
        if (!value.trim() || (value === "0" && type === "")) {
            errorMessage.innerHTML = "Vui lòng nhập";
        } else
            switch (type) {
                case "name":
                    {
                        if (/\d/.test(value.trim())) {
                            errorMessage.innerHTML = "Tên không được chứa số";
                        }
                    }
                    break;
                case "email":
                    {
                        if (
                            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                                value.trim()
                            )
                        ) {
                            errorMessage.innerHTML =
                                "Email sai định dạng. VD: abc@gmail.com";
                        }
                    }
                    break;
                case "tel":
                    {
                        if (
                            /\D/.test(value.trim()) &&
                            value.trim().slice(0, 1) !== "+"
                        ) {
                            errorMessage.innerHTML =
                                "Số điện thoại không được chứa chữ cái";
                        } else if (
                            value.trim().slice(0, 1) !== "+" &&
                            value.trim().slice(0, 1) !== "0"
                        ) {
                            errorMessage.innerHTML =
                                "Số điện thoại bắt đầu bằng số 0 hoặc mã vùng";
                        } else if (
                            value.trim().length < 9 ||
                            value.trim().length > 12
                        ) {
                            errorMessage.innerHTML =
                                "Số điện thoại phải > 9 số và < 11 số";
                        } else if (
                            value.trim().charAt(0) === "0" &&
                            value.trim().charAt(1) === "0"
                        ) {
                            errorMessage.innerHTML =
                                "Số điện thoại không thể bắt đầu bằng 00";
                        }
                    }
                    break;
            }
    }

    //return validate status
    return !errorMessage.innerHTML;
}
