document.addEventListener('DOMContentLoaded', () => {
    const brandDetailContainer = document.getElementById('brand-detail');
    let currentBrand;
    let brands = [];

    const fetchBrands = async () => {
        try {
            const response = await fetch('./data/brands.json');
            brands = await response.json();
            initializeBrand();
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const initializeBrand = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const brandId = parseInt(urlParams.get('id'));
        currentBrand = brands.find(brand => brand.id === brandId) || brands[0];
        renderBrandDetail();
    };

    const renderBrandDetail = () => {
        if (currentBrand) {
            brandDetailContainer.innerHTML = `
                <div class="detail_head">
                    <div class="detail_back"><a href="Brand.html" id="prevBrand">Back</a></div>
                    <div class="brand_name">${currentBrand.name}</div>
                    <div class="detail_next"><a href="#" id="nextBrand">Next</a></div>
                </div>
                <div class="detail_content">
                    <div class="detail_main_img">
                        <img src="${currentBrand.image}" alt="${currentBrand.name}">
                    </div>
                    <div class="brand_story">
                        <h3>Story</h3>
                        <p>${currentBrand.story ? currentBrand.story : 'No story available for this brand.'}</p>
                    </div>
                    <div class="detail_img_grid">
                        <img src="${currentBrand.image1}" alt="${currentBrand.name} Detail 1">
                        <img src="${currentBrand.image2}" alt="${currentBrand.name} Detail 2">
                    </div>
                    <div class="detail_bottom_img">
                        <img src="${currentBrand.image3}" alt="${currentBrand.name} Detail 3">
                    </div>
                </div>
                <div class="detail_end">
                    <a href="#" id="prevBrandBottom">Back</a>
                    <a href="/Newstalgia/Brand.html">All Brands</a>
                    <a href="#" id="nextBrandBottom">Next</a>
                </div>
            `;

            document.getElementById('nextBrand').addEventListener('click', navigateToNext);
            document.getElementById('nextBrandBottom').addEventListener('click', navigateToNext);
            document.getElementById('prevBrand').addEventListener('click', navigateToPrev);
            document.getElementById('prevBrandBottom').addEventListener('click', navigateToPrev);
        } else {
            brandDetailContainer.innerHTML = '<p>Brand not found.</p>';
        }
    };

    const navigateToNext = (e) => {
        e.preventDefault();
        const currentIndex = brands.findIndex(brand => brand.id === currentBrand.id);
        const nextIndex = (currentIndex + 1) % brands.length;
        currentBrand = brands[nextIndex];
        updateURL();
        renderBrandDetail();
    };

    const navigateToPrev = (e) => {
        e.preventDefault();
        const currentIndex = brands.findIndex(brand => brand.id === currentBrand.id);
        const prevIndex = (currentIndex - 1 + brands.length) % brands.length;
        currentBrand = brands[prevIndex];
        updateURL();
        renderBrandDetail();
    };

    const updateURL = () => {
        const newUrl = `${window.location.pathname}?id=${currentBrand.id}`;
        history.pushState(null, '', newUrl);
    };

    fetchBrands();
});
