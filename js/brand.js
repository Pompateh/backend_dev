document.addEventListener('DOMContentLoaded', () => {
    const brandListContainer = document.getElementById('brand-list');

    let brands = [];

    // Fetch the brand data
    fetch('http://localhost:5000/api/brands')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(brandsData => {
            console.log('Brands data loaded:', brandsData);  // Log the loaded data
            brands = brandsData;
            renderBrandList();
        })
        .catch(error => {
            console.error('Error loading brand data:', error);
            // Display error message to user
            alert('Failed to load brand data. Please try again later.');
        });

    function renderBrandList() {
        brandListContainer.innerHTML = '';
        brands.forEach(brand => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = brand.id;
            card.innerHTML = `
                <div class="card-image" style="background-image: url('${brand.image.replace('./', '')}');"></div>
                <div class="card-content">
                    <h1>${brand.name}</h1>
                </div>
            `;
            card.addEventListener('click', () => showBrandDetail(brand.id));
            brandListContainer.appendChild(card);
        });
    }

    function showBrandDetail(brandId) {
        console.log('Card clicked, brandId:', brandId);
        const brandData = brands.find(brand => brand.id === brandId);
        
        if (brandData) {
            console.log('Brand data found:', brandData);
            // Store the brand details in localStorage
            localStorage.setItem('currentBrand', JSON.stringify(brandData));

            // Navigate to the brand detail page
            window.location.href = 'brand-detail.html';
        } else {
            console.error('Brand data not found for id:', brandId);
        }
    }
});