module.exports = app =>{
    const { router, controller } = app;
    const gzip = app.middleware.authLogin();
    router.post('/api/admin/v1/signIn', controller.admin.user.signIn);//管理登录
    router.get('/api/admin/v1/img', controller.admin.user.img);//上传图片
    router.post('/api/admin/v1/Release',gzip, controller.admin.user.release);
    router.post('/api/admin/v1/userinfo',gzip, controller.admin.user.userinfo);//获取用户基本信息
    router.get('/api/admin/v1/topics', controller.admin.user.topics);//获取文字列表
    router.get('/api/admin/v1/topicsitem/:id', controller.admin.user.topicsitem);//获取文字列表
    router.get('/api/admin/v1/buy', controller.admin.user.buy);//获取用户基本信息
    router.post('/api/admin/v1/buyPost', controller.admin.user.BuyPost);//获取用户基本信息
    router.post('/api/admin/v1/MemberBuy', controller.admin.user.MemberBuy);//贴吧入群系统
    router.post('/api/admin/v1/MemberBuyPost', controller.admin.user.MemberBuyPost);//贴吧回调
    router.post('/api/admin/v1/Userinformation' ,gzip, controller.admin.user.Userinformation);//贴吧回调

    router.get('/api/admin/v1/Advertisingspace', controller.admin.user.Advertisingspace);


    router.get('/api/admin/v1/Classification', controller.admin.user.classification);
}
