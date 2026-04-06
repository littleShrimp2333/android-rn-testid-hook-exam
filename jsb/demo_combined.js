globalThis.__RN_CUSTOM_JSB_TEST__ = 'ok';

setTimeout(function () {
  const api = globalThis.__RN_INJECTOR__;
  if (!api) {
    return;
  }

  const actions = api.listActions ? api.listActions() : [];
  const overlays = api.listOverlays ? api.listOverlays() : [];

  if (globalThis.console && console.log) {
    console.log('[CUSTOM_JSB] actions =', JSON.stringify(actions));
    console.log('[CUSTOM_JSB] overlays =', JSON.stringify(overlays));
  }

  if (api.clickByTextWhenReady) {
    api.clickByTextWhenReady('打开弹窗', 8, 400);
  }

  setTimeout(function () {
    if (api.closeDialogsWhenReady) {
      api.closeDialogsWhenReady({
        labels: ['关闭弹窗', '关闭'],
        attempts: 8,
        intervalMs: 400,
      }).then(function (closed) {
        if (globalThis.console && console.log) {
          console.log('[CUSTOM_JSB] closeDialogs result =', closed);
        }
      });
    }
  }, 1200);

  setTimeout(function () {
    if (api.scrollUntilText) {
      api.scrollUntilText('选项 80', {
        attempts: 20,
        intervalMs: 500,
        step: 1200,
      }).then(function (found) {
        let clicked = false;
        if (found && api.clickByText) {
          clicked = api.clickByText('选项 80');
        }

        if (globalThis.console && console.log) {
          console.log('[CUSTOM_JSB] scroll found =', found, 'click result =', clicked);
        }
      });
    }
  }, 2400);

  if (globalThis.console && console.log) {
    console.log('[CUSTOM_JSB] inline custom script scheduled modal close + scroll+click');
  }
}, 1500);
