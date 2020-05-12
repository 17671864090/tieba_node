const Service = require('egg').Service;
class UserService extends Service {
    /**
     * 根据用户名查找用户业务操作
     * @param  {string} userName 用户名
     * @return {object|null}     查找结果
     */
    async userLogin(data) {
        const result = await this.app.mysql.insert('tbk_user', data);
        console.log(result)
    }
}

module.exports = UserService;



