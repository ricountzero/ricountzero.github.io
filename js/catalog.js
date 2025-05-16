// Fetch and display the name from vacuum-systems.json
fetch('../data/vacuum-systems.json')
    .then(response => response.json())
    .then(data => {
        const opticCategory = data.find(category => category.name === 'optic');
        const decorationCategory = data.find(category => category.name === 'decoration');
        const catalogTilesContainer = document.querySelector('.catalog-page-tiles');
        const showMoreButton = document.getElementById('show-more-button');
        const searchInput = document.querySelector('.search-input');
        let currentIndex = 0;
        const initialItems = 3;
        const itemsPerLoad = 6;
        
        // Clear existing content
        catalogTilesContainer.innerHTML = '';
        
        function createTile(system) {
            const tileRow = document.createElement('div');
            tileRow.className = 'tile-row-catalog';
            
            tileRow.innerHTML = `
                <div class="catalog-page-tile">
                    <picture>
                        <source media="(max-width: 480px)" srcset="${system.img.replace('.png', '-small.webp')}" type="image/webp">
                        <source media="(max-width: 480px)" srcset="${system.img.replace('.png', '-small.png')}" type="image/png">
                        <source media="(max-width: 768px)" srcset="${system.img.replace('.png', '-medium.webp')}" type="image/webp">
                        <source media="(max-width: 768px)" srcset="${system.img.replace('.png', '-medium.png')}" type="image/png">
                        <source srcset="${system.img.replace('.png', '.webp')}" type="image/webp">
                        <img src="${system.img}" alt="${system.name}" loading="lazy">
                    </picture>
                    <h3>${system.name}</h3>
                    <div class="catalog-page-desc">${system.desc}</div>
                </div>
            `;
            
            return tileRow;
        }

        // Combine systems from both categories
        const allSystems = [
            ...(opticCategory ? opticCategory.systems : []),
            ...(decorationCategory ? decorationCategory.systems : [])
        ];

        function displayItems(startIndex, count, searchText = '') {
            const endIndex = Math.min(startIndex + count, allSystems.length);
            catalogTilesContainer.innerHTML = ''; // Clear existing content
            
            const filteredSystems = searchText.length >= 3 
                ? allSystems.filter(system => 
                    system.name.toLowerCase().includes(searchText.toLowerCase()))
                : allSystems;

            for (let i = 0; i < Math.min(endIndex, filteredSystems.length); i++) {
                const tileRow = createTile(filteredSystems[i]);
                catalogTilesContainer.appendChild(tileRow);
            }
            
            currentIndex = endIndex;
            
            // Hide button if all items are shown or if searching
            if (currentIndex >= filteredSystems.length || searchText.length >= 3) {
                showMoreButton.style.display = 'none';
            } else {
                showMoreButton.style.display = 'block';
            }
        }

        // Show initial items
        displayItems(0, initialItems);

        // Add click handler for show more button
        showMoreButton.addEventListener('click', (e) => {
            e.preventDefault();
            displayItems(currentIndex, itemsPerLoad, searchInput.value);
        });

        // Add search functionality
        searchInput.addEventListener('input', (e) => {
            const searchText = e.target.value;
            if (searchText.length >= 3) {
                displayItems(0, allSystems.length, searchText);
            } else if (searchText.length === 0) {
                displayItems(0, initialItems);
            }
        });
    })
    .catch(error => console.error('Error loading vacuum systems:', error)); 