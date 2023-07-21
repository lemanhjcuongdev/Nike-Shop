export default function OrderInfo(
    id,
    name,
    phone_number,
    email,
    address,
    message,
    order_date,
    cart_items
) {
    this.id = id;
    this.name = name;
    this.phone_number = phone_number;
    this.email = email;
    this.address = address;
    this.message = message;
    this.order_date = order_date;
    this.cart_items = cart_items;
}
