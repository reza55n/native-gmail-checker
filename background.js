const setDef = async (key, def) => {
  if ((await chrome.storage.sync.get(key))?.[key] === undefined) {
    await chrome.storage.sync.set({ [key]: def })
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await setDef('lock', false)
  await setDef('badge', true)
  
  chrome.alarms.create("chromeChecker", {
    periodInMinutes: 0.05
  })
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "chromeChecker") {
    
    const gmailUrl = 'https://mail.google.com/mail/u/0'
    
    var allTabs = await chrome.tabs.query({})
    var gmailTabs = allTabs.filter(e => e.url?.startsWith(gmailUrl))
    
    if (!gmailTabs.length) {
      await chrome.tabs.create({
        url: gmailUrl,
        active: false,
        pinned: true,
      })
      allTabs = await chrome.tabs.query({})
      gmailTabs = allTabs.filter(e => e.url?.startsWith(gmailUrl))
    }
    
    const gmailTab = gmailTabs[0]
    
    if (!gmailTab?.id) {
      console.log('Error: Gmail tab not found after creation attempt.')
      return
    }
    
    if (!gmailTab.pinned) {
      await chrome.tabs.update(gmailTab.id, { pinned: true })
    }
    
    const unread0 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAABEklEQVQ4EWNgGGjA2F268D8ljmABaQ5MCARRJOP1C9YzMIF0Pb3/hIGBRHe8fPoSpJWBBURev3CD4c71uwx6proMgqJCICGc+NP7TwyXT19m+P71O1gN2ADnAGeGZw+fMZw+eJqBm4+HQddMl4FPgA+sAEZ8/fKN4eqZKwzv33xg0DHRZpCSl2LYsHADxAWMjIwM0grSDOLS4gy3r9xmOLz9MIO8qjyDnLIsAyMTE8PTB08Z7t+4z6CgpsBgbGPMwMzCDDMXYgCMx8LKwqBpqMmgqK7AcPPSLYYjO4+CpWQUpRkcfR0YOLg4wXxkAuwFZAEQG6RQ30KfAYRBfHwYHAv4FBCSG3gDwGEASlGEnDp45QGHykKhoZOfwAAAAABJRU5ErkJggg=='
    const unread  = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAJ5mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjYtMDEtMjVUMDA6MjU6MDkrMDM6MzAiIHhtcDpNb2RpZnlEYXRlPSIyMDI2LTAxLTI1VDAwOjM1OjUyKzAzOjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI2LTAxLTI1VDAwOjM1OjUyKzAzOjMwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBiMTJmMTY4LWI3N2MtMWE0YS1hZGE1LWYxYTBiZmE1ZTEyMSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjgxNzk2MTIwLWUwNjUtNjU0NS1hYWRiLTg1OWEzYjQ3MDEyMyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjFiZDQ4ZDY5LTJkODgtMjg0Yy05NDdmLTU2MTQ1NjBjNzVkYyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MWJkNDhkNjktMmQ4OC0yODRjLTk0N2YtNTYxNDU2MGM3NWRjIiBzdEV2dDp3aGVuPSIyMDI2LTAxLTI1VDAwOjI1OjA5KzAzOjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuNCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZjBlZjczOTMtZDVkMy0zNTQ5LTkyMGQtNzYxODFjZjU4MDY5IiBzdEV2dDp3aGVuPSIyMDI2LTAxLTI1VDAwOjM1OjM4KzAzOjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuNCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjdmZDFhZDU4LWMxYjgtNjM0My1hNjAwLTNhNzk0ZTkzMDMyNSIgc3RFdnQ6d2hlbj0iMjAyNi0wMS0yNVQwMDozNTo1MiswMzozMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowYjEyZjE2OC1iNzdjLTFhNGEtYWRhNS1mMWEwYmZhNWUxMjEiIHN0RXZ0OndoZW49IjIwMjYtMDEtMjVUMDA6MzU6NTIrMDM6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N2ZkMWFkNTgtYzFiOC02MzQzLWE2MDAtM2E3OTRlOTMwMzI1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFiZDQ4ZDY5LTJkODgtMjg0Yy05NDdmLTU2MTQ1NjBjNzVkYyIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjFiZDQ4ZDY5LTJkODgtMjg0Yy05NDdmLTU2MTQ1NjBjNzVkYyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiDHZfUAAACcSURBVDiNrVNBCoAgEFSUIOglfaVveO2RPcB7Zz/RSabDoJkllbYwIOvM6A4qAIgWNImDQVPRQIg6RIN5/i6epsQg1Dg+C4cB8P5mBGPY8Z6kXCglsG3kGJONkBKtJWldadT3wLKwZ20hg7vTnDtGc469Yohvg5PyjGiQb5SgFKE1EQ20Brru2EiR9sNaqcob5Dlc3kFF/fKZmrADNurLq1NM4egAAAAASUVORK5CYII='
    var targetIcon
    
    // Ignore if icon is default (especially for loading page) or already set to our icons
    if (![unread, unread0, 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico'].includes(gmailTab.favIconUrl)) {
      if (gmailTab.favIconUrl === 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/unreadcountfavicon/3/0.png') {
        // No unread
        targetIcon = unread0
      } else {
        // Unread or invalid icon
        targetIcon = unread
      }
    }
    
    await chrome.scripting.executeScript({
      target: { tabId: gmailTab.id },
      
      func: async (targetIcon) => {
        // It may not work when the page is being loaded
        const lc = await chrome.storage.sync.get('lock')
        if (lc.lock) {
          window.onbeforeunload = () => 'This prompt is here to warn before closing the browser.'
          // console.log('Locked')
        } else {
          window.onbeforeunload = null
          // console.log('Unlocked')
        }
        
        const bd = await chrome.storage.sync.get('badge')
        if (bd.badge && targetIcon) {
          const oldLink = document.querySelector("link[rel*='icon']")
          if (oldLink) {
            oldLink.remove()
          }
          
          const link = document.createElement('link')
          link.rel = 'icon'
          link.href = targetIcon
          document.head.appendChild(link)
        }
      },
      args: [targetIcon || null]
    })
  }
})