document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const cards = document.querySelectorAll('.card');
    console.log('Number of cards found:', cards.length);

    // Fetch the illustration data
    fetch('./data/illustrations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(illustrationsData => {
            console.log('Illustrations data loaded:', illustrationsData);
            if (!Array.isArray(illustrationsData) || illustrationsData.length === 0) {
                throw new Error('Invalid or empty illustrations data');
            }
            cards.forEach((card, index) => {
                const illustrationId = card.dataset.id || (index + 1).toString();
                console.log(`Setting up click event for card ${index + 1}, illustrationId: ${illustrationId}`);
                card.addEventListener('click', () => {
                    console.log('Card clicked, illustrationId:', illustrationId);
                    const illustrationData = illustrationsData.find(illustration => illustration.id.toString() === illustrationId);
                    
                    if (illustrationData) {
                        console.log('Illustration data found:', illustrationData);
                        localStorage.setItem('currentIllustration', JSON.stringify(illustrationData));
                        window.location.href = 'illustration-detail.html';
                    } else {
                        console.error('Illustration data not found for id:', illustrationId);
                        alert(`No data found for illustration ${illustrationId}`);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to load illustration data. Please check the console for more details.');
        });
});