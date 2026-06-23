import { db } from '../db/db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';
import { rolePermissions } from './permisissions.js';



export function isAuth(req, res, next){
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader) return res.status(401).json({message: 'Токен не предоставлен'});
    
        const token = authHeader.split(' ')[1];     
        const decoded = jwt.verify(token, JWT_SECRET);
        db.get(`select SimpleUser.Login, SimpleUser.Mail, SimpleUser.StatusOnTheSite from SimpleUser where SimpleUser.id = ?;`, [decoded.id] , (err, user) => {
            if(!user) return res.status(404).json('Пользователь не найден');
            req.user = user;
            
            next();
        });
    }catch(err){
        return res.status(401).json({message: 'Неверный токен'});
    }
}

export function checkPermissions(reqPermissions){
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({message: 'Без авторизации'});

        const userPermissions = rolePermissions[req.user.StatusOnTheSite] || [];
        if (!userPermissions.includes(reqPermissions)) {
            return res.status(403).json({message: 'Недостаточно прав'});
        }
        next();
    };
}