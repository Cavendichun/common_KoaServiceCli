//将响应体包装成code data
const wrapResult = async (ctx, next) => {
    //404状态，或者response中手动指定了no_wrapper，不进行包装
    if (ctx.status != 404 && ctx.response.no_wrapper != true) {
        const res = {
            code: 200,  //成功code统一200
            data: ctx.response.body
        }
        ctx.response.status = 200;
        ctx.response.body = res;
    }
    await next();
}

export default wrapResult;
