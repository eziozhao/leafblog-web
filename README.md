# leafblog-web
## 介绍

这是一个基于springboot+vue的博客管理项目。该项目实现了基础的博客文章管理功能，同时增加了动态权限控制，可为不同用户动态配置权限。权限可控制前端菜单的显示和后台接口的请求。适合于新手用来了解如何使用springboot进行后台开发，以及用vue构建一个简单的管理系统。

[项目演示地址](http://175.24.14.253/)  账户/密码：admin/admin(管理员) testuser/testuser(普通用户)

注意！
演示站点中为防止数据库被随意修改,涉及权限管理的部分为只读权限,完整功能建议将项目拉取至本地使用

[后台项目地址](https://github.com/eziozhao/leafblog-end)

### 效果图

![home](/img/home.png)

![article](/img/articles.png)

![roles](/img/roles.png)

## 使用方式

1. `git clone https://github.com/eziozhao/leafblog-web.git`
2. 在当前目录运行`npm run dev`
3. 浏览器中访问 `http://localhost:9528/`


如果想查看完整效果，可以将后台项目也克隆到本地，详细使用见[后台项目地址](https://github.com/eziozhao/leafblog-end)

## 基本技术

### 后端
- SpringBoot
- SpringSecurity
- MyBatis
- Mysql
- Hibernator
- Docker
- JWT
- ...

### 前端
- Vue
- Vuex
- ECharts
- ElementUI
- ...

## 致谢

本项目的权限管理功能以及一些通用组件参考自[macrozheng大佬的mall项目](https://github.com/macrozheng/mall)，
前端项目模板基于[PanJiaChen大佬的vue-admin-template项目](https://github.com/PanJiaChen/vue-admin-template)。有兴趣的朋友建议详细的学习一下这两个项目，会收获很多。

