document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');
    const gotoQRButton = document.getElementById('gotoqr-button');
    const closeButton = document.getElementById('close-button');
    const paypalButtonContainer = document.getElementById('paypal-button-container');
    const customerEmailInput = document.getElementById('customer-email');
    const googleScriptURL = 'https://script.google.com/macros/s/AKfycbw_2Hbunw2ZwCwc0j43uZDRxiK6B1l85Uzkl3ggsHJR13yHXF5tnhVvDAzmMDr5ft-obA/exec';

    let listProducts = [];

    // Fetch products from backend API
    const fetchProducts = () => {
        fetch('http://localhost:5000/api/products')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                listProducts = data;
                renderCartItems();
            })
            .catch(error => console.error('Error fetching products:', error));
    };

    // Retrieve cart data from localStorage
    const getCartFromLocalStorage = () => {
        try {
            return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    // Render cart items using dynamic product data
    const renderCartItems = () => {
        const cart = getCartFromLocalStorage();
        let totalPrice = 0;
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const product = listProducts.find(p => p._id == item.product_id || p.id == item.product_id);
            if (product) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${item.quantity}</td>
                    <td>${(product.price * item.quantity).toFixed(2)}$</td>
                `;
                cartItemsContainer.appendChild(row);
                totalPrice += product.price * item.quantity;
            } else {
                console.warn('Product not found for id:', item.product_id);
            }
        });

        checkoutTotalPrice.textContent = totalPrice.toFixed(2) + '$';
    };

    const showNotification = (message) => {
        const notificationContainer = document.getElementById('notification-container');
        notificationContainer.textContent = message;
        notificationContainer.className = 'notification show';
        setTimeout(() => {
            notificationContainer.className = notificationContainer.className.replace('show', '');
        }, 3000);
    };

    const sendDataToGoogleScript = (email, orderDetails) => {
        const data = new URLSearchParams();
        data.append('email', email);
        data.append('order-details', orderDetails);

        fetch(googleScriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data.toString()
        })
        .then(response => response.json())
        .then(result => {
            if (result.result === 'success') {
                localStorage.removeItem('cart');
                window.location.href = 'confirm.html';
            } else {
                alert('Error: ' + result.error);
            }
        })
        .catch(error => {
            console.error('Error sending data to Google Script:', error);
            alert('An error occurred. Please try again.');
        });
    };

    const validateEmail = () => {
        const email = customerEmailInput.value;
        const isValid = email.includes('@');
        gotoQRButton.style.pointerEvents = isValid ? 'auto' : 'none';
        gotoQRButton.style.opacity = isValid ? '1' : '0.5';
        paypalButtonContainer.style.pointerEvents = isValid ? 'auto' : 'none';
        paypalButtonContainer.style.opacity = isValid ? '1' : '0.5';
    };

    customerEmailInput.addEventListener('input', validateEmail);

    if (typeof paypal !== 'undefined') {
        paypal.Buttons({
            createOrder: function(data, actions) {
                const cart = getCartFromLocalStorage();
                const totalAmount = checkoutTotalPrice.textContent.trim().replace('$', '');
                const items = cart.map(item => {
                    const product = listProducts.find(p => p._id == item.product_id || p.id == item.product_id);
                    return {
                        name: product.name,
                        unit_amount: { currency_code: 'USD', value: product.price.toFixed(2) },
                        quantity: item.quantity
                    };
                });

                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            currency_code: 'USD',
                            value: totalAmount,
                            breakdown: { item_total: { currency_code: 'USD', value: totalAmount } }
                        },
                        items: items
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    const email = customerEmailInput.value;
                    const cart = getCartFromLocalStorage();
                    const orderDetails = cart.map(item => `${item.quantity}x ${listProducts.find(p => p._id == item.product_id || p.id == item.product_id).name}`).join(', ');
                    sendDataToGoogleScript(email, orderDetails);
                });
            }
        }).render('#paypal-button-container');
    } else {
        console.error('PayPal SDK not loaded');
    }

    // Initially disable buttons
    gotoQRButton.style.pointerEvents = 'none';
    gotoQRButton.style.opacity = '0.5';
    paypalButtonContainer.style.pointerEvents = 'none';
    paypalButtonContainer.style.opacity = '0.5';

    gotoQRButton.addEventListener('click', () => {
        const email = customerEmailInput.value;
        if (!email.includes('@')) {
            showNotification('Please enter a valid email address.');
            return;
        }
        const cart = getCartFromLocalStorage();
        const orderDetails = cart.map(item => `${item.quantity}x ${listProducts.find(p => p._id == item.product_id || p.id == item.product_id).name}`).join(', ');
        const totalAmount = checkoutTotalPrice.textContent.trim();
        document.querySelector('.qr-container').style.display = 'block';
        document.getElementById('paymentMessage').textContent = `Please pay the total of ${totalAmount} to complete payment`;
        document.getElementById('qr-email').value = email;
        document.getElementById('order-details').value = orderDetails;
        document.querySelector('.checkout-container').style.display = 'none';
    });

    document.getElementById('close-button').addEventListener('click', () => {
        document.querySelector('.qr-container').style.display = 'none';
        document.querySelector('.checkout-container').style.display = 'block';
    });

    document.getElementById('close-button').addEventListener('click', () => {
        window.location.href = 'shop.html';
    });

    fetchProducts();
    validateEmail();
});
