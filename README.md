# koa-instant-theme

A fontend theme pack packed with static css/js files through koa-static.

## Example usage

`app.js`
```
import Koa from "koa";
import instantTheme from "koa-instant-theme";
import index from "./controllers/index";
const app = new Koa();
app.use(route.get("/", index));
app.use(instantTheme.serve);
app.listen(3000);
```

`./controllers/index`
```
import path from "path";
import views from "co-views";
import instantTheme from "koa-instant-theme";

const render = views(path.resolve(__dirname, "../views"), {
    map: { html: "ejs" },
});

export default async function index(ctx) {
    const body = await render("index");
    ctx.body = instantTheme.header+body+instantTheme.footer;
}
```

`./view/index`
```
<script>
PopUpManager.show_message('test','test title');
</script>
```