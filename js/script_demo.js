document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');
    const purchaseButton = document.getElementById('purchase-button');
    const closeButton = document.getElementById('close-button');

    // Function to retrieve cart data from localStorage
    const getCartFromLocalStorage = () => {
        let cart = [];
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        return cart;
    }

    // Function to render cart items in the checkout page
    const renderCartItems = () => {
        const cart = getCartFromLocalStorage();
        let totalPrice = 0;

        // Clear existing items first
        cartItemsContainer.innerHTML = '';

        // Retrieve listProducts from main page's script or another source
        const listProducts = [
            { id: '1', name: 'Piconto Font', price: 15, image: './assets/image/NEWSTALGIA WEB-18.png' },
            { id: '2', name: 'Piconto Font1', price: 20, image: './assets/image/NEWSTALGIA WEB-18.png' },
            { id: '3', name: 'Piconto Font2', price: 25, image: './assets/image/NEWSTALGIA WEB-18.png' },
            { id: '4', name: 'Piconto Font3', price: 30, image: './assets/image/NEWSTALGIA WEB-18.png' },
            { id: '5', name: 'Piconto Font4', price: 35, image: './assets/image/NEWSTALGIA WEB-18.png' },
            { id: '6', name: 'Piconto Font5', price: 35, image: './assets/image/NEWSTALGIA WEB-18.png' },
            { id: '7', name: 'Piconto Font6', price: 35, image: './assets/image/NEWSTALGIA WEB-18.png' },
            { id: '8', name: 'Piconto Font6', price: 35, image: './assets/image/NEWSTALGIA WEB-18.png' },
            { id: '9', name: 'Piconto Font6', price: 35, image: './assets/image/NEWSTALGIA WEB-18.png' },
            // Add all your products here
        ];

        console.log('Cart:', cart); // Debugging line

        cart.forEach(item => {
            console.log('Processing item:', item); // Debugging line
            let product = listProducts.find(p => p.id === item.product_id);
            console.log('Matched product:', product); // Debugging line

            if (product) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${item.quantity}</td>
                    <td>${(product.price * item.quantity).toFixed(2)}$</td>
                `;
                cartItemsContainer.appendChild(row);

                // Calculate total price
                totalPrice += product.price * item.quantity;
            } else {
                console.warn('Product not found for id:', item.product_id); // Debugging line
            }
        });

        // Update total price display
        checkoutTotalPrice.textContent = totalPrice.toFixed(2) + '$';
    }
    purchaseButton.addEventListener('click', () => {
        window.location.href = 'qr_code.html'; // Redirect to QR code page
    });
    // Event listener for the close button
    closeButton.addEventListener('click', () => {
        window.location.href = 'shop.html'; // Redirect to shop page
    });

    // Initialize the checkout page
    renderCartItems();
});
