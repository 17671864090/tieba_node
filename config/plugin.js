'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
    cors: {
        enable: true,
        package: 'egg-cors',
    },
    mysql:{
        enable: true,
        package: 'egg-mysql',
    },
    passport : {
        enable: true,
        package: 'egg-passport',
    },
    jwt: {
        enable: true,
        package: "egg-jwt"
    },

    alinode:{
        enable: true,
        package: 'egg-alinode'
    }

};