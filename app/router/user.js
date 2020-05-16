
module.exports = app => {
    const {router, controller} = app;

    router.get('/api/v1/admin/Postobtain', controller.v1.users.Postobtain);

    router.get('/api/v1/admin/Userdata', controller.v1.users.Userdata);


    router.get('/api/v1/admin/Orderdata', controller.v1.users.Orederdata);

    router.get('/api/v1/admin/logo',app.jsonp(), controller.v1.users.logo);

    router.get('/api/v1/admin/Log', controller.v1.users.Log);

    router.post('/api/v1/admin/Withdrawalmoney',app.jsonp(), controller.v1.users.Withdrawalmoney);

    router.get('/api/v1/admin/GetWithdrawalmoney', controller.v1.users.GetWithdrawalmoney);

    router.post('/api/v1/admin/adoptmoneyApi', controller.v1.users.adoptmoneyApi);

}
