document.addEventListener('DOMContentLoaded', function() {
    setupProjectPagination();
});

function setupProjectPagination() {
    // Get all project cards
    const projectCards = document.querySelectorAll('.projects-grid .project-card');
    if (!projectCards.length) return;
    
    // Configuration
    const itemsPerPage = 15;
    const totalItems = projectCards.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Get pagination elements
    const paginationButtons = document.querySelectorAll('.pagination .pagination-btn');
    const nextButton = document.querySelector('.pagination .pagination-btn:last-child');
    
    // Initialize page state
    let currentPage = 1;
    
    // Initial display
    updateProjectDisplay();
    
    // Add event listeners to pagination buttons
    paginationButtons.forEach((button, index) => {
        // Skip the next button (last button)
        if (index === paginationButtons.length - 1) return;
        
        button.addEventListener('click', function() {
            currentPage = index + 1;
            updatePaginationButtons();
            updateProjectDisplay();
        });
    });
    
    // Add event listener to next button
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                updatePaginationButtons();
                updateProjectDisplay();
            }
        });
    }
    
    function updateProjectDisplay() {
        // Hide all project cards
        projectCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Calculate start and end index for current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        
        // Show only the cards for the current page
        for (let i = startIndex; i < endIndex; i++) {
            if (projectCards[i]) {
                projectCards[i].style.display = '';
            }
        }
        
        // Scroll to top of projects section
        const projectsSection = document.querySelector('.projects-section');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    function updatePaginationButtons() {
        // Update active state for pagination buttons
        paginationButtons.forEach((button, index) => {
            // Skip the next button
            if (index === paginationButtons.length - 1) return;
            
            if (index + 1 === currentPage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Disable/enable next button based on current page
        if (nextButton) {
            if (currentPage >= totalPages) {
                nextButton.classList.add('disabled');
                nextButton.style.opacity = '0.5';
                nextButton.style.cursor = 'not-allowed';
            } else {
                nextButton.classList.remove('disabled');
                nextButton.style.opacity = '1';
                nextButton.style.cursor = 'pointer';
            }
        }
    }
} 