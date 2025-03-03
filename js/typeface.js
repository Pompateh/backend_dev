document.addEventListener('DOMContentLoaded', () => {
    const typefaceListContainer = document.getElementById('typeface-list');

    let typefaces = [];

    // Fetch the typeface data
    fetch('./data/typeface.json')  // Adjusted path to match the correct location
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(typefacesData => {
            console.log('Typefaces data loaded:', typefacesData);  // Log the loaded data
            typefaces = typefacesData;
            renderTypefaceList();
        })
        .catch(error => {
            console.error('Error loading Typeface data:', error);
            // Display error message to user
            alert('Failed to load Typeface data. Please try again later.');
        });

    function renderTypefaceList() {
        typefaceListContainer.innerHTML = '';
        typefaces.forEach(typeface => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = typeface.id;
            card.innerHTML = `
                <div class="card-image" style="background-image: url('${typeface.image}');"></div>
                <div class="card-content">
                    <h1>${typeface.name}</h1>
                </div>
            `;
            card.addEventListener('click', () => showTypefaceDetail(typeface.id));
            typefaceListContainer.appendChild(card);
        });
    }

    function showTypefaceDetail(typefaceId) {
        console.log('Card clicked, typefaceId:', typefaceId);
        const typefaceData = typefaces.find(typeface => typeface.id === typefaceId);
        
        if (typefaceData) {
            console.log('Typeface data found:', typefaceData);
            // Store the typeface details in localStorage
            localStorage.setItem('currentTypeface', JSON.stringify(typefaceData));

            // Navigate to the typeface detail page
            window.location.href = 'typeface-detail.html';
        } else {
            console.error('Typeface data not found for id:', typefaceId);
        }
    }
});