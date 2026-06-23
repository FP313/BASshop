

document.addEventListener("DOMContentLoaded", () => {
    getCards(2);
});

let SavePos = 0;

export async function getCards(count) {
    try {
        const token = localStorage.getItem("Token");
        const res = await fetch('http://localhost:3000/api/card', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const Cards = await res.json();
        const container = document.querySelector('.items');
        
        for (let i = 0; i < count; i++, SavePos++) {
            const productData = Cards[SavePos];
            const cardElement = createCard(productData);
            container.appendChild(cardElement);

            if((SavePos+1) > Cards.length-1) {SavePos = -1;}

        }
        
    } catch (error) {
        alert("Проблема с получением карточек!");
    }
}



export function createCard(product) {
    const aLink = document.createElement('a');
    aLink.href = `Offer.html?id=${product.id}`;
    aLink.classList.add('item');

    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        let starType = 'voidStar.png';
        if (product.AverageRating >= i) {
            starType = 'fullStar.png';
        } else if (product.AverageRating >= i - 0.5) {
            starType = 'halfStar.png';
        }
        starsHtml += `<img src="../img/reviews/${starType}" class="estimationImg" alt="star">`;
    }

    let searchTags = "";
    if (product.AdditionalInfo) {
        Object.entries(product.AdditionalInfo).forEach(([key, value]) => {
            searchTags += `${key} ${value} `;
        });
    }
    
    searchTags += ` ${product.seller}`;
    searchTags = searchTags.toLowerCase();

    
    aLink.dataset.id = product.id;
    aLink.dataset.title = product.Title;
    aLink.dataset.price = String(product.Price).replace(/\D/g, '') || '0';
    aLink.dataset.date = product.Date || '';
    aLink.dataset.rating = product.Rating || 0;
    aLink.dataset.sales = product.salesMonth || 0;
    aLink.dataset.app = product.app || '';
    aLink.dataset.native = String(product.isNative || false);
    aLink.dataset.searchTags = searchTags;

    aLink.innerHTML = `
        <img src="${product.IconUrl}" class="itemImg" alt="${product.Title}">
        <div class="itemText">
            <div class="itemHead">
                <h3 class="Title">${product.Title}</h3>
                <h3 class="Price">${product.Price}</h3>
            </div>
            <div class="description">${product.Description}</div>
            <div class="itemFooter">
                <div class="addicationInformation">Seller: ${product.Login}</div>
                <div class="estimation">
                    <div class="estimationText">Srzsnash star: </div>
                    ${starsHtml}
                </div>
            </div>
        </div>
    `;

    return aLink;
}
