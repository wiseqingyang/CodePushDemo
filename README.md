# CodePushDemo

比较完整的研究一下微软的 [codePush](https://github.com/Microsoft/react-native-code-push)；

开发环境 `windows + android`， `React Native` ：0.58

## TODO

- 更新选项 codepushOptions
- 发布更新命令 code-push release-react
- 不同部署切换
- Staging 部署推送到 Production 部署

# 开始前的准备

## 初始化项目
首先初始化一个项目
```
react-native init CodePushDemo
cd CodePushDemo
```
`react-native-code-push` 是一个 `RN` 插件，同时也提供一个命令行工具 `code-push`，所以依次安装
```
npm install -g code-push-cli
npm install --save react-native-code-push
react-native link react-native-code-push
```
这样就会得到一个 `code-push` 命令，用来配置热更新包相关的信息。

记得运行 `react-native run-android` 保证初试项目没有问题。

`link` 的时候会让填 `Deployment Key`，如果没有的话可以选择跳过，后期可以在 `iOS` 的 `info.plist` 或 `android` 的 `strings.xml` 文件中添加

## 初始化 `CodePush` 服务

`CodePush` 服务的数据全都在云端，所以需要一个账号，使用 `code-push login` 登录账号，这时会跳出一个网页，登录后复制 `token` 到命令行即可登录

如果不知道自己登录了没，可以用 `code-push whoami` 检查自己是否登录。 

### 创建应用
如果是第一次使用 `codepush` 需要创建一个应用，否则跳过此步骤

登录后创建一个应用 
格式为
```
code-push app add <appName> <os> <platform>
```
例：
```Shell
code-push app add CodePushDemo-Android Android react-native
```
这里需要注意：
- 跨平台应用应单独为每个系统创建 `APP`
- 用 `-Android` `-iOS` 后缀区分不同系统
- 如果重名会导致不可预料错误

上面的命令是创建了一个 `react-native` 平台（`CodePush` 还支持其他平台） `Android` 系统下的一个应用，如果创建 `iOS` 平台的应用自然是
```
code-push app add CodePushDemo-iOS iOS react-native
``` 

创建完 `APP` 后会自动创建两个部署 `Staging` 和 `Production`，并且打印出了各自的 `Deployment Key`:

> 部署：是 `Deployment` 直译过来的，是一个名词，可以理解为环境。比如 `Staging` 测试部署（测试环境）、`Prodiction` 生产部署（生产环境）

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
这个 `Deployment Key` 是要写在 `app` 的配置文件或者代码中的，用来标识 某个应用的某个部署，后面再讲这个 `Key` 的用法

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

### 签名
一个 release 版本的 android 包一般都需要签名，所以先生成一个签名，这里也可以用其他方式生成签名
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
### 添加 Deployment Key
打开 `strings.xml` 添加或确认自己的 `Deployment Key` 填写正确
```XML
<string moduleConfig="true" name="reactNativeCodePush_androidDeploymentKey">这里填写deploymentkey</string>
```

如果不知道自己的 `Deployment Key` 可以用下面命令查看
```
code-push deployment ls <appName> -k
```
### 生成离线包
配置完成，现在在 `app` 目录下使用命令 `./gradlew assemblerelease` 生成一个初始包，这个包仅仅集成了 `CodePush` 的初始包。命令运行完后 `apk` 包在目录 `projectDir/android/app/build/outputs/apk/release` 下

## 发布更新

把 `App.js` 中文件稍作修改
```JavaScript
<Text>Hello React Native</Text>
<Text>Hello CodePush</Text>
```

发布更新 
```
code-push release-react <AppName> <os>
```
然后重启 App 后就会发现新添加的更新（android 下需要完全杀掉app后重启才能看到）。

# 自定义更新

上面直接用的 `codepush(App)` 包装了根组件，如果想要更多选项， `codePush` 选项可以接受一个 `codePushOptions` 参数自定义更新。

## 检查更新方式
`codePushOptions` 的 `checkFrequency` 字段是控制更新检查方式的

| CheckFrequency | 说明 |
| ----------|-- |
| ON_APP_START | app启动时 |
| ON_APP_RESUME | app回到前台时 |
| MANUAL | 手动检查 |

例子：

修改代码
```JavaScript
import React, {Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import CodePush from "react-native-code-push";

let codepushOptions = {checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME}

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to react-native-code-push!</Text>
        <Text style={styles.instructions}>如果有更新 回到前台后更新</Text>
      </View>
    );
  }
}

export default CodePush(codepushOptions)(App)
 
```

运行命令 
```
code-push release-react <appName> <os>
```

> 注意这次更新还是默认的更新方式，即需要完全退出 app 后重启生效，更新到当前版本后的下次更新才是刚才更改的每次回到前台检查更新

重启生效后，再修改一些东西，然后在发布更新。此时**回到前台后查询更新生效**。

更多选项待编辑

