module.exports = app => {
    const {router, controller} = app;

    router.get('/api/v1/admin/Postobtain', controller.v1.users.Postobtain);

    router.get('/api/v1/admin/Userdata', controller.v1.users.Userdata);


    router.get('/api/v1/admin/Orderdata', controller.v1.users.Orederdata);

    router.get('/api/v1/admin/logo',app.jsonp(), controller.v1.users.logo);

}
