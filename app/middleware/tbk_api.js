const ApiClient = require('../middleware/nodejs/index').ApiClient;

var client = new ApiClient({
    'appkey':'28305940',
    'appsecret':'9a99941ae4d14ca7578a8cc7a03bac05',
    'REST_URL':'http://api.daily.taobao.net/router/rest'
});


class api{
    index(apiname,params) {
        return new Promise(function(resolve,reject){
            client.execute(apiname, params, function (error,response) {
                // if(err){
                //     reject(err)
                // }else {
                console.log(error)

                resolve(response)

                // }

                })
        })
    }
}
module.exports = new api();