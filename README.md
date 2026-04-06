# android-rn-testid-hook-exam

Demo artifacts for `android-rn-testid-hook`.

This repo shows three things:

1. `testID` injection on Android RN views
2. Custom JSB injection before app `runModule`
3. Generic JSB interaction helpers:
   - close dialogs
   - scroll until text
   - click by text

## Demo Flow

The validated demo flow in `SimpleApp` is:

1. app starts
2. injected prelude patches React / `jsx-runtime`
3. host component `testID`s are injected
4. custom JSB opens a modal
5. custom JSB closes the modal
6. custom JSB scrolls the long list until `选项 80`
7. custom JSB clicks `选项 80`
8. UI ends in the state `你选择了：选项 80`

## Android-side `testID` Evidence

On Android RN, injected `testID` is surfaced in `uiautomator dump` as `resource-id`.

See:

- [after.xml](./artifacts/after.xml)

You do not need to read the entire dump file.
The useful comparison is:

- the baseline screen content before injector-driven actions
- the filtered subset of final dump lines after injection and JSB automation

Before, the demo screen starts from ordinary app content such as:

```text
text="请先选择一个选项"
text="弹窗状态：未打开"
```

At that point there is no injector-specific Android evidence to point at yet.
What matters is that, after injection, the final dump contains new native-side identifiers that did not exist in the baseline UI content.

Representative lines from the final dump:

```xml
resource-id="auto_RCTView"
resource-id="auto_RCTScrollView"
resource-id="auto_RCTText__80"
content-desc="选项 80"
text="你选择了：选项 80"
text="弹窗状态：已关闭"
```

What this proves:

- the RN-side `testID` patch reached Android native views
- Android exposed those injected values as `resource-id`
- the scripted flow really reached `选项 80`
- the dialog-close helper really dismissed the modal

## Video

Recorded on-device demo video:

- [demo.mp4](./artifacts/demo.mp4)

The video shows the automated flow:

- app launch
- modal open / close
- scroll to target
- click target

This is the primary demo artifact.
The README intentionally focuses on the video plus the filtered XML evidence.

## JSB Examples

This repo includes the custom JSB snippets used during validation:

- [demo_combined.js](./jsb/demo_combined.js)
- [close_dialogs_demo.js](./jsb/close_dialogs_demo.js)
- [scroll_and_click_demo.js](./jsb/scroll_and_click_demo.js)

## How Java/Kotlin Calls the JSB

The host app uses the injector JNI bridge like this:

```kotlin
RNTestIDInjector.nativeSetCustomInjectedScript(
  File("/path/to/demo_combined.js").readText()
)

RNTestIDInjector.nativeInstallHooks()

val bundleInfoJson = RNTestIDInjector.nativeGetCurrentBundleInfo()
Log.i("RNTestIDInjector", "Bundle info: $bundleInfoJson")
```

You can also inject by file path:

```kotlin
RNTestIDInjector.nativeSetCustomInjectedScriptFile(
  "/data/user/0/com.example/files/demo_combined.js"
)
```

## What the Underlying JS API Looks Like

Inside the injected runtime prelude, the following generic helpers are available:

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

## Current Scope

This demo reflects the currently validated mainline:

- `Dobby`
- `arm64-v8a`
- Hermes
- New Architecture / bridgeless `ReactHost`
