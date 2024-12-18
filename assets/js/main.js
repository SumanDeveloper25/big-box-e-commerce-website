// Carousel Functionality
const slides = document.querySelectorAll('.slide');
let slideCounter = 0;

// Position slides side by side
slides.forEach((slide, index) => {
    slide.style.left = `${index * 100}%`;
});

// Navigate to the next slide
const goNext = () => {
    slideCounter = (slideCounter + 1) % slides.length;
    updateSlidePosition();
};

// Navigate to the previous slide
const goPrev = () => {
    slideCounter = (slideCounter - 1 + slides.length) % slides.length;
    updateSlidePosition();
};

// Update slide positions
const updateSlidePosition = () => {
    slides.forEach(slide => {
        slide.style.transform = `translateX(-${slideCounter * 100}%)`;
    });
};

// Automatically slide every 3.5 seconds
setInterval(goNext, 3500);

// Fetch Utility Function
const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Render Product Cards
const renderProductCards = (containerId, products, limit = 10) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing content
    const limitedProducts = products.slice(0, limit);

    limitedProducts.forEach(product => {
        const card = `
            <div class="col-6 col-lg-3 mb-3">
                <div class="card shadow-sm rounded-3 border-0 h-100">
                    <img src="${product.image}" 
                         class="card-img-top mx-auto mt-3" 
                         style="width: 120px; height: 120px; object-fit: contain;" 
                         alt="${product.productName}">
                    <div class="card-body text-center p-2 d-flex flex-column">
                        <h6 class="card-title text-truncate">${product.productName}</h6>
                        <p class="card-text mb-1 text-muted small">${product.retailerName}</p>
                        <p class="card-text fw-bold text-success">${product.price}</p>
                        <p class="card-text small mb-2">${product.specifications}</p>
                        <div class="mt-auto">
                            <span class="text-warning">${'⭐'.repeat(Math.round(product.rating))}</span>
                        </div>
                        <button 
                            class="btn btn-sm mt-2 btn-add-to-cart" 
                            style="background-color: #8D5122; color: #fff;"
                            data-image="${product.image}"
                            data-name="${product.productName}"
                            data-retailer="${product.retailerName}"
                            data-price="${product.price}"
                            data-specifications="${product.specifications}"
                            data-rating="${product.rating}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>`;
        container.innerHTML += card;
    });
};

// Initialize Product Sections
const initializeProducts = async () => {
    const data = await fetchData('data/products.json');
    if (!data) return;

    const dealsContainer = 'deals-product-container';
    const selectedProducts = selectTopProducts(data, 2);
    renderProductCards(dealsContainer, selectedProducts);

    const electronicsContainer = 'best-electronics-container';
    const electronicsProducts = data.filter(product => product.category.toLowerCase() === 'electronics');
    renderProductCards(electronicsContainer, electronicsProducts);
};

// Select Top Products by Category
const selectTopProducts = (products, perCategory) => {
    const productsByCategory = products.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
    }, {});

    const selectedProducts = [];
    Object.values(productsByCategory).forEach(products => {
        const sortedProducts = products.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
        selectedProducts.push(...sortedProducts.slice(0, perCategory));
    });

    return selectedProducts;
};

const initializeBrands = async () => {
    const data = await fetchData('data/brand.json');
    if (!data) return;

    const container = document.getElementById('top-smartphone-brand');
    const topBrands = data.slice(0, 10);

    const row = `
        <div class="d-flex flex-wrap justify-content-center align-items-center gap-4 text-center">
            ${topBrands.map(brand => `
                <div class="brand-container">
                    <div class="brand-logo mx-auto rounded-circle">
                        <img src="${brand.logo}" 
                             class="img-fluid" 
                             alt="${brand.brandName}">
                    </div>
                    <h6 class="mt-2">${brand.brandName}</h6>
                </div>`).join('')}
        </div>`;
    container.innerHTML = row;
};

const addToCart = (product) => {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    window.location.href = 'product-details.html';
};

document.addEventListener('click', (event) => {
    if (event.target.matches('.btn-add-to-cart')) {
        const product = {
            image: event.target.dataset.image,
            productName: event.target.dataset.name,
            retailerName: event.target.dataset.retailer,
            price: event.target.dataset.price,
            specifications: event.target.dataset.specifications,
            rating: event.target.dataset.rating,
        };
        addToCart(product);
    }
});

initializeProducts();
initializeBrands();
