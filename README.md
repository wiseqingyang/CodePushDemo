# CodePushDemo

<h1 style="color:red">尚未完成,请勿参考</h1>

比较完整的研究一下微软的 [codePush](https://github.com/Microsoft/react-native-code-push)；

从网上找的例子比较碎，官网文档全是英文的，但是我英语又不好，恰好是周末，决定花一个周末拿这个练手，我的开发环境是 `windows + android`， `React Native` 是最新的 0.58 版本。

# 开始前的准备

## 初始化项目
首先初试化一个项目
```
react-native init CodePushDemo
cd CodePushDemo
```
`react-native-code-push` 是一个 `RN` 插件，同时也提供一个命令行工具 `code-push`，所以依次安装
```
npm install -g code-push-cli
npm install --save react-native-code-push
```
这样就会得到一个 `code-push` 命令，用来配置热更新包相关的信息。

记得运行 `react-native run-android` 保证初试项目没有问题。

## 初始化 `CodePush` 服务

`CodePush` 服务的数据全都在云端，所以需要一个账号，使用 `code-push login` 登录账号，这时会跳出一个网页，登录后复制 `token` 到命令行即可登录

如果不知道自己登录了没，可以用 `code-push whoami` 检查自己是否登录。 

登录后创建一个 `App` 
```
code-push app add CodePushDemo-Android Android react-native
```
这里需要注意：
- 跨平台应用应单独为每个系统创建 `APP`
- 用 `-Android` `-iOS` 后缀区分不同系统
- 如果重名会导致不可预料错误

上面的命令是创建了一个 `react-antive` 平台(`CodePush` 还支持), `Android` 系统下的一个应用，如果创建 `iOS` 平台的应用自然是
```
code-push app add CodePushDemo-iOS iOS react-native
``` 

创建完 `APP` 后会自动创建两个部署 `Staging` 和 `Production`，并且打印出了个字的 `Deployment Key`:
```
Successfully added the "CodePushDemo-Android" app, along with the following default deployments:
┌────────────┬────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                             │
├────────────┼────────────────────────────────────────────────────────────┤
│ Production │ 9e_xm_7OBpaSk09XP60regFGxUNZ4644c03a-2db1-43a6-9378-adbc42 │
├────────────┼────────────────────────────────────────────────────────────┤
│ Staging    │ QNHp6_7GRRKJiZZZr1jNu9UpivV54644c03a-2db1-43a6-9378-adbc42 │
└────────────┴────────────────────────────────────────────────────────────┘
```

## 准备一个原始包

一个 release 版本的 android 包一般都需要签名，所以先生成一个签名
```
keytool -genkey -v -keystore codepushdemo.keystore -alias codepushdemo -keyalg RSA -keysize 2048 -validity 10000
```
把签名放在 `android/app` 下，在 `android/gradle.properties` 文件中添加签名的配置
```
APP_RELEASE_STORE_FILE = codepushdemo.keystore
APP_RELEASE_KEY_ALIAS = codepushdemo
APP_RELEASE_STORE_PASSWORD = ***** // 自己的密码
APP_RELEASE_KEY_PASSWORD = ***** // 自己的密码
```
在 `android/app/build.gradle` 中调用配置
```
...
signingConfigs {
    release {
        storeFile file(APP_RELEASE_STORE_FILE)
        storePassword APP_RELEASE_STORE_PASSWORD
        keyAlias APP_RELEASE_KEY_ALIAS
        keyPassword APP_RELEASE_KEY_PASSWORD
    }
}
...
buildTypes {
    release {
        ...
        signingConfig signingConfigs.release
    }
}
```
配置完成，现在在 `app` 目录下使用命令 `./gradlew assemblereleast` 生成一个初始包，这个包仅仅集成了 `CodePush` 的初始包。