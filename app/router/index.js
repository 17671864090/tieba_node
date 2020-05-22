module.exports = app =>{
    const { router, controller } = app;
    const gzip = app.middleware.authLogin();

    router.post('/api/admin/v1/login', controller.admin.user.login);//管理登录
    router.post('/api/admin/v1/register', controller.admin.user.register);//管理登
    router.get('/api/admin/v1/img', controller.admin.user.img);//上传图片
    router.post('/api/admin/v1/Release',gzip, controller.admin.user.release);
    router.post('/api/admin/v1/userinfo',gzip, controller.admin.user.userinfo);//获取用户基本信息
    router.get('/api/admin/v1/topics', controller.admin.user.topics);//获取文字列表
    router.get('/api/admin/v1/Topicssearch', controller.admin.user.Topicssearch);//获取文字列表
    router.get('/api/admin/v1/UserArticle', controller.admin.user.UserArticle);//个人中心 获取帖子
    router.get('/api/admin/v1/UserCustomer', controller.admin.user.UserCustomer);//个人中心 获取下级
    router.get('/api/admin/v1/Topicssearch', controller.admin.user.Topicssearch);//获取文字列表

    router.post('/api/admin/v1/undatetopics', controller.admin.user.undatetopics);//获取文字列表


    router.get('/api/admin/v1/topicsitem/:id', controller.admin.user.topicsitem);//获取文字列表
    router.get('/api/admin/v1/buy', controller.admin.user.buy);//获取用户基本信息
    router.post('/api/admin/v1/buyPost', controller.admin.user.BuyPost);//获取用户基本信息
    router.post('/api/admin/v1/MemberBuy', controller.admin.user.MemberBuy);//贴吧入群系统
    router.post('/api/admin/v1/MemberBuyPost', controller.admin.user.MemberBuyPost);//贴吧回调
    router.post('/api/admin/v1/Userinformation' ,gzip, controller.admin.user.Userinformation);//贴吧回调

    router.get('/api/admin/v1/Advertisingspace', controller.admin.user.Advertisingspace);


    router.get('/api/admin/v1/Classification', controller.admin.user.classification);
}
