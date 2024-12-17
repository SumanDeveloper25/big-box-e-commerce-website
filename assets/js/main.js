const slides = document.querySelectorAll('.slide')

var slideCounter = 0

console.log(slides)

slides.forEach(
    (slide, index) => {
        slide.style.left = `${index * 100}%`
    }
)

const goNext = () => {
    if (slideCounter < 4) {
        slideCounter++
        slideImage()
    } else {
        slideCounter = 0
        slideImage()
    }
}

const goPrev = () => {
    if (slideCounter != 0) {
        slideCounter--
        slideImage()
    } else {
        slideCounter = 4
        slideImage()
    }
}

const slideImage = () => {
    slides.forEach(
        (slide) => {
            slide.style.transform = `translateX(-${slideCounter * 100}%)`
        }
    )
}



fetch('data/products.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('product-container');

        // Loop through the product data
        data.forEach(product => {
            // Create the card HTML structure
            const card = `
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="card shadow-lg rounded-3 border-0 h-100" style="max-width: 18rem; margin: auto;">
            <img src="${product.image}" 
                 class="card-img-top mx-auto mt-3" 
                 style="width: 140px; height: 140px; object-fit: contain;" 
                 alt="${product.productName}">
            <div class="card-body text-center p-3 d-flex flex-column">
                <h6 class="card-title text-truncate">${product.productName}</h6>
                <p class="card-text mb-1 text-muted small">${product.retailerName}</p>
                <p class="card-text mb-1 fw-bold text-success">${product.price}</p>
                <p class="card-text small mb-2">${product.specifications}</p>
                <div class="mt-auto">
                    <span class="text-warning">${'⭐'.repeat(Math.round(product.rating))}</span>
                </div>
                <button class="btn btn-sm mt-3" style="background-color: #8D5122; color: #fff;">Add to Cart</button>
            </div>
        </div>
    </div>
`;

            // Append the card to the container
            container.innerHTML += card;
        });
    })
    .catch(error => console.error('Error loading product data:', error));