//打印请求数据
const request = async (ctx, next) => {
    const { url, method, body, query } = ctx.request;
    console.log(
        `---in--->  URL: ${url}  METHOD: ${method} BODY: ${JSON.stringify(body)} QUERY: ${JSON.stringify(query)}`
    )
    await next();
}

//打印响应数据
const response = async (ctx, next) => {
    console.log(
        `---out--->  ${JSON.stringify(ctx.response.body)}`
    );
    await next();
}

export default {
    request,
    response
}