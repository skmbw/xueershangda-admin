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
