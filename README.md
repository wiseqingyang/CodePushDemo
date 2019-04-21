# CodePushDemo

# **尚未完成,请勿参考**

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
```Shell
code-push app add CodePushDemo-Android Android react-native
```
这里需要注意：
- 跨平台应用应单独为每个系统创建 `APP`
- 用 `-Android` `-iOS` 后缀区分不同系统
- 如果重名会导致不可预料错误

上面的命令是创建了一个 `react-native` 平台（`CodePush` 还支持其他平台）， `Android` 系统下的一个应用，如果创建 `iOS` 平台的应用自然是
```
code-push app add CodePushDemo-iOS iOS react-native
``` 

创建完 `APP` 后会自动创建两个部署 `Staging` 和 `Production`，并且打印出了各自的 `Deployment Key`:
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
## 代码中集成

`App.js` 代码中添加 `codepush`
```JavaScript
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
+ import codePush from 'react-native-code-push';
- export default class App extends Component {
- class App extends Component {
    render() {
        return (
            <View>
                <Text>Hello React Native</Text>
            </View>
        )
    }
}
+ export default codePush(App);
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
APP_RELEASE_STORE_PASSWORD = 自己的密码
APP_RELEASE_KEY_PASSWORD = 自己的密码
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
配置完成，现在在 `app` 目录下使用命令 `./gradlew assemblereleas` 生成一个初始包，这个包仅仅集成了 `CodePush` 的初始包。命令运行完后 `apk` 包在目录 `projectDir/android/app/build/outputs/apk/release` 下

## 发布更新

把 `App.js` 中文件稍作修改
```JavaScript
<Text>Hello React Native</Text>
<Text>Hello CodePush</Text>
```

发布更新 
```
code-push release-react <AppName> <Platform>
```

## api
`SyncStatusChangedCallback` 接收一个 `status` 参数的回调，具体 `status` 为

| status | desc |
| -------|----------|
| UP_TO_DATE | 已经是最新了 |
| UPDATE_INSTALLED | 更新已安装，接下来是下次启动/回到前台生效还是在 `SyncStatusChangedCallback` 函数返回后生效，取决于SyncOptions 中标明的 InstallMode |
| UPDATE_IGNORED | 非强制更新下用户选择忽略更新（仅在有 `updateDialog` 的情况下生效） |
| UNKNOWN_ERROR | 未知错误 |
| SYNC_IN_PROGRESS | 有正在运行中的操作阻塞当前操作 |
| CHECKING_FOR_UPDATE | 检查更新中 |
| AWAITING_USER_ACTION | 等待用户确认操作中（仅在有 `updateDialog` 的情况下生效） |
| DOWNLOADING_PACKAGE | 可用更新下载中 |
| INSTALLING_UPDATE | 更新安装中 |

## code-push release-react
`release-react` 命令做了两件事
1. 运行 `react-native bundle` 命令把需要更新的代码和资源打包，这个步骤尽量使用一些默认的配置参数，当然也可以灵活的自定义参数
2. 从当前项目中的 `Info.plist` 或 `build.gradle` 文件中读取版本号 `targetBinaryVersion`

### 命令参数
- App name
- Platform
    - `ios` `android` 或 `windows` 大小写不敏感，此参数只会影响打包方式。
- Deployment name
  - 这个参数可以用"--deploymentName" 或 "-d"来设置。
- Description
  - 这个参数可以用"--description" 或 "--des"来设置。
- Mandatory
- No duplicate release error
- Rollout
  - 如果未标识，则对所有用户生效
- Target binary version
  - 如果未标识，默认取 `Info.plist` 或 `build.gradle` 中的版本
- Bundle name
  - 如果未标识，默认为 `main.jsbundle` (iOS) `index.android.bundle` (Android) `index.windows.bundle` (Windows) 
  - 既可以用 `--bundleName` 也可以用 `-b` 表示
- Development
  - 是否生成未压缩，开发版的 `js bundle`，默认为 `false`
  - 既可以用 `--development` 也可以用 `-dev` 表示
- Disable
- Entry File
  - 既可以用 `--entryFile` 也可以用 `-e` 表示
- Gradle file（仅 Android）
  - 指定 `build,gradle` 文件的相对位置，一般来说命令会自动从标准 `React-Native` 项目中寻找，如果你的项目不标准才需要这个参数，这样就不用显式指定版本号了
  - 因为 `build.gradle` 是个必须的文件名，所以相对路径中可以加也可以不加文件名。
- Plist file 
  - 既可以用 `--plistFile` 也可以用 `-p` 表示
- Private key path
- Plist file prefix 
  - 如果不同环境下右不同的plist文件前缀，使用此参数
  - 既可以用 `--plistFilePrefix` 也可以用 `-pre` 表示
- Sourcemap output
  -  `js bundle` 文件的 `sourcemap` 文件生成相对路径，如果未标明则不生成
  -  既可以用 `--sourcemapOutput` 也可以用 `-s` 表示
-  Output directory
   -  `jsbundle sourcemap assets` 文件相对路径 如果未标明默认为 `/tmp/CodePush`
   -  目标路径下的所有文件将会被清空
-   既可以用 `--outputDir ` 也可以用 `-o` 表示

[官方文档](https://github.com/Microsoft/code-push/blob/master/cli/README-cn.md#rollout-%E5%8F%82%E6%95%B0)