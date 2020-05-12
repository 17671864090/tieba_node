/**
 * 登录拦截
 * @param options
 * @param app
 * @returns {userInterceptor}
 */
module.exports = (options, app) => {
    return async function userInterceptor(ctx, next) {


        if(ctx.request.headers.authorization){
            try {
                const data = ctx.app.jwt.verify(ctx.request.headers.authorization, 143700)
                if(!data.username){
                    ctx.body = {
                        status: 502,
                        message: '请登录后操作'
                    }
                    return
                }else{
                    await next();
                }
            } catch (e) {
                console.log(e)
                ctx.body = {
                    status: 501,
                    message: '账号状态信息过期,请重新登录'
                }
                return
            }
        }else{
            ctx.body = {
                status: 502,
                message: '请登录后操作'
            }
            return
        }

        // //验证token是否为空
        // if (token){
        //     let result = verifyToken(token) //解密token
        //     let {_id} = result //检查是否有用户_id
        //     //验证客户端token是否合法
        //     if (_id) {
        //         let redis_token = await app.redis.get(username) // 获取redis中的token
        //         //验证是否为最新的token
        //         if (token === redis_token) {
        //             await next();
        //         }else{
        //             // 如果不是最新token，则代表用户在另一个机器上进行操作，需要用户重新登录保存最新token
        //             ctx.body = {
        //                 status: 1,
        //                 message: '您的账号已在其他机器保持登录，如果继续将清除其他机器的登录状态'
        //             }
        //         }
        //     }else{
        //         // 如果token不合法，则代表客户端token已经过期或者不合法（伪造token）
        //         ctx.body = {
        //             status: 1,
        //             message: '您的登录状态已过期，请重新登录'
        //         }
        //     }
        // }else{
        //     // 如果token为空，则代表客户没有登录
        //     ctx.body = {
        //         status: 1,
        //         message: '您还没有登录，请登陆后再进行操作'
        //     }
        // }
    };
}