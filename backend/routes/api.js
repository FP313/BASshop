import { Router } from "express";

import {getimgFilter, getCards, getOffer, getReviews, getOfferId, createOffer, createCard, createReview, createReviewSupport, AbsDelete, registration, login} from "../controllers/getController.js";
import { checkPermissions, isAuth } from "../Auth/Middleware.js";
import { permissions } from '../Auth/permisissions.js';

export const ApiR = Router({});

ApiR.get("/", (req, res)=>{
    const data = {
        message: "Api is working",
    };
    res.json(data);
});

ApiR.post(`/registration`, registration);
ApiR.post(`/login`, login);


ApiR.get(`/offer/create/:CardId/:Warranty/:Availability/:AdditionalInfo`, createOffer);
ApiR.get(`/card/create/:Title/:Price/:Description`, createCard);
ApiR.get(`/review/create/:Description/:RatingProducts`, createReview);
ApiR.get(`/reviewSupport/create/:Description/:RatingSupport`, createReviewSupport);

ApiR.get(`/offer/delete/:id`, AbsDelete("Offer"));
ApiR.get(`/card/delete/:id`, AbsDelete("Card"));
ApiR.get(`/review/delete/:id`, AbsDelete("Review"));
ApiR.get(`/reviewSupport/delete/:id`, AbsDelete("ReviewSupport"));


ApiR.get("/card/", [isAuth, checkPermissions(permissions.BUY_PROUCTS)],getCards);
ApiR.get("/offer/", [isAuth, checkPermissions(permissions.BUY_PROUCTS)],getOffer);
ApiR.get("/reviews/", [isAuth, checkPermissions(permissions.BUY_PROUCTS)],getReviews);
ApiR.get(`/imgFilter/`, [isAuth, checkPermissions(permissions.BUY_PROUCTS)],getimgFilter);


ApiR.get("/offer/:id", getOfferId);

