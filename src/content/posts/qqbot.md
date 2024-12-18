---
title: 基于NapCat+NoneBot2（OneBot v11）的QQBot搭建教程
description: 教授了如何搭建一个QQBot，使用NapCat和NoneBot2
date: 2024-12-09
tags: ["QQBot"]
---

# 引言

### QQBot是如何运行的？
1. 首先，我们通过NapCat登录BotQQ，这样NapCat就能接管消息的收发，并且它会放出标准的OneBot v11 API，在后续供NoneBot2使用。我们使用NapCat作为协议端，创建一个WebSocket服务器，用于接收和发送消息。
2. 然后我们去部署NoneBot2，添加OneBot v11适配器，后续NapCat就可以通过WebSocket连接到NoneBot2，这样NoneBot2就会放出标准的NoneBot2 API，此后我们就可以编写Python代码来控制NoneBot2进行消息的收发，而无需直接使用原生的OneBot v11 API。

### NapCat是什么？为什么选择NapCat？（2024下半年）
1. NapCat是基于QQNT作为开发的，它对接QQNT，并放出了标准的OneBot v11 API，并且还有一些其他扩展 API 。使得我们可以直接调用OneBot v11 API来控制消息的收发。至于更多信息，请前往[NapCat的GitHub仓库](https://github.com/NapNeko/NapCatQQ)查看。
2. 为什么不选择其他的OneBot v11协议实现，比如[Lagrange](https://github.com/LagrangeDev/Lagrange.Core)？博主本人曾在2024年上半年一直使用Lagrange，但是它在现今已经变得不再稳定，所以我们建议使用NapCat来作为您的QQBot协议端。

### 为什么选择NoneBot2？而不是直接使用原生的OneBot v11 API？
这要从多个方面来考虑，首先NoneBot2并不只专注于QQBot，它还支持很多其他协议，比如Telegram、Discord、Slack等，如果您有多平台开发需求则非常适合。哪怕您仅专注于QQBot，使用NoneBot2也比直接调用原生的OneBot v11 API更为省心，虽然它限制了您只能使用Python进行开发，但是它集成了很多功能，比如统一的插件管理系统，计时器系统等等。我们不妨想一下，如果您直接使用原生的OneBot v11 API，那么您需要自己制作一个插件管理系统，一个计时器系统，一个事件监听系统，一个数据存储系统，一个日志系统，一个错误处理系统，一个权限管理系统和很多很多其他系统，这无疑会大大增加您的开发成本，而NoneBot2则把这些功能都集成到了框架中，您只需要专注于业务逻辑的开发即可。

# 部署

### 部署NapCat
> 可以前往[NapCat的GitHub仓库](https://github.com/NapNeko/NapCatQQ)了解更多。这里仅针对Windows+无头启动方式做教程讲解。
1. 下载适用于Windows的无头启动NapCat的压缩包， `NapCat.Shell.zip`：https://github.com/NapNeko/NapCatQQ/releases。
2. 解压到一个独立的文件夹，在文件夹内打开cmd。
3. 输入 `launcher.bat <BotQQ号>`。如：`launcher.bat 1234567890`。
4. 之后cmd内会弹出一个二维码，使用手机QQ扫码登录即可。
5. 登录成功后，在cmd最开始输出的几条日志找到类似 `[NapCat] [WebUi] WebUi Local Panel Url: http://127.0.0.1:6099/webui?token=0h4m4o9dqkp` 的日志，将链接到浏览器打开即可看到NapCat的WebUI。
6. 创建一个WebSocket连接（客户端），地址为： `ws://localhost:9090/onebot/v11/ws` 。这就是NoneBot2默认的WebSocket服务器的地址，端口为9090，我们在后续部署NoneBot2的时候也要使用一样的端口。

### 部署NoneBot2
1. 安装Python，Windows推荐使用[Scoop](https://scoop.sh/)：
    ```shell
    scoop install python
    ```
2. 安装pipx：
    ```shell
    scoop install python
    ```