// Redirect the New Tab page to the address saved from the popup.
//
// There is no default or fallback address anywhere in this file.
// Until an address is saved, this page shows a short message
// instead of opening anywhere the user did not choose.

(function () {
  'use strict';

  function isHttpUrl(value) {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (err) {
      return false;
    }
  }

  function showMessage(text) {
    document.body.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.cssText =
      'display:flex;align-items:center;justify-content:center;' +
      'height:100vh;margin:0;padding:0 24px;box-sizing:border-box;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
      'color:#9099a3;font-size:13px;text-align:center;';
    wrap.textContent = text;
    document.body.appendChild(wrap);
  }

  async function init() {
    let data;
    try {
      data = await browser.storage.sync.get({ newTabUrl: '', enabled: true });
    } catch (err) {
      showMessage('Could not read the saved New Tab URL. Click the LetaTab icon in the toolbar.');
      return;
    }

    if (!data.enabled) {
      showMessage('LetaTab is turned off. Click the toolbar icon to turn it back on.');
      return;
    }

    if (data.newTabUrl && isHttpUrl(data.newTabUrl)) {
      window.location.href = data.newTabUrl;
      return;
    }

    showMessage('No New Tab URL is set yet. Click the LetaTab icon in the toolbar to choose one.');
  }

  init();
})();
