/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;



  //帖子
  router.get('/topics', controller.topic.index);
  router.get('/topics/:id', controller.topic.show);

  // router.post('/topics', topic.put);





  //物料精选{相似推荐,猜你喜欢}
  router.get('/user/Optimus/:material_id/:min_ids', controller.home.Optimus);
  router.get('/user/TpwdCreate', controller.home.TpwdCreate);
  router.get('/api/user/itemoptional/:q/:page_no', controller.home.itemoptional);
  require('./router/user')(app);
  require('./router/index')(app);
};





