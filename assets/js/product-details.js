// Retrieve product from localStorage
const product = JSON.parse(localStorage.getItem('selectedProduct'));

// Utility function to get cookies as an object
function getCookies() {
    return document.cookie.split(";").reduce((cookies, cookie) => {
        const [name, value] = cookie.split("=").map(c => c.trim());
        cookies[name] = value ? decodeURIComponent(value) : "";
        return cookies;
    }, {});
}

// Utility function to set a cookie
function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
}

// Add product to cart with quantity
function addToCart(product, quantity) {
    const cookies = getCookies();
    const cart = cookies.cart ? JSON.parse(cookies.cart) : [];

    const productIndex = cart.findIndex(item => item.productName === product.productName);

    if (productIndex > -1) {
        // Update quantity if product already exists
        cart[productIndex].quantity += Number(quantity);
    } else {
        // Add new product with name, image, price, and quantity
        const productWithDetails = {
            productName: product.productName,
            image: product.image,
            price: parseFloat(product.price), // Ensure price is saved as a number
            quantity: Number(quantity)
        };
        cart.push(productWithDetails);
    }

    // Update cart in cookies
    setCookie("cart", JSON.stringify(cart));

    alert("Product added to cart!");
}

// Buy Now functionality (directly proceeds to checkout)
function buyNow(product, quantity) {
    // Add product with details and quantity to localStorage for checkout
    const productWithDetails = {
        productName: product.productName,
        image: product.image,
        price: parseFloat(product.price),
        quantity: Number(quantity)
    };
    localStorage.setItem('checkoutProduct', JSON.stringify(productWithDetails));

    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Render product details
if (product) {
    const productDetailsContainer = document.getElementById('product-details');

    const productDetails = `
        <div class="col-md-6">
            <img src="${product.image}" class="product-image img-fluid" alt="${product.productName}">
        </div>
        <div class="col-md-6">
            <h2>${product.productName}</h2>
            <p><strong>Retailer:</strong> ${product.retailerName}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Rating:</strong> ${'⭐'.repeat(Math.round(product.rating))}</p>
            <p><strong>Specifications:</strong></p>
            <ul>
                <li>${product.specifications}</li>
            </ul>
            <div class="mt-4">
                <label for="quantity" class="form-label"><strong>Quantity:</strong></label>
                <input type="number" id="quantity" class="form-control w-25 mb-3" value="1" min="1">
            </div>
            <button id="add-to-cart" class="btn btn-primary me-2">Add to Cart</button>
            <button id="buy-now" class="btn btn-success">Buy Now</button>
        </div>
    `;

    productDetailsContainer.innerHTML = productDetails;

    // Attach event listeners to buttons
    document.getElementById('add-to-cart').addEventListener('click', () => {
        const quantity = document.getElementById('quantity').value;
        addToCart(product, quantity);
    });

    document.getElementById('buy-now').addEventListener('click', () => {
        const quantity = document.getElementById('quantity').value;
        buyNow(product, quantity);
    });
} else {
    alert('No product details available!');
}
