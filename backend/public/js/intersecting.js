import { getCards } from "../js/genereticCards.js"
// import { getReviews } from "../js/generiticReviews.js"

const moreCatalog = document.querySelector(".moreCatalog");
const moreReviwes = document.querySelector(".reviewsTextmore");

moreCatalog.addEventListener("click", ()=>{viewMore(10)});
moreReviwes.addEventListener("click", ()=>{viewMore(10)});

function viewMore(count){
    getCards(count);
    // getReviews(count);
}