document.addEventListener('DOMContentLoaded', () => {
    const illustrationListContainer = document.getElementById('illustration-list');

    let illustrations = [];

    // Fetch the illustration data
    fetch('http://localhost:5000/api/illustrations')  // Adjusted path to match the correct location
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(illustrationsData => {
            console.log('Illustrations data loaded:', illustrationsData);  // Log the loaded data
            illustrations = illustrationsData;
            renderIllustrationList();
        })
        .catch(error => {
            console.error('Error loading Illustration data:', error);
            // Display error message to user
            alert('Failed to load Illustration data. Please try again later.');
        });

    function renderIllustrationList() {
        illustrationListContainer.innerHTML = '';
        illustrations.forEach(illustration => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = illustration.id;
            card.innerHTML = `
                <div class="card-image" style="background-image: url('${illustration.image}');"></div>
                <div class="card-content">
                    <h1>${illustration.name}</h1>
                </div>
            `;
            card.addEventListener('click', () => showIllustrationDetail(illustration.id));
            illustrationListContainer.appendChild(card);
        });
    }

    function showIllustrationDetail(illustrationId) {
        console.log('Card clicked, illustrationId:', illustrationId);
        const illustrationData = illustrations.find(illustration => illustration.id === illustrationId);
        
        if (illustrationData) {
            console.log('Illustration data found:', illustrationData);
            // Store the illustration details in localStorage
            localStorage.setItem('currentIllustration', JSON.stringify(illustrationData));

            // Navigate to the illustration detail page
            window.location.href = 'illustration-detail.html';
        } else {
            console.error('Illustration data not found for id:', illustrationId);
        }
    }
});