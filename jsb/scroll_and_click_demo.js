setTimeout(function () {
  const api = globalThis.__RN_INJECTOR__;
  if (!api || !api.scrollUntilText) {
    return;
  }

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
}, 2400);
