document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');
    const gotoQRButton = document.getElementById('gotoqr-button');
    const closeButton = document.getElementById('close-button');
    const googleScriptURL = 'https://script.google.com/macros/s/AKfycbw_2Hbunw2ZwCwc0j43uZDRxiK6B1l85Uzkl3ggsHJR13yHXF5tnhVvDAzmMDr5ft-obA/exec';
    const customerEmailInput = document.getElementById('customer-email');
    const emailInput = document.getElementById('customer-email');
    const paypalButtonContainer = document.getElementById('paypal-button-container');

    const getCartFromLocalStorage = () => {
        let cart = [];
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        return cart;
    };

    const listProducts = [
        {
            "id": 1,
            "name": "Piconto Font",
            "price": 15,
            "type": "premium",
            "image": "./assets/image/NEWSTALGIA WEB-03.png"
        },
        {
            "id": 2,
            "name": "Piconto Font1",
            "price": 15,
            "type": "premium",
            "image": "./assets/image/NEWSTALGIA WEB-03.png"
        },
        {
            "id": 3,
            "name": "Piconto Font2",
            "price": 15,
            "type": "premium",
            "image": "./assets/image/NEWSTALGIA WEB-03.png"
        },
        {
            "id": 4,
            "name": "Piconto Font3",
            "price": 15,
            "type": "premium",
            "image": "./assets/image/NEWSTALGIA WEB-03.png"
        },
        {
            "id": 5,
            "name": "Piconto Font4",
            "type": "premium",
            "price": 15,
            "image": "./assets/image/NEWSTALGIA WEB-03.png"
        },
        {
            "id": 6,
            "name": "Piconto Font5",
            "price": 15,
            "type": "premium",
            "image": "./assets/image/NEWSTALGIA WEB-03.png"
        },
        {
            "id": 7,
            "name": "Piconto Font6",
            "price": 15,
            "type": "premium",
            "image": "./assets/image/NEWSTALGIA WEB-03.png"
        },
        {
            "id": 8,
            "name": "Piconto Font6",
            "price": 15,
            "type": "premium",
            "image": "./assets/image/NEWSTALGIA WEB-03.png"
        },
        {
            "id": 9,
            "name": "Piconto Font6",
            "price": 15,
            "type": "premium",
            "image": "./assets/image/NEWSTALGIA WEB-03.png"
        }
    ];

    const renderCartItems = () => {
        const cart = getCartFromLocalStorage();
        let totalPrice = 0;

        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            let product = listProducts.find(p => p.id === item.product_id);

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
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
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

    // Add event listener to email input
    emailInput.addEventListener('input', validateEmail);

    if (typeof paypal !== 'undefined') {
        paypal.Buttons({
            createOrder: function(data, actions) {
                const cart = getCartFromLocalStorage();
                const totalAmount = checkoutTotalPrice.textContent.trim().replace('$', '');

                const items = cart.map(item => {
                    const product = listProducts.find(p => p.id === item.product_id);
                    return {
                        name: product.name,
                        unit_amount: {
                            currency_code: 'USD',
                            value: product.price.toFixed(2)
                        },
                        quantity: item.quantity
                    };
                });

                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            currency_code: 'USD',
                            value: totalAmount,
                            breakdown: {
                                item_total: {
                                    currency_code: 'USD',
                                    value: totalAmount
                                }
                            }
                        },
                        items: items
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    const customerEmail = document.getElementById('customer-email').value;
                    const cart = getCartFromLocalStorage();
                    const orderDetails = cart.map(item => `${item.quantity}x ${listProducts.find(p => p.id === item.product_id).name}`).join(', ');

                    sendDataToGoogleScript(customerEmail, orderDetails);
                });
            }
        }).render('#paypal-button-container');
    } else {
        console.error('PayPal SDK not loaded');
    }
      // Disable Go to QR button and PayPal button initially
      gotoQRButton.style.pointerEvents = 'none';
      gotoQRButton.style.opacity = '0.5';
      paypalButtonContainer.style.pointerEvents = 'none';
      paypalButtonContainer.style.opacity = '0.5';
  
      // Function to validate email input and enable/disable buttons
      function validateEmail() {
          const email = customerEmailInput.value;
          const isValid = email.includes('@');
  
          if (isValid) {
              gotoQRButton.style.pointerEvents = 'auto';
              gotoQRButton.style.opacity = '1';
              paypalButtonContainer.style.pointerEvents = 'auto';
              paypalButtonContainer.style.opacity = '1';
          } else {
              gotoQRButton.style.pointerEvents = 'none';
              gotoQRButton.style.opacity = '0.5';
              paypalButtonContainer.style.pointerEvents = 'none';
              paypalButtonContainer.style.opacity = '0.5';
          }
      }
    
        // Add event listener to email input to validate on input change
        customerEmailInput.addEventListener('input', validateEmail);


        gotoQRButton.addEventListener('click', () => {
            const customerEmail = customerEmailInput.value;
            if (!customerEmail.includes('@')) {
                showNotification('Please enter a valid email address before proceeding.');
                return;
            }
        
            const cart = getCartFromLocalStorage();
            const orderDetails = cart.map(item => `${item.quantity}x ${listProducts.find(p => p.id === item.product_id).name}`).join(', ');
            const totalAmount = checkoutTotalPrice.textContent.trim();
        
            // Show QR code section
            const qrContainer = document.querySelector('.qr-container');
            qrContainer.style.display = 'block';
        
            // Update payment message
            const paymentMessage = document.getElementById('paymentMessage');
            paymentMessage.textContent = `Please pay the total of ${totalAmount} to complete payment`;
        
            // Pre-fill email and order details
            document.getElementById('qr-email').value = customerEmail;
            document.getElementById('order-details').value = orderDetails;
        
            // Hide the main checkout content
            document.querySelector('.checkout-container').style.display = 'none';
        });
        
        // Add this new event listener for the close button in the QR section
        document.getElementById('close-button').addEventListener('click', () => {
            document.querySelector('.qr-container').style.display = 'none';
            document.querySelector('.checkout-container').style.display = 'block';
        });
        
        closeButton.addEventListener('click', () => {
            window.location.href = 'shop.html';
        });
        
        renderCartItems();
        validateEmail(); // Initial validation to set the correct state of the buttons
    });
