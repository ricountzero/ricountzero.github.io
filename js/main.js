// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.menu-toggle').addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.toggle('active');
        document.querySelector('.menu-icon').classList.toggle('active');
    });

    // Add event listeners to navigation links to close the menu when clicked
    const navLinks = document.querySelectorAll('.nav-menu li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Close the mobile menu
            document.querySelector('.nav-menu').classList.remove('active');
            document.querySelector('.menu-icon').classList.remove('active');
        });
    });

    // Language toggle functionality
    const langButton = document.querySelector('.lang-btn');
    if (langButton) {
        langButton.addEventListener('click', function() {
            // Get current and toggle language values
            const currentLang = this.getAttribute('data-current-lang');
            const toggleLang = this.getAttribute('data-toggle-lang');
            
            // Switch the values
            this.setAttribute('data-current-lang', toggleLang);
            this.setAttribute('data-toggle-lang', currentLang);
            
            // Update button text to show the language we can switch to
            this.textContent = currentLang.toUpperCase();
            
            console.log('Language switched to:', toggleLang);
            
            // Here you would add code to actually change the language
            // For example, loading different language files or updating text content
        });
    }

    // Certificate Carousel functionality - Only initialize if elements exist
    const slidesWrapper = document.querySelector('.carousel-slides-wrapper');
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    
    // Only run carousel code if necessary elements exist
    if (slidesWrapper && slides.length > 0 && dotsContainer && prevArrow && nextArrow) {
        let slidesPerPage = window.innerWidth >= 768 ? 3 : 2; // 3 per page on tablet+, 2 on mobile
        let totalPages = Math.ceil(slides.length / slidesPerPage);
        let currentPage = 0;
        let dots = [];
        
        // Function to generate pagination dots
        function generateDots() {
            // Clear existing dots
            dotsContainer.innerHTML = '';
            dots = [];
            
            // Create new dots based on total pages
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('data-slide', i);
                
                // Add click event to each dot
                dot.addEventListener('click', function() {
                    showPage(parseInt(this.getAttribute('data-slide')));
                });
                
                dotsContainer.appendChild(dot);
                dots.push(dot);
            }
        }
        
        // Function to update the dots
        function updateDots(pageIndex) {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === pageIndex);
            });
        }
        
        // Function to show correct slides for current page
        function updateSlideVisibility(pageIndex) {
            slides.forEach((slide, index) => {
                const startIdx = pageIndex * slidesPerPage;
                const endIdx = startIdx + slidesPerPage;
                
                if (index >= startIdx && index < endIdx) {
                    slide.classList.remove('hidden');
                } else {
                    slide.classList.add('hidden');
                }
            });
        }
        
        // Function to show the selected page
        function showPage(pageIndex) {
            if (pageIndex < 0) {
                pageIndex = totalPages - 1; // Loop to the last page
            } else if (pageIndex >= totalPages) {
                pageIndex = 0; // Loop to the first page
            }
            
            // Update current page
            currentPage = pageIndex;
            
            // Update which slides are visible
            updateSlideVisibility(currentPage);
            
            // Update dots
            updateDots(currentPage);
        }
        
        // Handle next button click
        nextArrow.addEventListener('click', function() {
            showPage(currentPage + 1);
        });
        
        // Handle previous button click
        prevArrow.addEventListener('click', function() {
            showPage(currentPage - 1);
        });
        
        // Initialize the carousel
        function initCarousel() {
            // Calculate slidesPerPage based on current viewport
            slidesPerPage = window.innerWidth >= 768 ? 3 : 2;
            totalPages = Math.ceil(slides.length / slidesPerPage);
            
            // Generate pagination dots
            generateDots();
            
            // Update visible slides
            showPage(0);
        }
        
        // Initialize the carousel on page load
        initCarousel();
        
        // Handle window resize
        window.addEventListener('resize', function() {
            const newSlidesPerPage = window.innerWidth >= 768 ? 3 : 2;
            const newTotalPages = Math.ceil(slides.length / newSlidesPerPage);
            
            // Only recalculate if the slides per page has changed
            if (newSlidesPerPage !== slidesPerPage || newTotalPages !== totalPages) {
                slidesPerPage = newSlidesPerPage;
                totalPages = newTotalPages;
                
                // Regenerate pagination dots
                generateDots();
                
                // Update the carousel after layout change
                showPage(0);
            }
        });
    }

    // Add event listeners for catalog tiles
    const catalogTiles = document.querySelectorAll('.catalog-tile');
    
    // Function to detect if device is touch-enabled
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }
    
    // Apply different event handlers based on device type
    if (catalogTiles.length > 0) {
        if (isTouchDevice()) {
            // For touch devices
            catalogTiles.forEach(tile => {
                // Toggle the "touched" class on touch
                tile.addEventListener('touchstart', function(e) {
                    // Prevent default behavior
                    e.preventDefault();
                    
                    // Remove class from all other tiles
                    catalogTiles.forEach(otherTile => {
                        if (otherTile !== this) {
                            otherTile.classList.remove('touched');
                        }
                    });
                    
                    // Toggle class on this tile
                    this.classList.toggle('touched');
                    
                    // Log the action
                    console.log('Touched tile:', this.querySelector('h3').textContent);
                });
                
                // Handle touch end to allow links to work if the tile contains any
                tile.addEventListener('touchend', function(e) {
                    // If this tile contains a link and was tapped, allow the link to work
                    if (e.target.tagName === 'A' || e.target.closest('a')) {
                        return true;
                    }
                });
            });
            
            // Add touch event to the document to remove the 'touched' class when touching elsewhere
            document.addEventListener('touchstart', function(e) {
                if (!e.target.closest('.catalog-tile')) {
                    catalogTiles.forEach(tile => {
                        tile.classList.remove('touched');
                    });
                }
            });
        } else {
            // For non-touch devices (desktops)
            catalogTiles.forEach(tile => {
                tile.addEventListener('mouseenter', function() {
                    console.log('Hovering over tile:', this.querySelector('h3').textContent);
                });
            });
        }
    }

    // Add event listeners for arrow bullet list items
    const arrowListItems = document.querySelectorAll('.arrow-bullet-list li');
    
    // Apply different event handlers based on device type
    if (arrowListItems.length > 0) {
        if (isTouchDevice()) {
            // For touch devices
            arrowListItems.forEach(item => {
                // Toggle the "touched" class on touch
                item.addEventListener('touchstart', function(e) {
                    // Prevent default behavior
                    e.preventDefault();
                    
                    // Remove class from all other items
                    arrowListItems.forEach(otherItem => {
                        if (otherItem !== this) {
                            otherItem.classList.remove('touched');
                        }
                    });
                    
                    // Toggle class on this item
                    this.classList.toggle('touched');
                });
            });
            
            // Add touch event to the document to remove the 'touched' class when touching elsewhere
            document.addEventListener('touchstart', function(e) {
                if (!e.target.closest('.arrow-bullet-list li')) {
                    arrowListItems.forEach(item => {
                        item.classList.remove('touched');
                    });
                }
            });
        }
    }
});
