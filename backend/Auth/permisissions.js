export const permissions = {
    BUY_PROUCTS: 'products:buy',
    SELL_PROUCTS: 'products:sell',
    TICKETS_MANAGE: 'tickets:manage',
    USERS_MANAGE: 'users:manage',
};

export const rolePermissions = {
    SimpleUser:[
        permissions.BUY_PROUCTS
    ],
    SellerUser:[
        permissions.BUY_PROUCTS,
        permissions.SELL_PROUCTS
    ],
    Support:[
        permissions.BUY_PROUCTS,
        permissions.TICKETS_MANAGE
    ],
    Admin:[
        permissions.BUY_PROUCTS,
        permissions.SELL_PROUCTS,
        permissions.TICKETS_MANAGE,
        permissions.USERS_MANAGE
    ]
};