[![appcenterbanner](https://user-images.githubusercontent.com/31293287/32969262-3cc5d48a-cb99-11e7-91bf-fa57c67a371c.png)](http://microsoft.github.io/code-push/)

# React Native CodePush 模块

*Note: 本文只适用于最近版本. 如果你在使用较老版本, 请切换相应 [GitHub仓库](https://github.com/Microsoft/react-native-code-push) 标签查看特定版本的文档*

![Switching tags](https://cloud.githubusercontent.com/assets/8598682/17350832/ce0dec40-58de-11e6-9c8c-906bb114c34f.png)

本模块提供 [CodePush 服务](https://microsoft.github.io/code-push/) 的客户端的集成, 可以让你轻松的在 React Native 应用中体验动态更新效果.

<!-- React Native Catalog -->

- [React Native CodePush 模块](#react-native-codepush-%E6%A8%A1%E5%9D%97)
  - [工作原理](#%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86)
  - [支持平台](#%E6%94%AF%E6%8C%81%E5%B9%B3%E5%8F%B0)
    - [支持组件](#%E6%94%AF%E6%8C%81%E7%BB%84%E4%BB%B6)
  - [入门](#%E5%85%A5%E9%97%A8)
  - [组件使用](#%E7%BB%84%E4%BB%B6%E4%BD%BF%E7%94%A8)
    - [应用商店指南](#%E5%BA%94%E7%94%A8%E5%95%86%E5%BA%97%E6%8C%87%E5%8D%97)
  - [发布更新](#%E5%8F%91%E5%B8%83%E6%9B%B4%E6%96%B0)
    - [多部署测试](#%E5%A4%9A%E9%83%A8%E7%BD%B2%E6%B5%8B%E8%AF%95)
    - [动态分配部署](#%E5%8A%A8%E6%80%81%E5%88%86%E9%85%8D%E9%83%A8%E7%BD%B2)
  - [API 参考](#api-%E5%8F%82%E8%80%83)
    - [Example Apps / Starters](#example-apps--starters)
    - [调试/故障排除](#%E8%B0%83%E8%AF%95%E6%95%85%E9%9A%9C%E6%8E%92%E9%99%A4)
    - [持续集成/交付](#%E6%8C%81%E7%BB%AD%E9%9B%86%E6%88%90%E4%BA%A4%E4%BB%98)
    - [TypeScript Consumption](#typescript-consumption)

<!-- React Native Catalog -->

## 工作原理

一个 `React Native` 应用由 `JavaScript` 文件和若干[图片资源](https://facebook.github.io/react-native/docs/images.html#content)组成，这些文件被打包成特定平台二进制文件（比如 `.ipa` 包和 `.apk`包）的一部分。一旦 `App` 发布了，再想更新 `JavaScript` 文件或者图片资源就不得不重新编译打包整个二进制文件，而且必须重新向应用市场重新提交审核。

通过把代码和资源发布到 `CodePush` 服务上进行同步更新，`CodePush` 组件能实现直接在用户端更新应用。这样，你的app既能享受离线应用的好处，还能像网页般一旦可用即时更新，简直是双赢。

为了保证最终用户一直使用功能正常的 app 版本，CodePush 组件保留了一份以前版本的备份，如果你不小心推送了包含崩溃代码的更新，CodePush 可以自动回滚。这样你可以放心你新发布的版本不会在[回滚](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/cli#rolling-back-updates)之前导致用户被卡住，一举三得。

*注意：任何原生代码的修改（`OC` `Java` 代码更改，添加新插件）不能通过 CodePush 发布，必须t通过应用商店进行更新*

## 支持平台

- iOS (7+)
- Android (4.1+)
- Windows (UWP)

虽然我们尽最大努力保证组件的向后兼容性，但是由于平台特性和版本之间的巨大差异，如果你在使用特定版本的 React Native ，你最好使用对应版本的 CodePush 插件，下表是 CodePush 版本和 React Native 版本对应表：

| React Native 版本 | 支持的 CodePush 版本                        |
|-------------------------|-------------------------------------------------------|
| <0.14                   | **不支持**                                       |
| v0.14                   | v1.3 *(introduced Android support)*                   |
| v0.15-v0.18             | v1.4-v1.6 *(introduced iOS asset support)*            |
| v0.19-v0.28             | v1.7-v1.17 *(introduced Android asset support)*       |
| v0.29-v0.30             | v1.13-v1.17 *(RN refactored native hosting code)*     |
| v0.31-v0.33             | v1.14.6-v1.17 *(RN refactored native hosting code)*   |
| v0.34-v0.35             | v1.15-v1.17 *(RN refactored native hosting code)*     |
| v0.36-v0.39             | v1.16-v1.17 *(RN refactored resume handler)*          |
| v0.40-v0.42             | v1.17 *(RN refactored iOS header files)*              |
| v0.43-v0.44             | v2.0+ *(RN refactored uimanager dependencies)*        |
| v0.45                   | v3.0+ *(RN refactored instance manager code)*         |
| v0.46                   | v4.0+ *(RN refactored js bundle loader code)*         |
| v0.46-v0.53             | v5.1+ *(RN removed unused registration of JS modules)*|
| v0.54-v0.55             | v5.3+ *(Android Gradle Plugin 3.x integration)*       |
| v0.56-v0.57             | v5.4+ *(RN upgraded versions for Android tools)*      |

虽然我们一直努力跟进 React Native 更新，但是偶尔也会被打断。我们将会根据每一个 React Native 版本持续更新本表，以便用户可以查看我们官方支持内容。

### 支持组件

当使用 React Native 的资源系统（即使用 `require("./foo.png")`）的时候，下表列出了可以通过 CodePush 更新所使用图片资源的核心组件：

| Component                                       | Prop(s)                                  |
|-------------------------------------------------|------------------------------------------|
| `Image`                                         | `source`   |
| `MapView.Marker` <br />*(Requires [react-native-maps](https://github.com/lelandrichardson/react-native-maps) `>=O.3.2`)* | `image`                             |
| `ProgressViewIOS`                               | `progressImage`, `trackImage`            |
| `TabBarIOS.Item`                                | `icon`, `selectedIcon`                   |
| `ToolbarAndroid` <br />*(React Native 0.21.0+)* | `actions[].icon`, `logo`, `overflowIcon` |

下表列出了由于依赖静态文件（比如使用 `{ uri: "foo"}`） CodePush 暂时不支持更新资源的组件：

| Component   | Prop(s)                                                              |
|-------------|----------------------------------------------------------------------|
| `SliderIOS` | `maximumTrackImage`, `minimumTrackImage`, `thumbImage`, `trackImage` |
| `Video`     | `source`                                                             |
一旦有新的使用资源的新组件发布，我们将更新本表以保证用户能够知道是否可以通过 CodePush 更新资源。

## 入门

如果你按照通用的[入门](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/index)说明设置了你的 CodePush 账号，你可以在你的 app 根目录使用一下命令使你的应用 CodePush 化：

```shell
npm install --save react-native-code-push
```
和其他 React Native 组件一样，iOS 和 Android 的接入方法不一样，所以以下操作取决于你的平台。注意，建议分别创建 CodePush 应用如果你两个平台都需要的话。

如果想参考其他项目怎么继承 CodePush ，可以 Checkout 社区提供的很好的[例子](#example-apps--starters)。另外，如果想快速个性化 CodePush 和 React Native，可以观看 [Bilal Budhani](https://www.youtube.com/watch?v=uN0FRWk-YW8&feature=youtu.be) 和 [Deepak Sisodiya ](https://www.youtube.com/watch?v=f6I9y7V-Ibk) 的入门视频，这两个都很棒.

*注意：本教程假定你已经使用 `react-native init` 命令初始化了 React Native 项目，2017年3月以后，`create-react-native-app` 命令也可以用于初始化 React Native 项目。如果使用此命令，请在项目的根目录中运行 `npm run eject`，以获得与 `react-native init` 项目相似的项目。*

接下来继续安装原生组件
  * [iOS 指引](docs/setup-ios.md)
  * [Android 指引](docs/setup-android.md)
  * [Windows 指引](docs/setup-windows.md)


## 组件使用

CodePush 组件下载和链接完成后，除了从 CodePush 请求下载何时的 JS 包，剩下的只有在必要的地方控制下面两种情况：

1. 什么时候（多久一次）检查更新？（比如 app 启动，设置页面点击按钮响应，某个固定间隔定期）
2. 当有更新时，如何展现给最终用户？

最简单的方法是 CodePush 化你的 app 根组件。你从下面两个选项中选择：

* **选项一：使用 `codePush` 高阶组件包装根组件：**

    ```javascript
    import codePush from "react-native-code-push";

    class MyApp extends Component {
    }

    MyApp = codePush(MyApp);
    ```

* **选项2：使用[ ES7 装饰器](https://github.com/wycats/javascript-decorators)语法：**
    *注意：Babel 6.x 待定提案更新尚不支持装饰器。您可能需要通过安装和使用 [babel-preset-react-native-stage-0](https://github.com/skevy/babel-preset-react-native-stage-0#babel-preset-react-native-stage-0) 来启用它。*

    ```javascript
    import codePush from "react-native-code-push";

    @codePush
    class MyApp extends Component {
    }
    ```
默认情况下，CodePush 将在每次 app 启动时检查更新。如果有可用的更新，它将静默下载，并在下次启动 app 时安装（由最终用户或操作系统明确安装），这可确保最终用户的侵入性最低的体验。如果选择强制更新，则会立即安装，确保最终用户尽快获得最新版本。

如果您希望 app 更快地发现有更新，您还可以选择在每次 app 从后台恢复时与 CodePush 服务器同步。

```javascript
let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

class MyApp extends Component {
}

MyApp = codePush(codePushOptions)(MyApp);
```

或者，如果您希望对更细粒度（例如按下按钮或定时器间隔）的控制什么时候检查更新，您可以调用 [CodePush.sync()](docs/api-js.md#codepushsync) 传递想要的 `SyncOptions` ，可选的，通过指定 `checkFrequency` 来关闭 CodePush 的自动检查更新：

```javascript
let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

class MyApp extends Component {
    onButtonPress() {
        codePush.sync({
            updateDialog: true,
            installMode: codePush.InstallMode.IMMEDIATE
        });
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={this.onButtonPress}>
                    <Text>Check for updates</Text>
                </TouchableOpacity>
            </View> 
        )
    }
}

MyApp = codePush(codePushOptions)(MyApp);
```

如果想显示更新确认对话框，想配置何时安装可用更新（例如强制立即重启）或其他任何自定义体验，请参阅 [codePush()](docs/api-js.md#codepush) API手册以获取有关的信息。

*注意：如果您使用的是 [Redux](http://redux.js.org) 和 [Redux Saga](http://yelouafi.github.io/redux-saga/)，您也可以使用 [`react-native-code-push-saga`](http://github.com/lostintangent/react-native-code-push-saga) 模块，该模块允许您以更简单/更习惯的方式调用 `sync`。*

### 应用商店指南

虽然 Google Play 和内部应用分发平台（例如 Enterprise，Fabric，HockeyApp）没有限制使用 CodePush 发布更新，但是你应该知道， iOS App Store 及相应的规则对你对应用集成解决方案之前有更明细的规则。

**第3.3.2段**，自2015年以来，[Apple开发者计划许可协议](https://developer.apple.com/programs/ios/information/)完全允许对JavaScript和资源进行在线更新 - 最新版本（20170605）（[下载](https://developer.apple.com/terms/)）中，这一规则更加广泛：

> Interpreted code may be downloaded to an Application but only so long as such code: (a) does not change the primary purpose of the Application by providing features or functionality that are inconsistent with the intended and advertised purpose of the Application as submitted to the App Store, (b) does not create a store or storefront for other code or applications, and (c) does not bypass signing, sandbox, or other security features of the OS.

只要你推送的更新没有显著的与原始提交意图不同的应用，CodePush 完全可以使你遵循这些规则。

为了进一步遵守 Apple 的指导原则，我们建议提交 App Store 的 app 调用 `sync` 时不启用 `updateDialog` ，因为在  [App Store 审核规则](https://developer.apple.com/app-store/review/guidelines/) 中写道：

> Apps must not force users to rate the app, review the app, download other apps, or other similar actions in order to access functionality, content, or use of the app.

这不一定是针对 `updateDialog`，毕竟它不会强迫用户下载新版本，但是当你想显示的时候至少要了解这些规则。

## 发布更新

只要你的 app 配置完成并分发给了用户，当你已经进行了一些 JS 或资源修改时，你就可以直接发布这些更新了！最简单（和推荐）的方法是使用 CodePush CLI 中的 `release-react` 命令，该命令将打包你的 JavaScript 文件和资源文件并发布到 CodePush 服务器上。

这个命令最基本的格式只有两个参数：app 名称和你要发布的平台名称（`iOS` 或 `android`）。

```shell
code-push release-react <appName> <platform>

code-push release-react MyApp-iOS ios
code-push release-react MyApp-Android android
```
`release-react` 命令调用这么简单是因为它提供了很多合适的默认值（例如，生成一个发布包，默认您的应用程序在 iOS 上的入口文件是 `index.ios.js` 或 `index.js`）。但是，为了适合大多数场景，所有的默认值都可以更加灵活的自定义。

```shell
# Release a mandatory update with a changelog
code-push release-react MyApp-iOS ios -m --description "Modified the header color"

# Release an update for an app that uses a non-standard entry file name, and also capture
# the sourcemap file generated by react-native bundle
code-push release-react MyApp-iOS ios --entryFile MyApp.js --sourcemapOutput ../maps/MyApp.map

# Release a dev Android build to just 1/4 of your end users
code-push release-react MyApp-Android android --rollout 25% --dev true

# Release an update that targets users running any 1.1.* binary, as opposed to
# limiting the update to exact version name in the build.gradle file
code-push release-react MyApp-Android android --targetBinaryVersion "~1.1.0"

```
CodePush 客户端支持差异更新，即使你每次 JS 文件和资源文件有更新都发布，你的最终用户实际上只会下载他们需要的文件。这些全由服务器自动实现，所以你可以更加专注开发更好的 app ，而用户下载就交给我们来关注吧。

有关更多 `release-react` 命令的详细信息，以及各种开放参数，请参阅 [CLI文档](https://github.com/Microsoft/code-push/tree/master/cli#releasing-updates-react-native)。此外，如果您希望自己处理 `react-native bundle` 命令，想要比 `release-react` 更灵活的解决方案，请参阅 [release](https://github.com/Microsoft/code-push/tree/master/cli#releasing-updates-general) 命令以获取更多详细信息。

如果您遇到任何问题，或有任何问题/意见/反馈，您可以在 Reactiflux 上 [＃code-push](https://discord.gg/0ZcbPKXt5bWxFdFu) 频道 ping 我们，[给我们发邮件](mailto:codepushfeed@microsoft.com)或查看下面的[故障排除](#debugging--troubleshooting)。

*注意：CodePush 更新应在调试模式以外的模式下进行测试。在调试模式下，React Native 应用会一直下载 packager 生成的JS包，CodePush下载的 JS 包不可用。*

### 多部署测试

在[入门](#入门)文档中，我们讲述了如何用特定的部署密钥配置 CodePush 组件。但是，为了有效地测试您的版本，您必须利用首次创建 CodePush 应用（或或者任何其他自定义的部署）时自动生成的部署 `Staging` 和 `Production` 部署。这样，您永远不会向最终用户发布自己还没有评估过的更新。

*注意：我们客户端的回滚功能可以帮助您取消阻塞安装了有崩溃的版本的用户，服务器端回滚（即`code-push rollback`）允许您阻止其他用户在检测后安装含有错误的版本。当然如果能最从开始就避免含有错误的更新发布显然会更好。*

利用 `Staging` 和 `Production` 部署可以实现以下工作流程（随意自定义！）：

1. 使用 `code-push release-react` 命令发布更新到 `Staging` 部署（如果需要更多控制请用 `code-push release`）
2. 运行测试版的应用，同服务器同步更新，确认程序运行符合预期
3. 用 `code-push-promote` 命令把测试完成的版本从 `Staging` 推送到 `Production` 部署
4. 运行应用发布版本，从服务器同步更新，确认正常运行 

*注意：如果想要达到理想状态，你可以在第三部中选择“分阶段部署”，通过只对一部分用户分发更新（例如 `code-push promote <APP_NAME> Staging Production -r 20%`），可以让您减少通过更新带来的额外的潜在风险（例如，您在第2步中的测试是否涉及了所有的设备/条件？）。然后，经过一段合理的时间后查看崩溃报告或者用户反馈后，可以通过 `code-push patch <APP_NAME> Production -r 100%` 扩展更新到所有用户。*

您可能注意到上述步骤中提及了 App 的 “Staging 构建”和“Prodution 构建”。如果您的构建流程已经为每个“环境”生成了不同的二进制文件，那么您不需要再阅读下去，因为更换 CodePush 部署密钥跟处理其他特定平台的服务（例如 Facebook）一样。但是，如果您正在寻找有关如何设置适应这些构件流程的示例（**包括演示项目**），请参阅以下部分，具体取决于您的应用所针对的平台

  * [Android](docs/multi-deployment-testing-android.md)
  * [iOS](docs/multi-deployment-testing-ios.md)


### 动态分配部署

上面说了可以利用不同的 CodePush 部署在广泛发布给用户之前有效的测试。由于这种流程把部署任务静态的嵌入到了二进制文件中，因此 Staging 或 Production 部署的更新只会同步更新到各自的部署中。许多情况下这已经足够了，因为你只希望你的团队，客户，利益相关者等同步你预生产的更新，因此，只有他们需要一个知道如何同步更新的构建版本。但是，如果想进行 A/B 测试，或者想给特定用户提供体验版权限，那么在运行时能够动态的把特定的用户放进特定的部署中将会非常有用。

为了达成这种工作流程，你只需要当你调用 `codePush` 方法时指定你想要当前用户预制同步的部署秘钥秘钥。这个秘钥会覆盖在 `info.plist` （iOS）或 `MainActivity.java` （Android）中预先写好的默认的秘钥。这样你就能发布一个 Staging 或者 Production 部署，同样也能按需动态“重定向”。

```javascript
// Imagine that "userProfile" is a prop that this component received
// which includes the deployment key that the current user should use.
codePush.sync({ deploymentKey: userProfile.CODEPUSH_KEY });
```

做了以上更改后，剩下的只有决定如何使 app 为当前用户选择正确的密钥。实践中通常有两种解决方案：

1. 暴露一个用户可见的、可以随时更改部署的机制。例如：设置页面可以有一个能够切换测试版本的按钮。当你不注重以后更新内容的保密性，并且如果有高级用户希望根据自己的意愿更早的进入新版本，这种模式很适合。然而，这种方案把决定权给了用户，对透明地执行 A/B 测试没有帮助。

2. 在服务端用额外元数据来注释用户，用来表示用户应该跟那个部署同步。默认情况下，app 仅仅使用二进制文件附加的密钥，用户认证后，服务器可以选择性的把它们“重定向”到另外的部署中，这样你就能按需把特定的用户或群组增量的备份到不同的部署环境中。你甚至可以选择把服务器响应存储到本地，变成新的默认密钥。如何存储密钥到用户配置文件取决于你的认证策略（例如  Auth0, Firebase, custom DB + REST API），通常都很简单。

*注意：如果需要，您还可以实施混合解决方案，允许最终用户在不同部署之间切换，同时还允许您的服务器覆盖该策略。这样，您就拥有了层次性“部署解决方案”，可确保您的应用程序能够自行更新，最终用户可以通过早期访问位来获得好处，但您也能按需对用户进行 A/B测试。*

即使我们建议使用 `Staging` 部署进行更新的预发布测试（如上一节所述），但是用来对用户进行 A/B 测试并不一定有意义，而不是允许早期访问（如上面选项 1 中所述）。因此，我们建议您充分利用自定义应用部署，以便您可以根据自己的需求对用户进行细分。例如，您可以创建长期甚至一次性部署，向其发布应用的更新，然后将某些用户放入其中，以便了解他们的行为。

```javascript
// #1) Create your new deployment to hold releases of a specific app variant
code-push deployment add [APP_NAME] test-variant-one

// #2) Target any new releases at that custom deployment
code-push release-react [APP_NAME] ios -d test-variant-one
```
*注意：部署中的“Install Metrics”中报告的总用户数考虑了从一个部署“切换”到另一个部署的用户。例如，如果您的 `Production` 部署当前报告的用户总数为 1，但您动态切换该用户到 `Staging`，则  `Production` 部署将报告 0 个总用户，而 `Staging` 报告 1（刚刚切换的用户）。这样即使是在用基于运行时的部署重定向方案中，你也可以准确的采集部署使用情况。*

---

## API 参考

* [JavaScript API](docs/api-js.md)
* [Objective-C API 参考 (iOS)](docs/api-ios.md)
* [Java API 参考 (Android)](docs/api-android.md)

### Example Apps / Starters

React Native 社区很大方地创建了一些非常棒的开源应用，可以作为初学者的示例。以下是同样使用 CodePush 的 OSS React Native 应用程序列表，你可以参考其他人是如何使用的：

* [F8 App](https://github.com/fbsamples/f8app) - The official conference app for [F8 2016](https://www.fbf8.com/).
* [Feline for Product Hunt](https://github.com/arjunkomath/Feline-for-Product-Hunt) - An Android client for Product Hunt.
* [GeoEncoding](https://github.com/LynxITDigital/GeoEncoding) - An app by [Lynx IT Digital](https://digital.lynxit.com.au) which demonstrates how to use numerous React Native components and modules.
* [Math Facts](https://github.com/Khan/math-facts) - An app by Khan Academy to help memorize math facts more easily.

另外，如果你想入门 React Native + CodePush，并且想找一个好的入门工具，你应该查看一下内容：

* [Native Starter Pro](http://strapmobile.com/native-starter-pro/)
* [Pepperoni](http://getpepperoni.com/)

*注意：如果你已经开发了一个使用 CodePush 的 React Native 的开源应用，请通知我们，我们很高兴把它添加到列表中。*

### 调试/故障排除

`sync` 方法包括大量开箱即用的诊断日志，因此如果您在使用时遇到问题，最好首先检查下应用的输出日志。这将告诉您应用是否配置正确（例如，插件能否找到你的部署密钥？），如果 app 能访问服务器，是否正在发现可用更新，是否成功下载/安装了更新，我们希望继续尽可能直观/全面得改进日志系统，所以如果你遇到什么问题或者找不到想要的，[请告诉我们](mailto:codepushfeed@microsoft.com)。

最简单的查看日志的办法是运行你在使用平台的 `code-push debug` 命令（例如 `code-push debug ios`）。将会输出被过滤为指定平台的 CodePush 消息的日志流。这样就能轻松识别问题，无需使用特定于平台的工具，也可以轻松浏览大量日志。

<img width="540" alt="screen shot 2016-06-21 at 10 15 42 am" src="https://cloud.githubusercontent.com/assets/116461/16246973/838e2e98-37bc-11e6-9649-685f39e325a0.png">

此外，如果你更熟悉，您还可以使用特定平台的工具来查看 CodePush 日志。简单启动 Chrome DevTools 控制台，Xcode 控制台（iOS），[OS X 控制台](https://en.wikipedia.org/wiki/Console_%28OS_X%29#.7E.2FLibrary.2FLogs) （iOS），ADB logcat（Android），查找带有 `[CodePush]` 前缀的消息。

注意默认情况下 React Native 应用在 iOS 下 release 版本是禁用的，所以如果想在 release 下查看日志，需要在 `AppdDelegate.m` 中做出以下更改：

1. 添加 `#import <React/RCTLog.h>` 声明。RN < v0.40 使用: `#import "RCTLog.h"`

2. 添加下面的语句在 `application:didFinishLaunchingWithOptions` 方法的顶部:

    ```objective-c
    RCTSetLogThreshold(RCTLogLevelInfo);
    ```
现在，您能在 iOS 或 Android 上 debug 或 release 模式查看 CodePush 日志。如果日志没有提供问题的指示，请参阅以下常见问题以获得其他解决方案的想法：

| 错误/表现 | 解决方案 |
|-----------------|-------------------|
| 编译错误 | 重新检查 React Native 版本与 CodePush 版本[兼容](#supported-react-native-platforms) |
| iOS 模拟器中调用 `sync` 或 `checkForUpdate` 时 Network timeout / hang  | 尝试通过  `Simulator -> Reset Content and Settings..` 选项重置模拟器, 然后重新运行 app |
| 调用 `sync` 时 `checkForUpdate` 服务器响应 `404` | 重新检查 `Info.plist` (iOS), `build.gradle` (Android)中或者传给 `sync`/`checkForUpdate` 的部署密钥是否正确，使用命令  `code-push deployment ls [APP_NAME] -k`  查看 app 的所有部署密钥 |
| 未发现更新 | 重新检查运行中的 app 的版本号 (例如`1.0.0`) 是否与发布到 CodePush 指定的版本匹配。另外, 确保你发布与配置是同一个部署 |
| 重启后不显示更新内容 | 如果没有在 app 启动时调用 `sync` (例如在根组件的 `componentDidMount` 中调用), 那么你需要在 app 启动时显式的调用 `notifyApplicationReady`，否则组件会认为更新失败并回滚。 |
| 发布 iOS 更新，但是 Android 应用也收到了更新 it breaks it | 确保每个平台都有不同的部署密钥，以便正确接收更新 |
| 发布了更新但是没有显式出更新内容 | 确保没有在 debug 下运行应用。 在 debug 模式下，React Native app 总是下载由 packager 生成的JS包，因此 CodePush 下载的JS包不生效。 |
| iOS 模拟器找不到 JS 更新包 | 默认情况, React Native 在模拟器上不生成 JS bundle . 因此, 如果使用 `[CodePush bundleURL]`, 并且目标是 iOS 模拟器，可能会得到 `nil`。 这个问题在 RN 0.22.0 修复, 但是只针对 release 版本。可以通过[本地修改](https://github.com/facebook/react-native/commit/9ae3714f4bebdd2bcab4d7fdbf23acebdc5ed2ba)来取消这种限制。 |

### 持续集成/交付

除了能使用 CodePush CLI “手动”发布更新以外，我们认为创建可重复且可持续的解决以便为应用程序提供更新更新非常重要。这样，对您和/或您的团队来说，创建和保持敏捷部署的节奏就足够了。为了帮助设置基于 CodePush 的 CD 管道，请参阅以下与各种 CI 服务器的集成：

* [Visual Studio Team Services](https://marketplace.visualstudio.com/items?itemName=ms-vsclient.code-push) - *注意: VSTS 有发布到 [HockeyApp](https://marketplace.visualstudio.com/items?itemName=ms.hockeyapp) 和 [Google Play](https://github.com/Microsoft/google-play-vsts-extension) 的扩展 , 因此它提供了一个非常棒的移动 CD 解决方案。*
* [Travis CI](https://github.com/mondora/code-push-travis-cli)

此外，如果你想要更多关于完整的集成了 CodePush 的移动 CI/CD 工作流程的详细信息，请参阅这篇来自 [ZeeMee 团队](https://zeemee.engineering)的[优秀文章](https://zeemee.engineering/zeemee-engineering-and-the-quest-for-the-holy-mobile-dev-grail-1310be4953d1#.zfwaxtbco)。

### TypeScript Consumption

模块将其 *.d.ts 文件作为其 NPM 包的一部分提供，你可以简单地 `import`，并在支持的编辑器（例如Visual Studio Code）中使用智能提示，以及在使用 TypeScript 编译时进行类型检查。在大多数情况下，这些能立即上手，但是，如果你在 `tsconfig.json` 文件的 `target` 或 `module` 中指定 `es6` 为[编译选项](http://www.typescriptlang.org/docs/handbook/compiler-options.html)，则只需确保您设置 `moduleResolution` 为 `node`。这可确保 `TypeScript` 编译器在 `node_modules` 中查找导入模块的类型。否则，在尝试导入 `react-native-code-push` 模块时，你会得到下面的错误：`error TS2307: Cannot find module 'react-native-code-push'`。

---

本项目采用了 [Microsoft开源行为准则](https://opensource.microsoft.com/codeofconduct/)。有关更多信息，请参阅[行为准则 FAQ](https://opensource.microsoft.com/codeofconduct/faq/)或将任何问题或意见发送至 [opencode@microsoft.com](mailto:opencode@microsoft.com)。
