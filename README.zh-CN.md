# android-rn-testid-hook-exam

[English](./README.md)

这是 `android-rn-testid-hook` 的演示仓库，用来展示这套方案在真实 Android React Native 应用里的三个核心能力：

1. 自动给 RN 原生视图注入 `testID`
2. 在业务 bundle `runModule` 之前注入自定义 JSB
3. 通过通用 JSB API 完成自动化交互，例如关闭弹窗、滚动到指定文本、点击指定文本

## 演示范围

这个 demo 基于 `SimpleApp` 完成验证，当前主线范围是：

- `Dobby`
- `arm64-v8a`
- Hermes
- New Architecture / bridgeless `ReactHost`

如果你只想快速看结果，优先看下面两个素材：

- [demo.mp4](./artifacts/demo.mp4)：完整录屏演示
- [after.xml](./artifacts/after.xml)：Android `uiautomator dump` 证据

## 演示流程

当前验证通过的完整流程是：

1. app 启动
2. 注入 prelude，patch React / `jsx-runtime`
3. 给 host component 自动注入 `testID`
4. 自定义 JSB 打开弹窗
5. 自定义 JSB 关闭弹窗
6. 自定义 JSB 将长列表滚动到 `选项 80`
7. 自定义 JSB 点击 `选项 80`
8. 页面最终进入 `你选择了：选项 80`

## Android 侧 `testID` 证据

在 Android React Native 上，注入后的 `testID` 最终会通过 `uiautomator dump` 体现为 `resource-id`。

可直接查看：

- [after.xml](./artifacts/after.xml)

不需要阅读整份 dump，重点看“变更前页面基线内容”和“变更后最终 dump 关键片段”的对比。

变更前，页面只是普通业务内容，例如：

```text
text="请先选择一个选项"
text="弹窗状态：未打开"
```

这时还没有 injector 特有的 Android 侧证据。
真正关键的是，注入后最终 dump 中出现了原本不存在的原生标识。

最终 dump 的代表性片段：

```xml
resource-id="auto_RCTView"
resource-id="auto_RCTScrollView"
resource-id="auto_RCTText__80"
content-desc="选项 80"
text="你选择了：选项 80"
text="弹窗状态：已关闭"
```

这能证明：

- RN 侧注入的 `testID` 已经落到了 Android 原生视图上
- Android 把这些注入值暴露成了 `resource-id`
- 自动化脚本确实滚动并命中了 `选项 80`
- 通用关闭弹窗能力确实关闭了弹窗

## 视频

设备实录视频：

- [demo.mp4](./artifacts/demo.mp4)

视频里可以直接看到：

- app 启动
- 弹窗打开 / 关闭
- 滚动到目标位置
- 点击目标项

README 以视频和过滤后的 XML 证据为主，不再堆叠静态截图。

## JSB 示例

这个仓库里包含了验证时使用的自定义 JSB：

- [demo_combined.js](./jsb/demo_combined.js)
- [close_dialogs_demo.js](./jsb/close_dialogs_demo.js)
- [scroll_and_click_demo.js](./jsb/scroll_and_click_demo.js)

## Java/Kotlin 层如何调用 JSB

宿主 app 通过 JNI bridge 这样调用：

```kotlin
RNTestIDInjector.nativeSetCustomInjectedScript(
  File("/path/to/demo_combined.js").readText()
)

RNTestIDInjector.nativeInstallHooks()

val bundleInfoJson = RNTestIDInjector.nativeGetCurrentBundleInfo()
Log.i("RNTestIDInjector", "Bundle info: $bundleInfoJson")
```

也可以按文件路径注入：

```kotlin
RNTestIDInjector.nativeSetCustomInjectedScriptFile(
  "/data/user/0/com.example/files/demo_combined.js"
)
```

## 注入后可用的通用 JS API

注入后的 runtime prelude 会暴露这些通用能力：

```javascript
globalThis.__RN_INJECTOR__.clickByText(text)
globalThis.__RN_INJECTOR__.clickByTextWhenReady(text, attempts, intervalMs)
globalThis.__RN_INJECTOR__.closeDialogs(options)
globalThis.__RN_INJECTOR__.closeDialogsWhenReady(options)
globalThis.__RN_INJECTOR__.scrollUntilText(text, options)
globalThis.__RN_INJECTOR__.listActions()
globalThis.__RN_INJECTOR__.listVisibleTexts()
globalThis.__RN_INJECTOR__.listScrollables()
globalThis.__RN_INJECTOR__.listOverlays()
```
