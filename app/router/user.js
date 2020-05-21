
module.exports = app => {
    const {router, controller} = app;

    const gzip = app.middleware.authLogin();

    router.get('/api/v1/admin/Postobtain',gzip, controller.v1.users.Postobtain);

    router.get('/api/v1/admin/Userdata',gzip, controller.v1.users.Userdata);


    router.get('/api/v1/admin/Orderdata',gzip, controller.v1.users.Orederdata);

    router.get('/api/v1/admin/logo',app.jsonp(), controller.v1.users.logo);

    router.get('/api/v1/admin/Log',gzip, controller.v1.users.Log);

    router.post('/api/v1/admin/Withdrawalmoney',app.jsonp(), controller.v1.users.Withdrawalmoney);

    router.get('/api/v1/admin/GetWithdrawalmoney',gzip, controller.v1.users.GetWithdrawalmoney);

    router.post('/api/v1/admin/adoptmoneyApi',gzip, controller.v1.users.adoptmoneyApi);

    router.post('/api/v1/admin/adminLogin', controller.v1.users.adminLogin);



    router.get('/api/v1/admin/schedule', controller.v1.users.schedule);



}
