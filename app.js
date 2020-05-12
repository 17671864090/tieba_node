class AppBootHook {
    constructor(app) {
        this.app = app;
    }
    async didReady() {
        // 应用已经启动完毕
    }
}
module.exports = AppBootHook;
