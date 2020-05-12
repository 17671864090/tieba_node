module.exports = app =>{
    const { router, controller } = app;
    router.get('/user/ItemInfo/:num_iids', controller.home.ItemInfo);
    router.post('/api/v1/signIn', controller.v1.users.signIn);
    router.get('/api/v1/tbk_user', controller.v1.users.tbk_users);
    router.get('/api/v1/tbk_user/order/:relationId/:tk_status', controller.v1.users.tbk_OrderUser); //订单查询
    router.get('/api/v1/tbk_user/information/:id', controller.v1.users.userfind); //订单查询
}

