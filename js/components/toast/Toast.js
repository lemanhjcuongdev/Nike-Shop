// type: success, error, info, warning

export default function toast({ title = "", message = "", type = "info" }) {
    const main = document.querySelector("#toast");

    if (main) {
        const toast = document.createElement("div");
        const icons = {
            success: "fa-solid fa-circle-check",
            info: "fa-solid fa-circle-info",
            warning: "fa-solid fa-triangle-exclamation",
            error: "fa-solid fa-circle-exclamation",
        };

        const icon = icons[type];
        toast.classList.add("toast", `toast_${type}`);
        toast.style.animation = `fadeIn cubic-bezier(0.65, 0.05, 0.36, 1) 1s,
      fadeOut cubic-bezier(0.65, 0.05, 0.36, 1) 0.5s 5s forwards`;

        //auto remove toast
        const autoRemove = setTimeout(function () {
            main.removeChild(toast);
        }, 6000);

        //manually remove toast
        toast.onclick = function (e) {
            if (e.target.closest(".toast_close")) {
                main.removeChild(toast);
                clearTimeout(autoRemove);
            }
        };

        toast.innerHTML = `
        <div class="toast_icon">
          <i class="${icon}"></i>
        </div>
        <div class="toast_body">
          <h3 class="toast_title">${title}</h3>
          <p class="toast_msg">
            ${message}
          </p>
        </div>
        <div class="toast_close">
          <i class="fa-solid fa-xmark"></i>
        </div>
      `;

        main.appendChild(toast);
    }
}
