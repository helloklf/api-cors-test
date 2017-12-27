# api-cors-test
通过简单的方式测试API是否可以再某个域名下跨域访问，需要Node.js

### 1.通过config.js配置接口信息，格式如下
``` javascript
module.exports = {
    //默认的origin地址（用于检测是否跨域），在api中单独配置assert.server字段时，则优先使用assert.server
    "server": "http://test.www.phone580.com:8000/baidu.cc",
    //显示正确信息（默认true）
    "info": true,
    //显示错误信息
    "error": true,
    //接口列表
    "apis": [
        {
            //接口地址
            "api": "https://pay.phone580.com/p3/admin/wxcashier/api",
            //断言（不需要判断的项可不写）
            "assert": {
                //请求方式，如果有多个值，则使用["GET","POST"]这种格式，默认值为GET
                "method": "POST",
                //允许的origin地址（用于检测是否跨域）
                "server": "https://pay.phone580.com/wechat/",
                //允许传入的header
                //"headers": ["Content-Type"],
                //是否允许传入cookie
                //"cookie": true,
                //判断内容格式
                //"contentType": "application/json;charset=utf-8"
            },
            //接口名称
            "title": "微信收银"
        }
    ]
}
```

### 2.运行测试代码

``` shell
npm install
node run.js
```
