import { ExtensionAPI, OnloadArgs } from '../types'

let interval: NodeJS.Timer;

let themeConfig = [
  {
    extensionName: 'roam-theme-bear-gotham',
    themeKey: 'bear-gotham',
    commandLabel: 'Roam Theme: Bear Gotham',
    installed: false
  },
  {
    extensionName: 'roam-theme-bear-panic',
    themeKey: 'bear-panic',
    commandLabel: 'Roam Theme: Bear Panic',
    installed: false
  },
  {
    extensionName: 'roam-theme-bubblegum-dark',
    themeKey: 'bubblegum-dark',
    commandLabel: 'Roam Theme: Bubblegum Dark',
    installed: false
  },
  {
    extensionName: 'roam-theme-bubblegum-light',
    themeKey: 'bubblegum-light',
    commandLabel: 'Roam Theme: Bubblegum Light',
    installed: false
  },
  {
    extensionName: 'roam-theme-caesar-light',
    themeKey: 'caesar-light',
    commandLabel: 'Roam Theme: Caesar Light',
    installed: false
  },
  {
    extensionName: 'roam-theme-darkage',
    themeKey: 'darkage',
    commandLabel: 'Roam Theme: Dark Age',
    installed: false
  },
  {
    extensionName: 'roam-theme-dracula',
    themeKey: 'dracula',
    commandLabel: 'Roam Theme: Dracula',
    installed: false
  },
  {
    extensionName: 'roam-theme-float',
    themeKey: 'float',
    commandLabel: 'Roam Theme: Float',
    installed: false
  },
  {
    extensionName: 'roam-theme-gambler',
    themeKey: 'gambler',
    commandLabel: 'Roam Theme: Gambler',
    installed: false
  },
  {
    extensionName: 'roam-theme-hipster1',
    themeKey: 'hipster1',
    commandLabel: 'Roam Theme: Hipster1',
    installed: false
  },
  {
    extensionName: 'roam-theme-hipster2',
    themeKey: 'hipster2',
    commandLabel: 'Roam Theme: Hipster2',
    installed: false
  },
  {
    extensionName: 'roam-theme-leyendarker',
    themeKey: 'leyendarker',
    commandLabel: 'Roam Theme: Leyendarker',
    installed: false
  },
  {
    extensionName: 'roam-theme-leyendecker',
    themeKey: 'leyendecker',
    commandLabel: 'Roam Theme: Leyendecker',
    installed: false
  },
  {
    extensionName: 'roam-theme-lilac-dark',
    themeKey: 'lilac-dark',
    commandLabel: 'Roam Theme: Lilac Dark',
    installed: false
  },
  {
    extensionName: 'roam-theme-lilac-light',
    themeKey: 'lilac-light',
    commandLabel: 'Roam Theme: Lilac Light',
    installed: false
  },
  {
    extensionName: 'roam-theme-magazine',
    themeKey: 'magazine',
    commandLabel: 'Roam Theme: Magazine',
    installed: false
  },
  {
    extensionName: 'roam-theme-mermaid-dark',
    themeKey: 'mermaid-dark',
    commandLabel: 'Roam Theme: Mermaid Dark',
    installed: false
  },
  {
    extensionName: 'roam-theme-mermaid-light',
    themeKey: 'mermaid-light',
    commandLabel: 'Roam Theme: Mermaid Light',
    installed: false
  },
  {
    extensionName: 'roam-theme-night-owlish',
    themeKey: 'night-owlish',
    commandLabel: 'Roam Theme: Night Owlish',
    installed: false
  },
  {
    extensionName: 'roam-theme-rails-orange',
    themeKey: 'rails-orange',
    commandLabel: 'Roam Theme: Rails Orange',
    installed: false
  },


  {
    extensionName: 'roam-theme-rails-purple',
    themeKey: 'rails-purple',
    commandLabel: 'Roam Theme: Rails Purple',
    installed: false
  },
  {
    extensionName: 'roam-theme-tokiwa',
    themeKey: 'tokiwa',
    commandLabel: 'Roam Theme: Tokiwa',
    installed: false
  },
  {
    extensionName: 'roam-theme-zenithedecker',
    themeKey: 'zenithdecker',
    commandLabel: 'Roam Theme: Zenithedecker',
    installed: false
  },
]

const dynamicUpdateCommands = () => {
  let request = indexedDB.open('marketplaceCache', 1)
  request.onsuccess = (event: Event) => {
    const db = (event.target as IDBOpenDBRequest).result
    const transaction = db.transaction('extensions', 'readonly')
    const objectStore = transaction.objectStore('extensions')
    const getAllKeysRequest = objectStore.getAllKeys()
    getAllKeysRequest.onsuccess = (event: Event) => {
      const allExtensionKeys: Array<string> = (event.target as IDBRequest).result
      removeThemeCommands()

      // check the current user installed theme plugins
      for (let config of themeConfig) {
        if (allExtensionKeys.some(key => key.indexOf(config.extensionName) != -1)) {
          config.installed = true
        } else {
          config.installed = false
        }
      }

      registeThemeCommands()
    }
  }
}


const registeThemeCommands = () => {
  for (let config of themeConfig) {
    if (!config.installed) continue
    window.roamAlphaAPI.ui
      .commandPalette
      .addCommand({
        label: config.commandLabel,
        callback: () => {
          switchRoamTheme(config.themeKey)
        }
      })
  }
}

const removeThemeCommands = () => {
  for (let config of themeConfig) {
    if (!config.installed) continue
    window.roamAlphaAPI.ui
      .commandPalette
      .removeCommand({ label: config.commandLabel })
  }
}

const switchRoamTheme = (newTheme: string) => {
  document.body.className = newTheme
}

function onload({ extensionAPI }: OnloadArgs) {
  // every 5s to check if the user installs/uninstalls the new theme extension, then update the command
  interval = setInterval(() => {
    dynamicUpdateCommands()
  }, 5000)
}

function onunload() {
  removeThemeCommands()
  if (interval)
    clearInterval(interval)
}

export default {
  onload: onload,
  onunload: onunload,
}