document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');

    // Fetch the typeface data
    fetch('../data/typeface.json')  // Changed to match the correct file name and path
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(typefacesData => {
            console.log('Typefaces data loaded:', typefacesData);  // Log the loaded data
            cards.forEach((card, index) => {
                // Use index + 1 as id if data-id is not set
                const typefaceId = card.dataset.id || (index + 1).toString();
                card.addEventListener('click', () => {
                    console.log('Card clicked, typefaceId:', typefaceId);  // Log the click event
                    const typefaceData = typefacesData.find(typeface => typeface.id === typefaceId);
                    
                    if (typefaceData) {
                        console.log('Typeface data found:', typefaceData);  // Log the found typeface data
                        // Navigate to the typeface detail page with the id as a query parameter
                        window.location.href = `typeface-detail.html?id=${typefaceId}`;
                    } else {
                        console.error('Typeface data not found for id:', typefaceId);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error loading typeface data:', error);
            // Display error message to user
            alert('Failed to load typeface data. Please try again later.');
        });
});