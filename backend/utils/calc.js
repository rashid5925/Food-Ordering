exports.calculateTotal = (cart) => {
    return cart.reduce((total, cartItem) => {
        return total + cartItem.product.price * cartItem.amount;
    }, 0);
};

exports.calculateCount = (cart) => {
    return cart.reduce((total, cartItem) => {
        return total + cartItem.amount;
    }, 0);
}
