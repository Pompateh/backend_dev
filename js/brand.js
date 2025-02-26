document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');

    // Fetch the brand data
    fetch('./data/brands.json')  // Adjust this path if needed
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(brandsData => {
            console.log('Brands data loaded:', brandsData);  // Log the loaded data
            cards.forEach((card, index) => {
                // Use index + 1 as id if data-id is not set
                const brandId = card.dataset.id || (index + 1).toString();
                card.addEventListener('click', () => {
                    console.log('Card clicked, brandId:', brandId);  // Log the click event
                    const brandData = brandsData.find(brand => brand.id === brandId);
                    
                    if (brandData) {
                        console.log('Brand data found:', brandData);  // Log the found brand data
                        // Store the brand details in localStorage
                        localStorage.setItem('currentBrand', JSON.stringify(brandData));

                        // Navigate to the brand detail page
                        window.location.href = 'brand-detail.html';
                    } else {
                        console.error('Brand data not found for id:', brandId);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error loading brand data:', error);
            // Display error message to user
            alert('Failed to load brand data. Please try again later.');
        });
});