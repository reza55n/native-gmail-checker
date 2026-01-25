if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.className = 'dark'
}

const lockEl = document.getElementById('lock')
const badgeEl = document.getElementById('badge')

chrome.storage.sync.get('lock').then(lc => lockEl.checked = lc.lock)
chrome.storage.sync.get('badge').then(ba => badgeEl.checked = ba.badge)

badgeEl.addEventListener('change', async (e) => {
  await chrome.storage.sync.set({badge: e.target.checked})
})
lockEl.addEventListener('change', async (e) => {
  await chrome.storage.sync.set({lock: e.target.checked})
})