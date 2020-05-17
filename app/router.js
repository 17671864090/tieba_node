/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  //物料精选{相似推荐,猜你喜欢}
  router.get('/user/Optimus/:material_id/:min_ids', controller.home.Optimus);
  // router.get('/user/ItemInfo/:num_iids', controller.home.ItemInfo);



  router.get('/user/TpwdCreate', controller.home.TpwdCreate);


  router.get('/api/user/itemoptional/:q/:page_no', controller.home.itemoptional);


  require('./router/user')(app);
  require('./router/index')(app);
};





