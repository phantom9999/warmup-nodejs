# 简介
nodejs服务的预热组件.
在nodejs服务启动之前预热代码, 减少nodejs代码编译对用户请求的影响.
nodejs服务正常启动时, nodejs只会编译入口文件执行到的代码, 并不会编译未执行的代码.
像基于express/koa的web服务在服务启动时, 路由部分代码并不会运行到. 
当用户请求到来时, nodejs才编译路由的代码, 造成较大耗时, 影响用户体验.
这个组件用来解决这个问题.



# 使用方法

使用下面命令安装这个组件:

```
npm install warmup-nodejs
```
或者
```
yarn add warmup-nodejs
```


## 概念介绍
本组件的预热请求支持get/post两种方法, 其中post支持表单和json两种方式.
预热请求任务包括三个参数, 分别是请求类型, 请求的路径, 数据.
当请求类型为get时, get请求的参数添加的请求的路径中.
当请求类型为post表单时, data字段是对应的表单数据.
当请求类型为post json数据时, data字段是对应json文件的路径.



## 基于对象的方法
假设服务的路由信息如下:
- /get 支持get请求
- /post 支持post 表单请求
- /json 支持post json请求

实例代码如下:

```typescript
import {Warmup, Task, METHOD} from "warmup-nodejs";
import express from "express";

const app = express();
const warmup = new Warmup(app, __dirname);
warmup.run([
    new Task(METHOD.GET, "/get?a=b"),
    new Task(METHOD.POST, "/post", {a: "b"}),
    new Task(METHOD.JSON, "/json", "data/a.json5")
]).then(value => {
    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });
}).catch(err => {
      console.log(err);
      process.exit(1);
  });
```




## 基于配置文件的方法
假设服务的路由信息如下:
- /get 支持get请求
- /post 支持post 表单请求
- /json 支持post json请求



配置文件(conf/tasks.json5)内容如下:
```json
{
  "taskList": [
    {
      "path": "/get?get=data",
      "method": "get"
    }, {
      "path": "/post",
      "method": "post",
      "data": {
        "post": "form"
      }
    }, {
      "path": "/json",
      "method": "json",
      "data": "data/demo.json"
    }
  ]
}
```

代码如下:

```typescript
import express from "express";
import {WarmupProcess} from "warmup-nodejs";


const app = express();

const warmup = new WarmupProcess(__dirname);
warmup.run(app, "conf/tasks.json5").then(value => {
    console.log('success');
    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });
}).catch(err => {
    console.log(err);
});

```




