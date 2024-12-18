const slides = document.querySelectorAll('.slide');

let slideCounter = 0;

// Position each slide side by side
slides.forEach((slide, index) => {
    slide.style.left = `${index * 100}%`;
});

// Function to go to the next slide
const goNext = () => {
    if (slideCounter < slides.length - 1) {
        slideCounter++;
    } else {
        slideCounter = 0; // Reset to the first slide
    }
    slideImage();
};

// Function to go to the previous slide
const goPrev = () => {
    if (slideCounter > 0) {
        slideCounter--;
    } else {
        slideCounter = slides.length - 1; // Go to the last slide
    }
    slideImage();
};

// Function to move slides using translateX
const slideImage = () => {
    slides.forEach(slide => {
        slide.style.transform = `translateX(-${slideCounter * 100}%)`;
    });
};

// Automatically slide images every 2 seconds
setInterval(goNext, 3500);


fetch('data/products.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('deals-product-container');

        // Group products by category
        const productsByCategory = data.reduce((acc, product) => {
            if (!acc[product.category]) {
                acc[product.category] = [];
            }
            acc[product.category].push(product);
            return acc;
        }, {});

        // Prepare an array to hold the selected top products
        const selectedProducts = [];

        // Iterate over each category and pick up to 2 products with the lowest price
        Object.entries(productsByCategory).forEach(([category, products]) => {
            // Sort products in the category by price (convert price string to number)
            const sortedProducts = products.sort((a, b) => {
                const priceA = parseFloat(a.price.replace('$', ''));
                const priceB = parseFloat(b.price.replace('$', ''));
                return priceA - priceB;
            });

            // Take up to 2 products and add them to the selected products array
            selectedProducts.push(...sortedProducts.slice(0, 2));
        });

        // Limit the total products to 10
        const finalProducts = selectedProducts.slice(0, 10);

        // Generate cards for the final products
        finalProducts.forEach(product => {
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
                <button class="btn btn-sm mt-2" style="background-color: #8D5122; color: #fff;">Add to Cart</button>
            </div>
        </div>
    </div>
            `;
            container.innerHTML += card;
        });
    })
    .catch(error => console.error('Error fetching product data:', error));
    
    fetch('data/products.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('best-electronics-container');

        // Group products by category
        const productsByCategory = data.reduce((acc, product) => {
            if (!acc[product.category]) {
                acc[product.category] = [];
            }
            acc[product.category].push(product);
            return acc;
        }, {});

        // Prepare an array to hold the selected top products
        const selectedProducts = [];

        // Iterate over each category and pick up to 2 products with the lowest price
        Object.entries(productsByCategory).forEach(([category, products]) => {
            // Sort products in the category by price (convert price string to number)
            const sortedProducts = products.sort((a, b) => {
                const priceA = parseFloat(a.price.replace('$', ''));
                const priceB = parseFloat(b.price.replace('$', ''));
                return priceA - priceB;
            });

            // Take up to 2 products and add them to the selected products array
            selectedProducts.push(...sortedProducts.slice(0, 2));
        });

        // Limit the total products to 10
        const finalProducts = selectedProducts.slice(0, 10);

        // Generate cards for the final products
        finalProducts.forEach(product => {
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
                <button class="btn btn-sm mt-2" style="background-color: #8D5122; color: #fff;">Add to Cart</button>
            </div>
        </div>
    </div>
            `;
            container.innerHTML += card;
        });
    })
    .catch(error => console.error('Error fetching product data:', error));    

// fetch the best electronics product
fetch('data/products.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('best-electronics-container');

        // Filter products by category: "Electronics"
        const electronicsProducts = data.filter(product => product.category.toLowerCase() === 'electronics');

        // Limit the total electronics products to 10
        const finalProducts = electronicsProducts.slice(0, 10);

        // Generate cards for the final products
        finalProducts.forEach(product => {
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
                <button class="btn btn-sm mt-2" style="background-color: #8D5122; color: #fff;">Add to Cart</button>
            </div>
        </div>
    </div>
            `;
            container.innerHTML += card;
        });
    })
    .catch(error => console.error('Error fetching product data:', error));

// fetched the brand smartphone brand logo
fetch('data/brand.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('top-smartphone-brand');

        // Limit to 8 brands for display
        const topBrands = data.slice(0, 10);

        // Generate a row layout for the brands
        const row = `
            <div class="d-flex flex-wrap justify-content-center gap-5">
                ${topBrands.map(brand => `
                    <div class="text-center">
                        <div class="brand-logo mx-auto rounded-circle" 
                             style="width: 70px; height: 70px; overflow: hidden; background-color: #f9f9f9;">
                            <img src="${brand.logo}" 
                                 class="img-fluid" 
                                 style="width: 80%; height: 80%; object-fit: contain;" 
                                 alt="${brand.brandName}">
                        </div>
                        <h6 class="mt-2">${brand.brandName}</h6>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = row;
    })
    .catch(error => console.error('Error fetching brand data:', error));
