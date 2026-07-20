const urlInput = document.getElementById('url');
const enabledToggle = document.getElementById('enabled');
const status = document.getElementById('status');
const hint = document.getElementById('hint');

const DEFAULT_HINT = 'Enter a full address, including https://. It opens every time you start a new tab.';
const ERROR_HINT = 'Web address must start with https:// or http://';
const SAVE_ERROR_HINT = 'Could not save. Please try again.';

let statusTimer = null;
let saveTimer = null;

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

function showSaved() {
  status.classList.add('visible');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    status.classList.remove('visible');
  }, 1500);
}

function setError(isError, message) {
  hint.textContent = isError ? (message || ERROR_HINT) : DEFAULT_HINT;
  hint.classList.toggle('error', isError);
}

async function init() {
  try {
    const data = await browser.storage.sync.get({ newTabUrl: '', enabled: true });
    urlInput.value = data.newTabUrl;
    enabledToggle.checked = data.enabled;
  } catch (err) {
    setError(true, 'Could not load saved settings.');
  }
}

init();

urlInput.addEventListener('input', () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const value = urlInput.value.trim();

    if (value === '') {
      setError(false);
      try {
        await browser.storage.sync.set({ newTabUrl: '' });
        showSaved();
      } catch (err) {
        setError(true, SAVE_ERROR_HINT);
      }
      return;
    }

    if (!isHttpUrl(value)) {
      setError(true);
      return;
    }

    setError(false);
    try {
      await browser.storage.sync.set({ newTabUrl: value });
      showSaved();
    } catch (err) {
      setError(true, SAVE_ERROR_HINT);
    }
  }, 500);
});

enabledToggle.addEventListener('change', async () => {
  try {
    await browser.storage.sync.set({ enabled: enabledToggle.checked });
    showSaved();
  } catch (err) {
    setError(true, SAVE_ERROR_HINT);
  }
});
