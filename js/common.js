// Define global clearCart function
window.clearCart = function() {
    console.log('Clearing cart'); // Debugging statement
    carts = []; // Clear the cart array
    localStorage.removeItem('cart'); // Remove the cart from localStorage

    // Check if addCarttoHTML function exists before calling it
    if (typeof addCarttoHTML === 'function') {
        addCarttoHTML(); // Update cart display if function exists
    } else {
        console.log('addCarttoHTML not needed in this context.'); // Less intrusive message
    }
};
