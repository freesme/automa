import { openDB } from 'idb';
import { nanoid } from 'nanoid';
import secrets from 'secrets';
import browser from 'webextension-polyfill';
import { objectHasKey } from '@/utils/helper';
import { sendMessage } from '@/utils/message';

function initWebListener() {
  const listeners = {};

  function on(name, callback) {
    (listeners[name] = listeners[name] || []).push(callback);
  }

  window.addEventListener('__automa-ext__', ({ detail }) => {
    if (!detail || !objectHasKey(listeners, detail.type)) return;

    listeners[detail.type].forEach((listener) => {
      listener(detail.data);
    });
  });

  return { on };
}

async function listenWindowMessage(workflows) {
  try {
    if (secrets?.webOrigin !== window.location.origin) return;

    const db = await openDB('automa', 1, {
      upgrade(event) {
        event.createObjectStore('store');
      },
    });

    await db.put('store', workflows, 'workflows');

    const webListener = initWebListener();
    webListener.on('open-workflow', ({ workflowId }) => {
      if (!workflowId) return;

      sendMessage('open:dashboard', `/workflows/${workflowId}`, 'background');
    });
    webListener.on('add-workflow', async ({ workflow }) => {
      try {
        const { workflows: workflowsStorage } = await browser.storage.local.get(
          'workflows'
        );

        workflowsStorage.push({
          ...workflow,
          id: nanoid(),
          createdAt: Date.now(),
        });

        await browser.storage.local.set({ workflows: workflowsStorage });
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export default async function (workflows) {
  await listenWindowMessage(workflows);

  document.body.setAttribute(
    'data-atm-ext-installed',
    browser.runtime.getManifest().version
  );
}
