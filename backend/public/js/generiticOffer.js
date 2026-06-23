
document.addEventListener("DOMContentLoaded", () => {
    DataByUrlId();
});

async function DataByUrlId() {
    const urlParamId = new URLSearchParams(window.location.search).get('id');
    
    if(!urlParamId) {
        document.querySelector('.offer').innerHTML = `<div>ERROR</div>`;
        return;
    };
    try{

        const token = localStorage.getItem("Token");
        const res = await fetch(`http://localhost:3000/api/offer/${urlParamId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok){
            document.querySelector('.offer').innerHTML = `<div>Такого элемента нет</div>`;
            return;
        }
        let dataEl = await res.json();
        updateElOffer(dataEl);
    }catch(er){console.log("ERROR");}
};
async function getHtmlOffer(offerItem) {
    return `
            <div class="imgInfoDiv">
                <img src="${offerItem.ImageUrl}" alt="Упс ошибка загрузки" class="offerImg">
                <div class="OfferAdduicationInformation">
                    <div> дата выставления объявления : ${offerItem.PublishDate} </div>
                    <div> Гарантия от продавца : ${offerItem.Warranty} </div>
                    <div> наличие товара : ${offerItem.Availability} </div>
                </div>
            </div>
            <div class="OfferitemText">
                <div class="OfferitemHead">
                    <h3 class="OfferTitle">${offerItem.Title}</h3>
                    <h3 class="OfferPrice">${offerItem.Price}</h3>
                </div>
                <div class="Offerdescription">${offerItem.Description}</div>
                <div class="OfferMore">Больше</div>
                <div class="Offerbutton">
                    <a href="${offerItem.BuyLink}" class="Buy" data-event-id ="../pages/offer.html?id=8"> Купить</a>
                    <a href="${offerItem.SellerLink}" class="WriteSeller" data-event-id ="../pages/offer.html?id=9">Написать продавцу</a>
                </div>
            </div>
        `;
}

async function updateElOffer(el) {
    const offerContainer = document.querySelector('.offer');
    offerContainer.innerHTML = await getHtmlOffer(el);
    
    renderAdditionalInfo(offerContainer, offerItem);
}


async function getOffer() {
    try {
        const token = localStorage.getItem("Token");
        const res = await fetch('http://localhost:3000/api/offer', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const offer = await res.json();
        
        const offerContainer = document.querySelector('.offer'); 
        let offersHtml = ''; 
        const offerItem = offer[0];
        offersHtml += await getHtmlOffer(offerItem);
        offerContainer.innerHTML = offersHtml;
        renderAdditionalInfo(offerContainer, offerItem);
        
    } catch (error) {
        alert("Проблема с получением предложения!");
    }
}






function renderAdditionalInfo(cardElement, cardData) {
    const infoContainer = document.querySelector('.addicationOfferItem');

    if (!infoContainer || !cardData.additionalInfo) infoContainer.classList.add('hiden');

    infoContainer.innerHTML = '';

    const infoEntries = Object.entries(cardData.additionalInfo);

    infoEntries.forEach(([key, value]) => {
        const infoRow = document.createElement('div');
        infoRow.classList.add('infoRow');

        infoRow.innerHTML = `
            <div class="infoKey">${key}:</div>
            <div class="infoValue">${value}</div>
        `;
        infoContainer.appendChild(infoRow);
    });
}