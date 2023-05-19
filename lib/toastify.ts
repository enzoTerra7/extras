import Toastify from "toastify-js";

class Toast {
    public async success(message: string): Promise<void> {
        Toastify({
            text: message || "",
            duration: 2000,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            backgroundColor: "green",
        }).showToast();
    }

    public async error(message: string): Promise<void> {
        Toastify({
            text: message || "",
            duration: 2000,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            backgroundColor: "red",
        }).showToast();
    }

    public async info(message: string): Promise<void> {
        Toastify({
            text: message || "",
            duration: 2000,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            backgroundColor: "blue",
        }).showToast();
    }
}

const ToastInstance = new Toast();

export default ToastInstance;