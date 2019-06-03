import { Combine, Request } from '../routeDistribute';
import { HomeService } from '../service';

@Combine()
class HomeRoute {

    @Request({ url: '/', method: 'GET' })
    async homePage(ctx, next) {
        ctx.response.no_wrapper = true;
        ctx.response.body = '<h1>INDEX</h1>';
        await next();
    }

    @Request({ url: '/help', method: 'GET' })
    async helpPage(ctx, next) {
        let result = await HomeService.help();
        ctx.response.body = result;
        await next();
    }
}

export default HomeRoute;
