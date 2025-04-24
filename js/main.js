document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            const nav = document.querySelector('.main-nav');
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Range sliders for filters
    setupRangeSliders();

    // Gallery image thumbnails
    setupGalleryThumbs();

    // View toggle in catalog pages
    setupViewToggle();

    // Search bar functionality
    setupSearch();

    // Filter sidebar toggle for mobile
    setupFilterToggle();
});

function setupRangeSliders() {
    // TRL Range
    const trlMin = document.getElementById('trl-range-min');
    const trlMax = document.getElementById('trl-range-max');
    const trlMinValue = document.getElementById('trl-min');
    const trlMaxValue = document.getElementById('trl-max');

    if (trlMin && trlMax) {
        trlMin.addEventListener('input', function() {
            const val = parseInt(this.value);
            if (val >= parseInt(trlMax.value)) {
                this.value = parseInt(trlMax.value) - 1;
            }
            trlMinValue.textContent = `TRL ${this.value}`;
        });

        trlMax.addEventListener('input', function() {
            const val = parseInt(this.value);
            if (val <= parseInt(trlMin.value)) {
                this.value = parseInt(trlMin.value) + 1;
            }
            trlMaxValue.textContent = `TRL ${this.value}`;
        });
    }

    // Amount Range
    const amountMin = document.getElementById('amount-range-min');
    const amountMax = document.getElementById('amount-range-max');
    const amountMinValue = document.getElementById('amount-min');
    const amountMaxValue = document.getElementById('amount-max');

    if (amountMin && amountMax) {
        const amounts = ['0 UZS', 'до 1 млн UZS', 'до 5 млн UZS', 'до 10 млн UZS', 'до 25 млн UZS', 'до 50 млн UZS', '50+ млн UZS'];
        
        amountMin.addEventListener('input', function() {
            const val = parseInt(this.value);
            if (val >= parseInt(amountMax.value)) {
                this.value = parseInt(amountMax.value) - 1;
            }
            amountMinValue.textContent = amounts[this.value];
        });

        amountMax.addEventListener('input', function() {
            const val = parseInt(this.value);
            if (val <= parseInt(amountMin.value)) {
                this.value = parseInt(amountMin.value) + 1;
            }
            amountMaxValue.textContent = amounts[this.value];
        });
    }

    // Reward Range
    const rewardMin = document.getElementById('reward-range-min');
    const rewardMax = document.getElementById('reward-range-max');
    const rewardMinValue = document.getElementById('reward-min');
    const rewardMaxValue = document.getElementById('reward-max');

    if (rewardMin && rewardMax) {
        const rewards = ['0 UZS', 'до 1 млн UZS', 'до 3 млн UZS', 'до 5 млн UZS', 'до 10 млн UZS', 'до 30 млн UZS', '30+ млн UZS'];
        
        rewardMin.addEventListener('input', function() {
            const val = parseInt(this.value);
            if (val >= parseInt(rewardMax.value)) {
                this.value = parseInt(rewardMax.value) - 1;
            }
            rewardMinValue.textContent = rewards[this.value];
        });

        rewardMax.addEventListener('input', function() {
            const val = parseInt(this.value);
            if (val <= parseInt(rewardMin.value)) {
                this.value = parseInt(rewardMin.value) + 1;
            }
            rewardMaxValue.textContent = rewards[this.value];
        });
    }
}

function setupGalleryThumbs() {
    const thumbs = document.querySelectorAll('.gallery-thumbs .thumb');
    const mainImage = document.querySelector('.main-image');
    
    if (thumbs.length && mainImage) {
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Update main image
                mainImage.src = this.src;
                
                // Update active thumb
                thumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

function setupViewToggle() {
    const viewToggleButtons = document.querySelectorAll('.view-toggle .btn-icon');
    const projectsGrid = document.querySelector('.projects-grid');
    const challengesGrid = document.querySelector('.challenges-grid');
    
    if (viewToggleButtons.length && (projectsGrid || challengesGrid)) {
        viewToggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                viewToggleButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Toggle grid/list view
                if (this.querySelector('.fa-list')) {
                    if (projectsGrid) projectsGrid.classList.add('list-view');
                    if (challengesGrid) challengesGrid.classList.add('list-view');
                } else {
                    if (projectsGrid) projectsGrid.classList.remove('list-view');
                    if (challengesGrid) challengesGrid.classList.remove('list-view');
                }
            });
        });
    }
}

function setupSearch() {
    const searchInput = document.querySelector('.search-bar .form-input');
    const searchButton = document.querySelector('.search-bar .btn-icon');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
}

function performSearch(query) {
    // In a real implementation, this would send a request to the server
    // For the prototype, we'll just log the search query
    console.log('Searching for:', query);
    
    // For demonstration, highlight cards that match the query
    const cards = document.querySelectorAll('.project-card, .challenge-card');
    const searchQuery = query.toLowerCase();
    
    cards.forEach(card => {
        const title = card.querySelector('.project-title, .challenge-title').textContent.toLowerCase();
        const desc = card.querySelector('.project-desc, .challenge-desc').textContent.toLowerCase();
        
        if (title.includes(searchQuery) || desc.includes(searchQuery)) {
            card.style.boxShadow = '0 0 0 2px var(--color-primary)';
        } else {
            card.style.boxShadow = '';
        }
    });
}

function setupFilterToggle() {
    // For mobile view, add a toggle button for filters
    const filterSidebar = document.querySelector('.filter-sidebar');
    
    if (filterSidebar && window.innerWidth <= 768) {
        const filterToggleBtn = document.createElement('button');
        filterToggleBtn.className = 'btn btn-outline filter-toggle-btn';
        filterToggleBtn.innerHTML = 'Показать фильтры <i class="fas fa-filter"></i>';
        
        const catalogContent = document.querySelector('.catalog-content');
        if (catalogContent) {
            catalogContent.parentNode.insertBefore(filterToggleBtn, catalogContent);
            
            filterToggleBtn.addEventListener('click', function() {
                filterSidebar.classList.toggle('active');
                this.innerHTML = filterSidebar.classList.contains('active') 
                    ? 'Скрыть фильтры <i class="fas fa-times"></i>' 
                    : 'Показать фильтры <i class="fas fa-filter"></i>';
            });
        }
    }
}

// For the challenge-details.html page - response form handling
function setupResponseForm() {
    const responseForm = document.getElementById('challenge-response-form');
    
    if (responseForm) {
        responseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const submitButton = responseForm.querySelector('[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';
            
            // Simulate API call delay
            setTimeout(() => {
                // Show success message
                const formContainer = responseForm.parentNode;
                formContainer.innerHTML = `
                    <div class="response-success">
                        <i class="fas fa-check-circle"></i>
                        <h3>Ваш отклик успешно отправлен!</h3>
                        <p>Представители компании свяжутся с вами в ближайшее время для обсуждения деталей.</p>
                    </div>
                `;
            }, 1500);
        });
    }
}

// Call this function for challenge details page
if (window.location.pathname.includes('challenge-details.html')) {
    document.addEventListener('DOMContentLoaded', setupResponseForm);
} 