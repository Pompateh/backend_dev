let iconCart = document.querySelector('.icon_cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon_cart span');
let checkoutButton = document.querySelector('.checkOut'); // Select checkout button

let listProducts = [];
let carts = [];

// Event listeners for opening and closing the cart
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Function to render product list
const addDatatoHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product._id;
            newProduct.innerHTML = `
                <div class="price-tag">${product.price}$</div>
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.type}</p>
            `;
            newProduct.addEventListener('click', () => {
                showProductDetail(product._id);
            });
            listProductHTML.appendChild(newProduct);
        });
    }
};

// Function to show product detail
const showProductDetail = (productId) => {
    const product = listProducts.find(p => p._id === productId);
    if (product) {
        console.log('Showing product detail for:', product);
        localStorage.setItem('currentProduct', JSON.stringify(product));
        window.location.href = `product-detail.html?id=${product._id}`;
    } else {
        console.error(`Product not found for id: ${productId}`);
    }
}

// Event listener for adding products to the cart
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('product-buy')) {
        let product_id = positionClick.dataset.id;
        addToCart(product_id);
    }
});

// Function to add a product to the cart
const addToCart = (product_id) => {
    console.log('Adding to cart, product_id:', product_id);
    if (!product_id) {
        console.error('Invalid product_id:', product_id);
        return;
    }
    let positionThisProductInCart = carts.findIndex(value => value.product_id === product_id);
    if (positionThisProductInCart < 0) {
        console.log('New item in cart');
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        console.log('Increasing quantity of existing item');
        carts[positionThisProductInCart].quantity += 1;
    }
    console.log('Updated cart:', carts);
    addCarttoHTML();
    addCartToMemory();
}


// Function to save cart to local storage
const addCartToMemory = () => {
    try {
        localStorage.setItem('cart', JSON.stringify(carts));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

// Function to render cart items in the HTML
const addCarttoHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach(cart => {
            if (!cart.product_id) {
                console.error('Invalid cart item:', cart);
                return;
            }
            let info = listProducts.find(p => p._id === cart.product_id);
            if (info) {
                totalQuantity += cart.quantity;
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = `
                    <div class="image">
                        <img src="${info.image}" alt="${info.name}">
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>
                    <div class="totalPrice">
                        ${(info.price * cart.quantity).toFixed(2)}$
                    </div>
                    <div class="quantity">
                        <span class="minus" data-id="${cart.product_id}">-</span>
                        <span>${cart.quantity}</span>
                        <span class="plus" data-id="${cart.product_id}">+</span>
                    </div>
                `;
                listCartHTML.appendChild(newCart);
            } else {
                console.warn(`Product not found for id: ${cart.product_id}`);
            }
        });
    }
    iconCartSpan.innerText = totalQuantity;
}

// Event listener for adjusting quantities in the cart
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.dataset.id;
        let change = positionClick.classList.contains('plus') ? 1 : -1;
        adjustCartQuantity(product_id, change);
    }
});

// Function to adjust the quantity of a product in the cart
const adjustCartQuantity = (product_id, change) => {
    console.log('Adjusting quantity, product_id:', product_id, 'change:', change);
    let positionThisProductInCart = carts.findIndex(value => value.product_id === product_id);
    if (positionThisProductInCart >= 0) {
        carts[positionThisProductInCart].quantity += change;
        if (carts[positionThisProductInCart].quantity <= 0) {
            carts.splice(positionThisProductInCart, 1);
        }
    }
    console.log('Updated cart:', carts);
    addCarttoHTML();
    addCartToMemory();
}

// Initialize the app and fetch products
const initApp = () => {
    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => {
            listProducts = data;
            console.log('listProducts:', listProducts);
            addDatatoHTML();
            if (localStorage.getItem('cart')) {
                let storedCarts = JSON.parse(localStorage.getItem('cart'));
                carts = storedCarts.filter(cart => listProducts.some(product => product._id === cart.product_id));
            }
            addCarttoHTML();
        })
        .catch(error => console.error('Error loading products:', error));
}


// Event listener for checkout button

window.addEventListener('cartUpdated', () => {
    carts = JSON.parse(localStorage.getItem('cart')) || [];
    addCarttoHTML();
});
checkoutButton.addEventListener('click', () => {
    window.location.href = 'checkout.html';
});

// Initialize the application
initApp();
