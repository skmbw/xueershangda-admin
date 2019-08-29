<p align="center">
  <a href="https://ng-alain.com">
    <img width="100" src="https://ng-alain.com/assets/img/logo-color.svg">
  </a>
</p>

<h1 align="center">NG-ALAIN</h1>

<div align="center">
  Out-of-box UI solution for enterprise applications, Let developers focus on business.

  [![Build Status](https://img.shields.io/travis/ng-alain/ng-alain/master.svg?style=flat-square)](https://travis-ci.org/ng-alain/ng-alain)
  [![Dependency Status](https://david-dm.org/ng-alain/ng-alain/status.svg?style=flat-square)](https://david-dm.org/ng-alain/ng-alain)
  [![GitHub Release Date](https://img.shields.io/github/release-date/ng-alain/ng-alain.svg?style=flat-square)](https://github.com/ng-alain/ng-alain/releases)
  [![NPM version](https://img.shields.io/npm/v/ng-alain.svg?style=flat-square)](https://www.npmjs.com/package/ng-alain)
  [![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
  [![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/ng-alain/ng-alain/blob/master/LICENSE)
  [![Gitter](https://img.shields.io/gitter/room/ng-alain/ng-alain.svg?style=flat-square)](https://gitter.im/ng-alain/ng-alain)
  [![ng-zorro-vscode](https://img.shields.io/badge/ng--zorro-VSCODE-brightgreen.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=cipchk.ng-zorro-vscode)
  [![ng-alain-vscode](https://img.shields.io/badge/ng--alain-VSCODE-brightgreen.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=cipchk.ng-alain-vscode)

</div>

English | [简体中文](README-zh_CN.md)

## Quickstart

- [Getting Started](https://ng-alain.com/docs/getting-started)

## Links

+ [Document](https://ng-alain.com)
+ [DEMO](https://ng-alain.github.io/ng-alain/)

## Features

+ `ng-zorro-antd` based
+ Responsive Layout
+ I18n
+ [@delon](https://github.com/ng-alain/delon)
+ Lazy load Assets
+ UI Router States
+ Customize Theme
+ Less preprocessor
+ Well organized & commented code
+ Simple upgrade
+ Support Docker deploy

## Architecture

![Architecture](https://raw.githubusercontent.com/ng-alain/delon/master/_screenshot/architecture.png)

> [delon](https://github.com/ng-alain/delon) is a production-ready solution for admin business components packages, Built on the design principles developed by Ant Design.

## App Shots

![desktop](https://raw.githubusercontent.com/ng-alain/delon/master/_screenshot/desktop.png)
![ipad](https://raw.githubusercontent.com/ng-alain/delon/master/_screenshot/ipad.png)
![iphone](https://raw.githubusercontent.com/ng-alain/delon/master/_screenshot/iphone.png)

## Donation

ng-alain is an MIT-licensed open source project. In order to achieve better and sustainable development of the project, we expect to gain more backers. You can support us in any of the following ways:

- [patreon](https://www.patreon.com/cipchk)
- [opencollective](https://opencollective.com/ng-alain)
- [paypal](https://www.paypal.me/cipchk)
- [支付宝或微信](https://ng-alain.com/assets/donate.png)

Or purchasing our [business theme](https://e.ng-alain.com/).

## Backers

Thank you to all our backers! 🙏

<a href="https://opencollective.com/ng-alain#backers" target="_blank"><img src="https://opencollective.com/ng-alain/backers.svg?width=890"></a>

### License

The MIT License (see the [LICENSE](https://github.com/ng-alain/ng-alain/blob/master/LICENSE) file for the full text)

### 新增模块以及菜单
* 使用命令新增module
* 在routes-routing.module.ts中配置新增module的路由，否则找不到路径404错误
* 在app-data.json中，添加菜单数据，当然如果这个数据是来自后台，那么就在后台添加
* 在app-data.json中使用到了i18n的数据和icon的数据。i18n的数据在tmp/i18n/下的文件中添加对应的i18n数据
* app-data.json数据还有i18n的数据在 StartupService中使用。本来应该从后台获取的，这是demo就从本地获取了。
* icon的图标使用插件的方式添加，运行 ng g ng-alain:plugin icon. 这个插件只从html和ts文件中寻找，如果是在json中使用了，要在style-icon.ts中自己引入
* icon可以在[iconfont](https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.d9df05512&cid=9402)中寻找
* icon图标，带outline后缀的，不需要写-outlone，Fill后缀的写-fill，TwoTone后缀的写-twotone


### 创建模块和业务组件
* ng g ng-alain:module trade，创建trade模块
* ng g ng-alain:edit edit -m=video，创建video模块的edit组件，edit目录在video目录下，edit模块的文件在edit目录下
* ng g ng-alain:curd curd -m=trade，在trade/curd目录下，一次性创建list、view、edit模块，好像不能直接在trade目录下直接创建3个组件

### protobufjs的使用
* pbjs -t static-module -w commonjs -o bundled.js file1.proto file2.proto
将多个proto文件生成一个js文件
* pbjs -t static-module -w commonjs -o bundled.js account_detail.proto answer.proto content.proto follow.proto platform_detail.proto score_detail.proto user.proto account.proto article.proto dialogue.proto orders.proto images.proto score.proto answer_file.proto comment.proto favorite.proto platform_account.proto question.proto tags.proto equipment.proto characters.proto virtual_items.proto category.proto video.proto payment.proto
* pbts -o bundled.d.ts bundled.js
将生成的bundled.js 生成typescript的文件bundled.d.ts

### ng-alain的一些问题
* 如果类中注入了Modal，那么由Modal模式改为连接跳转，及时路由配置正确，也会报错。所以要去掉modal的注入
* 如果使用modal的方式打开，那么因为没有$(document).ready事件，uploader初始化时会找不到对应的browse_button的id，so无法浏览文件
* 新引入的第三方js或者jquery或者jquery插件，需要重启，新引入，需要重启动，否则无法检测到插件 https://blog.csdn.net/yhc0322/article/details/78796009
* modal模式，this.undefined就是穿过来的参数，但是table.js._btnClick中的bug，没有设置或取到参数名导致。可以使用click的方式避免
* angular中没有$(document).ready(function(){});的等价物，使用这种方法。window.onload = (() => {})这个好像也不对
