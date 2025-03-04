document.addEventListener('DOMContentLoaded', () => {
    const illustrationDetailContainer = document.getElementById('brand-detail');
    let currentIllustration;
    let illustrations = [];

    // Function to fetch illustrations data
    const fetchIllustrations = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/illustrations');
            illustrations = await response.json();
            initializeIllustration();
        } catch (error) {
            console.error('Error fetching illustrations:', error);
        }
    };

    // Initialize the current illustration
    const initializeIllustration = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const illustrationId = parseInt(urlParams.get('id'));
        currentIllustration = illustrations.find(ill => ill.id === illustrationId) || illustrations[0];
        renderIllustrationDetail();
    };

    const renderIllustrationDetail = () => {
        if (currentIllustration) {
            illustrationDetailContainer.innerHTML = `
                <div class="detail_head">
                    <div class="detail_back"><a href="Illustration.html">Back</a></div>
                    <div class="illustration_name">${currentIllustration.name}</div>
                    <div class="detail_next"><a href="#" id="nextIllustration">Next</a></div>
                </div>
                <div class="detail_content">
                    <div class="detail_main_img">
                        <img src="${currentIllustration.image}" alt="${currentIllustration.name}">
                    </div>
                    <div class="story">
                        <h2>Story</h2>
                        <p>${currentIllustration.story}</p>
                    </div>
                    <div class="detail_img_grid">
                        <img src="${currentIllustration.image1}" alt="${currentIllustration.name} Detail 1">
                        <img src="${currentIllustration.image2}" alt="${currentIllustration.name} Detail 2">
                    </div>
                    <div class="detail_bottom_img">
                        <img src="${currentIllustration.image3}" alt="${currentIllustration.name} Detail 3">
                    </div>
                </div>
                <div class="detail_end">
                    <a href="Illustration.html">Back</a>
                    <a href="Illustration.html">All Illustrations</a>
                    <a href="#" id="nextIllustration">Next</a>
                </div>
            `;

            document.getElementById('nextIllustration').addEventListener('click', navigateToNext);
            document.getElementById('nextIllustrationBottom').addEventListener('click', navigateToNext);
            document.getElementById('prevIllustration').addEventListener('click', navigateToPrev);
            document.getElementById('prevIllustrationBottom').addEventListener('click', navigateToPrev);
        } else {
            illustrationDetailContainer.innerHTML = '<p>Illustration not found.</p>';
        }
    };

    const navigateToNext = (e) => {
        e.preventDefault();
        const currentIndex = illustrations.findIndex(ill => ill.id === currentIllustration.id);
        const nextIndex = (currentIndex + 1) % illustrations.length;
        currentIllustration = illustrations[nextIndex];
        updateURL();
        renderIllustrationDetail();
    };

    const navigateToPrev = (e) => {
        e.preventDefault();
        const currentIndex = illustrations.findIndex(ill => ill.id === currentIllustration.id);
        const prevIndex = (currentIndex - 1 + illustrations.length) % illustrations.length;
        currentIllustration = illustrations[prevIndex];
        updateURL();
        renderIllustrationDetail();
    };

    const updateURL = () => {
        const newUrl = `${window.location.pathname}?id=${currentIllustration.id}`;
        history.pushState(null, '', newUrl);
    };

    // Start by fetching the illustrations
    fetchIllustrations();
});
