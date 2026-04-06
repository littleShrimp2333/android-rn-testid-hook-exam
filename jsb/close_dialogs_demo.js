setTimeout(function () {
  const api = globalThis.__RN_INJECTOR__;
  if (!api || !api.closeDialogsWhenReady) {
    return;
  }

  api.closeDialogsWhenReady({
    labels: ['关闭弹窗', '关闭', '取消', '确定'],
    attempts: 8,
    intervalMs: 400,
  }).then(function (closed) {
    if (globalThis.console && console.log) {
      console.log('[CUSTOM_JSB] closeDialogs result =', closed);
    }
  });
}, 1200);
