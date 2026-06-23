
import { JWT_SECRET } from '../Auth/config.js';
import  jwt  from 'jsonwebtoken';
import { db } from '../db/db.js';


export const getimgFilter = async (req, res)=>{
    db.all('select * from imgFilter;', [], (err, row) => {
        if(err) return res.status(500).json({error:err.message});
        if(!row) return res.status(404).json('фильтры не найдены');
        res.json(row);
    });

};


export const getCards = async (req, res)=>{
    db.all('select Card.id, Card.Url, Card.IconUrl, Card.Title, Card.Price, Card.Description, SellerUser.AverageRating, SimpleUser.Login, Card.SellerUserId from Card inner join SellerUser on Card.SellerUserId = SellerUser.id inner join SimpleUser on SellerUser.SimpleUserId = SimpleUser.id;', [], (err, row) => {
        if(err) return res.status(500).json({error:err.message});
        if(!row) return res.status(404).json('Карточки не найдены');
        res.json(row);
    });

};


export const getOffer = async (req, res)=>{
    db.get('select Card.id, Card.Url, Card.IconUrl, Card.Title, Card.Price, Card.Description, Offer.PublishDate, Offer.Warranty, Offer.Availability, Offer.BuyLink, Offer.SellerLink, Offer.AdditionalInfo from Card inner join Offer on Card.id = Offer.CardId where Card.id = \'1\';', [], (err, row) => {
        if(err) return res.status(500).json({error:err.message});
        if(!row) return res.status(404).json('Предложение не найдено');
        res.json(row);
    });
};

export const getReviews = async (req, res)=>{
    db.all('select SimpleUser.id, SimpleUser.Login as LoginNotSeller, Review.Date, Review.Price, Review.Description, Review.RatingProducts from SimpleUser inner join Review on Review.SimpleUserId = SimpleUser.id;', [], (err, row) => {
        if(err) return res.status(500).json({error:err.message});
        if(!row) return res.status(404).json('Отзывы не найдены');
        res.json(row);
    });
};

export const getOfferId = async (req, res) => {
    const productId = req.params.id;
    db.get(`select Card.id, Card.Url, Card.IconUrl, Card.Title, Card.Price, Card.Description, Offer.PublishDate, Offer.Warranty, Offer.Availability, Offer.BuyLink, Offer.SellerLink, Offer.AdditionalInfo from Card inner join Offer on Card.id = Offer.CardId where Card.id = \'${productId}\';`, [], (err, row) => {
        if(err) return res.status(500).json({error:err.message});
        if(!row) return res.status(404).json('Оффер не найдены');
        res.json(row);
    });
};

export const createOffer = async (req, res) => {
    let now = new global.Date();
    const { CardId, Warranty, Availability, AdditionalInfo} = req.params;

    try{
        db.run(`insert into Offer(CardId, PublishDate, Warranty, Availability, BuyLink, SellerLink, AdditionalInfo) values (?, ?, ?, ?, ?, ?, ?);`, [CardId, now.getDate() + '.' + (now.getMonth() + 1) + '.' + now.getFullYear(), Warranty, Availability, '', '', AdditionalInfo]);
    
    }catch(err){console.error(err);}
};


export const createCard = async (req, res) => {
    const { Title, Price, Description } = req.params;
    try{
        db.run(`insert into Card(Url, IconUrl, Title, Price, Description, SellerUserId) values (?, ?, ?, ?, ?, ?)`, ['tmp', 'icontmp', Title, Price, Description, '1']);    
    }catch(err){console.error(err);}
};

export const createReview = async (req, res) => {
    let now = new global.Date();
    const { Description, RatingProducts } = req.params;
    try{
        db.run(`insert into Review(Date, Price, Description, RatingProducts, SellerId, SimpleUserId) values (?, ?, ?, ?, ?, ?)`, [now.getDate() + '.' + (now.getMonth() + 1) + '.' + now.getFullYear(), 324, Description, RatingProducts, 1, 1]);    
    }catch(err){console.error(err);}
};

export const createReviewSupport = async (req, res) => {
    let now = new global.Date();
    const { Description, RatingSupport, } = req.params;
    try{
        db.run(`insert into ReviewSupport(Date, Description, RatingSupport, SupportId, SimpleUserId, TicketId) values (?, ?, ?, ?, ?, ?)`, [now.getDate() + '.' + (now.getMonth() + 1) + '.' + now.getFullYear(), Description, RatingSupport, 1, 1, 1]);    
    }catch(err){console.error(err);}
};

export const AbsDelete = (nameTable) => {
    return async (req, res) => {
        const { id } = req.params;
        try{
            db.run(`delete from ${nameTable} where id = ${id};`);    
        }catch(err){console.error(err);}
    }
};


export const registration = async (req, res) => {
    let now = new global.Date();
    const { login, pass, mail, phone} = req.body;
    try{
        db.run(`insert into SimpleUser(Login, Mail, Password, DateOfRegistration, Balance, FavoritesOfferId, HistoryBuy, HistoryBalance, StatusOnTheSite) values (?, ?, ?, ?, ?, ?, ?, ?, ?);`, [login, mail, pass, now.getDate() + '.' + (now.getMonth() + 1) + '.' + now.getFullYear(), 0, null, '', '', 'SimpleUser'],(err, user)=>{
            if(phone != null){
                db.get(`select * from SimpleUser where Login = ?;`, [login], (err, user)=>{
                if(user === undefined)
                    return res.status(404).json({message: 'Пользователь не найден'});

                db.run(`insert into SellerUser(SimpleUserId, HistorySell, OffersId, Number, AverageRating) values(?, ?, ?, ?, ?);`, [user.id, '', null, phone, null]);
            });
            }

            
        });    
        res.json({message: "Пользователь зарегестрирован"});
    }catch(err){console.error(err);}
};

export const login = async (req, res) => {
    const { login, pass} = req.body;;
    try{
        db.get(`select * from SimpleUser where Login = ?;`, [login], (err, user)=>{
            if(user === undefined)
                return res.status(404).json({message: 'Пользователь не найден'});
            
            
            if(pass == user.Password){
                
                const tokens = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '24h'});
                
                const ReturnDataUser = {
                Login: user.Login,
                Mail: user.Mail,
                DateOfRegistration: user.DateOfRegistration,
                Balance: user.Balance,
                FavoritesOfferId: user.FavoritesOfferId,
                HistoryBuy: user.HistoryBuy,
                HistoryBalance: user.HistoryBalance,
                StatusOnTheSite: user.StatusOnTheSite,
                success: true,
                token: tokens
                }
                
                return res.json(ReturnDataUser)};
            return res.status(404).json({message: 'Неверный логин или пароль'});
        });
    }catch(err){console.error(err);}
};
