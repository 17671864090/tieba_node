/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1581502180657_1232';

  // add your middleware config here
  // config.middleware = ['authLogin'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };


  config.cluster = {
    listen: {
      path: '',
      port: 9966,
      hostname: '0.0.0.0',
    }
  };


  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*']
  };

  config.cors = {
    origin:'*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };


  config.jwt = {
    secret: "143700"
  };
  return {
    ...config,
    ...userConfig,
  };
};
