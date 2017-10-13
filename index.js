const path=require("path");
const serve=require("koa-static");

module.exports.serve=serve(path.join(__dirname, "./public"));
module.exports.loaders=`
<link rel="stylesheet" href="koa-instant-theme/assets/bootstrap/css/bootstrap.min.css" />
<link type="text/css" rel="stylesheet" href="koa-instant-theme/assets/css/main.css" />
<link type="text/css" rel="stylesheet" href="koa-instant-theme/assets/components/library/jquery-ui/css/jquery-ui.min.css" />
<link type="text/css" rel="stylesheet" href="koa-instant-theme/assets/jquery-ui-1.10.4/css/bootstrap/jquery-ui-1.10.3.custom.css" />
<link type="text/css" rel="stylesheet" href="koa-instant-theme/assets/jquery-ui-1.10.4/css/bootstrap/jquery-ui-1.10.3.theme.css" />
<link type="text/css" rel="stylesheet" href="koa-instant-theme/assets/jquery-ui-1.10.4/css/bootstrap/biz_patch.css" />
<link type="text/css" rel="stylesheet" href="koa-instant-theme/assets/components/icons/icons.css" />
<link type="text/css" rel="stylesheet" href="koa-instant-theme/assets/css/all.css" />
<link type="text/css" rel="stylesheet" href="koa-instant-theme/assets/css/print.css" media="print" />

<script type="text/javascript" src="koa-instant-theme/assets/jquery-ui-1.10.4/js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="koa-instant-theme/assets/jquery-ui-1.10.4/js/jquery-migrate-1.2.1.js"></script>
<script type="text/javascript" src="koa-instant-theme/assets/jquery-ui-1.10.4/js/jquery-ui-1.10.4.min.js"></script>
<script type="text/javascript" src="koa-instant-theme/assets/bootstrap/js/bootstrap.min.js?v=v1.0.3-rc2&sv=v0.0.1.1"></script>
<script type="text/javascript" src="koa-instant-theme/assets/SystemManager.js"></script>
<script type="text/javascript" src="koa-instant-theme/assets/PopUpManager.js"></script>
<script type="text/javascript" src="koa-instant-theme/assets/all.js"></script>
`;
module.exports.header=`
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
        ${module.exports.loaders}
    </head>
    <body>
        <div class="container-fluid" style="padding: 0px; visibility: visible;">
            <div id="content">
                <div class="innerLR">
`;
module.exports.footer=`
                </div>
            </div>
        </div>
    </body>
</html>
`;
