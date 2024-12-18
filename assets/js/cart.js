// // Utility function to get cookies as an object
// function getCookies() {
//     return document.cookie.split(";").reduce((cookies, cookie) => {
//         const [name, value] = cookie.split("=").map(c => c.trim());
//         cookies[name] = value ? decodeURIComponent(value) : "";
//         return cookies;
//     }, {});
// }

// // Render cart items
// function renderCart() {
//     const cookies = getCookies();
//     const cart = cookies.cart ? JSON.parse(cookies.cart) : [];

//     const cartContainer = document.getElementById('cart-container');

//     if (cart.length === 0) {
//         cartContainer.innerHTML = '<p>Your cart is empty.</p>';
//         return;
//     }

//     // Combine duplicate products by summing up their quantities and totals
//     const consolidatedCart = cart.reduce((acc, item) => {
//         const existingItem = acc.find(i => i.productName === item.productName);
//         if (existingItem) {
//             existingItem.quantity += item.quantity;
//             existingItem.totalPrice += item.price * item.quantity;
//         } else {
//             acc.push({
//                 ...item,
//                 totalPrice: item.price * item.quantity,
//             });
//         }
//         return acc;
//     }, []);

//     let cartHTML = `
//         <table class="table">
//             <thead>
//                 <tr>
//                     <th>Image</th>
//                     <th>Product Name</th>
//                     <th>Price</th>
//                     <th>Quantity</th>
//                     <th>Total</th>
//                 </tr>
//             </thead>
//             <tbody>
//     `;

//     let grandTotal = 0;

//     consolidatedCart.forEach((item) => {
//         grandTotal += item.totalPrice;

//         cartHTML += `
//             <tr>
//                 <td><img src="${item.image}" alt="${item.productName}" class="img-fluid" style="max-width: 100px;"></td>
//                 <td>${item.productName}</td>
//                 <td>${item.price}</td>
//                 <td>${item.quantity}</td>
//                 <td>${item.totalPrice.toFixed(2)}</td>
//             </tr>
//         `;
//     });

//     cartHTML += `
//             </tbody>
//         </table>
//         <div class="text-end">
//             <h4>Grand Total: ${grandTotal.toFixed(2)}</h4>
//             <button id="checkout" class="btn btn-success">Proceed to Checkout</button>
//         </div>
//     `;

//     cartContainer.innerHTML = cartHTML;

//     // Attach event listener to the checkout button
//     document.getElementById('checkout').addEventListener('click', () => {
//         // Save consolidated cart to localStorage for checkout
//         localStorage.setItem('checkoutCart', JSON.stringify(consolidatedCart));

//         // Redirect to the checkout page
//         window.location.href = 'checkout.html';
//     });
// }

// // Initialize the cart rendering
// renderCart();


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

// Function to fetch the price of a product by name (replace this with actual API call)
async function fetchPrice(productName) {
    try {
        const response = await fetch(`/getProductPrice?name=${encodeURIComponent(productName)}`);
        if (!response.ok) throw new Error('Failed to fetch price');
        const data = await response.json();
        return parseFloat(data.price); // Assuming API returns { price: <number> }
    } catch (error) {
        console.error('Error fetching price:', error);
        return 0; // Fallback price in case of error
    }
}

// Render cart items
async function renderCart() {
    const cookies = getCookies();
    const cart = cookies.cart ? JSON.parse(cookies.cart) : [];

    const cartContainer = document.getElementById('cart-container');

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    // Combine duplicate products by summing up their quantities
    const consolidatedCart = cart.reduce((acc, item) => {
        const existingItem = acc.find(i => i.productName === item.productName);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            acc.push({ ...item });
        }
        return acc;
    }, []);

    let cartHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    let grandTotal = 0;

    // Iterate through cart and fetch prices
    for (let index = 0; index < consolidatedCart.length; index++) {
        const item = consolidatedCart[index];
        const price = await fetchPrice(item.productName);
        const totalPrice = price * item.quantity;
        grandTotal += totalPrice;

        console.log(price);
        
        cartHTML += `
            <tr>
                <td><img src="${item.image}" alt="${item.productName}" class="img-fluid" style="max-width: 100px;"></td>
                <td>${item.productName}</td>
                <td class="price" data-index="${index}">${price.toFixed(2)}</td>
                <td>
                    <input type="number" class="form-control quantity-input" data-index="${index}" value="${item.quantity}" min="1">
                </td>
                <td class="total-price" data-index="${index}">${totalPrice.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger delete-btn" data-index="${index}">Delete</button>
                </td>
            </tr>
        `;
    }

    cartHTML += `
            </tbody>
        </table>
        <div class="text-end">
            <h4>Grand Total: <span id="grand-total">${grandTotal.toFixed(2)}</span></h4>
            <button id="checkout" class="btn btn-success">Proceed to Checkout</button>
        </div>
    `;

    cartContainer.innerHTML = cartHTML;

    // Attach event listeners for quantity input changes
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', async (e) => {
            const index = e.target.dataset.index;
            const newQuantity = Number(e.target.value);

            if (newQuantity < 1) return; // Prevent invalid quantity

            // Update cart quantity
            consolidatedCart[index].quantity = newQuantity;

            // Fetch updated price
            const price = await fetchPrice(consolidatedCart[index].productName);

            // Recalculate and update total price for the product
            const totalPrice = price * newQuantity;
            document.querySelector(`.total-price[data-index="${index}"]`).textContent = totalPrice.toFixed(2);

            // Recalculate and update grand total
            const grandTotal = consolidatedCart.reduce((sum, item, idx) => {
                const itemPrice = idx === parseInt(index) ? price : parseFloat(document.querySelector(`.price[data-index="${idx}"]`).textContent);
                return sum + itemPrice * item.quantity;
            }, 0);

            document.getElementById('grand-total').textContent = grandTotal.toFixed(2);

            // Save updated cart to cookies
            setCookie('cart', JSON.stringify(consolidatedCart));
        });
    });

    // Attach event listeners for delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;

            // Remove product from cart
            consolidatedCart.splice(index, 1);

            // Save updated cart to cookies
            setCookie('cart', JSON.stringify(consolidatedCart));

            // Re-render cart
            renderCart();
        });
    });

    // Checkout button event
    document.getElementById('checkout').addEventListener('click', () => {
        // Save consolidated cart to localStorage for checkout
        localStorage.setItem('checkoutCart', JSON.stringify(consolidatedCart));

        // Redirect to the checkout page
        window.location.href = 'checkout.html';
    });
}

// Initialize the cart rendering
renderCart();
