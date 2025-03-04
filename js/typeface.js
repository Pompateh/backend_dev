document.addEventListener('DOMContentLoaded', () => {
    const typefaceListContainer = document.getElementById('typeface-list');
    let typefaces = [];

    // Fetch the typeface data
    fetch('http://localhost:5000/api/typefaces')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(typefacesData => {
            console.log('Typefaces data loaded:', typefacesData);
            typefaces = typefacesData;
            renderTypefaceList();
        })
        .catch(error => {
            console.error('Error loading Typeface data:', error);
            alert('Failed to load Typeface data. Please try again later.');
        });

    function renderTypefaceList() {
        typefaceListContainer.innerHTML = '';
        typefaces.forEach(typeface => {
            // Use _id if available, otherwise typeface.id
            const id = typeface._id || typeface.id;
            // Determine the image URL: use "image" if available; otherwise fallback to "image1"
            let imageUrl = '';
            if (typeface.image) {
                imageUrl = typeface.image;
            } else if (typeface.image1) {
                imageUrl = typeface.image1;
            } else {
                imageUrl = 'placeholder-image-url'; // Replace with an actual URL to a placeholder image.
            }
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = id;
            card.innerHTML = `
                <div class="card-image" style="background-image: url('${imageUrl}');"></div>
                <div class="card-content">
                    <h1>${typeface.name}</h1>
                </div>
            `;
            card.addEventListener('click', () => showTypefaceDetail(id));
            typefaceListContainer.appendChild(card);
        });
    }

    function showTypefaceDetail(typefaceId) {
        console.log('Card clicked, typefaceId:', typefaceId);
        const typefaceData = typefaces.find(typeface => (typeface._id || typeface.id) === typefaceId);
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
