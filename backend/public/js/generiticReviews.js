
document.addEventListener("DOMContentLoaded", () => {
    getReviews(10);
});

let SavePos = 0;

export async function getReviews(count) {
    try {
        const res = await fetch('http://localhost:3000/api/reviews', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const Reviews = await res.json();

        const reviewsContainer = document.querySelector('.itemsReviews');


        for (let i = 0; i < count; i++, SavePos++) {
            const reviewElement = createReviewCard(Reviews[SavePos]);
            reviewsContainer.appendChild(reviewElement);
            if((SavePos+1) > Reviews.length-1) {SavePos = -1;}
            
        }
        
    } catch (error) {
        alert("Проблема с получением отзывов!");
    }
}


function createReviewCard(review) {
    const divCard = document.createElement('div');
    divCard.classList.add('itemReviews');

    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        let starType = 'voidStar.png';
        if (review.RatingProducts >= i) {
            starType = 'fullStar.png';
        } else if (review.RatingProducts >= i - 0.5) {
            starType = 'halfStar.png';
        }
        starsHtml += `<img src="../img/reviews/${starType}" class="estimationImg">`;
    }

    divCard.innerHTML = `
        <div class="itemHeadreviews">
            <h3 class="DateBuying">${review.Date}</h3>
            <h3 class="PriceBuying">${review.Price}</h3>
        </div>
        <div class="descriptionReviews">${review.Description}</div>
        <div class="itemReviwesMore">Больше</div>
        <div class="itemFooterReviews">
            <div class="addicationInformation">Покупатель: ${review.LoginNotSeller}</div>
            <div class="estimation">
                <div class="estimationText">Srzsnash star: </div>
                <div class="starsContainer">
                    ${starsHtml}
                </div>
            </div>
        </div>
    `;

    return divCard;
}
