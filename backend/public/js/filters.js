
import { createCard } from "./genereticCards.js";

const HSearch = document.querySelector('.HSearch');
if (HSearch) {
    HSearch.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase().trim();
        const DOMcards = document.querySelectorAll('.item');

        DOMcards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const isMatch = cardText.includes(query);
            card.classList.toggle('hiden', !isMatch); 
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector('.items');
    if (!container) return;

    Cards.forEach(product => {
        const cardNode = createCard(product);
        container.appendChild(cardNode);
    });

    function applyFiltersAndSort() {
        const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
        const minPrice = parseFloat(document.getElementById('priceMin').value) || 0;
        const maxPrice = parseFloat(document.getElementById('priceMax').value) || Infinity;
        const selectedApp = document.getElementById('filterApp').value;
        const isNativeOnly = document.getElementById('filterNative').checked;
        const sortBy = document.getElementById('sortBy').value;
        
        const cardElements = Array.from(container.querySelectorAll('.item'));
        
        cardElements.forEach(card => {
            const id = (card.dataset.id || "").toLowerCase();
            const title = (card.dataset.title || "").toLowerCase();
            const price = parseFloat(card.dataset.price) || 0;
            const app = card.dataset.app;
            const isNative = card.dataset.native === 'true';
            const searchTags = (card.dataset.searchTags || "").toLowerCase(); 
            
            const matchSearch = title.includes(searchQuery) || 
                                id.includes(searchQuery) || 
                                searchTags.includes(searchQuery);

            const matchPrice = price >= minPrice && price <= maxPrice;
            const matchApp = selectedApp === 'all' || app === selectedApp;
            const matchNative = !isNativeOnly || isNative;

            if (matchSearch && matchPrice && matchApp && matchNative) {
                card.classList.remove('hiden');
            } else {
                card.classList.add('hiden');
            }
        });

        if (sortBy !== 'default') {
            cardElements.sort((a, b) => {
                if (sortBy === 'priceAsc') return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                if (sortBy === 'priceDesc') return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                if (sortBy === 'ratingDesc') return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                if (sortBy === 'salesDesc') return parseInt(b.dataset.sales) - parseInt(a.dataset.sales);
                if (sortBy === 'dateDesc') return new Date(a.dataset.date || 0) - new Date(b.dataset.date || 0);
                return 0;
            });
            let noResultsMessage = container.querySelector('.noResults');
            const visibleCards = container.querySelectorAll('.item:not(.hiden)');
            if(visibleCards.length === 0) {
                noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'noResults';
                noResultsMessage.textContent = 'Ничего не найдено 🔍';
                container.appendChild(noResultsMessage);
            };
            cardElements.forEach(card => container.appendChild(card));
        }
    }


    document.querySelectorAll('.filterPanel input, .filterPanel select').forEach(element => {
        element.addEventListener('input', applyFiltersAndSort);
        element.addEventListener('change', applyFiltersAndSort); 
    });
});