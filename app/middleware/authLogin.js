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
                // let token = ctx.headers.authorization;
                // let data = ctx.app.jwt.verify(token,ctx.app.config.jwt.secret)
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
    };
}