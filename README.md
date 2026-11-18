# Tuna's Utility Tools

One link for all my web tools: **https://afonsobranco.github.io/**

Plain HTML, CSS and JS. No build step and no dependencies. It is hosted on GitHub Pages from `main`.

## Add a new project

Add an entry to [`projects.json`](projects.json), then commit and push. The page updates in about a minute.

```json
{
  "name": "My New Tool",
  "url": "https://afonsobranco.github.io/my-new-tool/",
  "repo": "https://github.com/afonsobranco/my-new-tool",
  "description": "One short sentence about what it does.",
  "category": "Developer",
  "icon": "code",
  "accent": "#6366f1"
}
```

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Card title |
| `url` | yes | Live page (https) |
| `description` | yes | One line works best |
| `category` | no | Any text. A new category gets its own section and filter chip on its own. Defaults to "Other". |
| `repo` | no | Shows a "Code" link |
| `private` | no | `true` hides the Code link |
| `icon` | no | One of `weather`, `mountain`, `teleport`, `translate`, `pdf`, `record`, `compress`, `code`, `regex`, `contrast`, `path`, `glass`, `ratio`, `tool`. Anything else shows the first letter of the name. To add a new icon, add an SVG to `ICONS` in `app.js`. |
| `accent` | no | Hex color for the icon tile |
| `keywords` | no | Extra words for search |
| `hidden` | no | `true` keeps the entry in the file but hides its card |

Order in the file sets the order on the page, for both categories and cards.

## Use it as a phone app

- **iPhone:** open the link in Safari, tap Share, then Add to Home Screen.
- **Android:** open the link in Chrome, then tap Install app (or ⋮ → Add to Home screen).

The hub opens full-screen and works offline. The tools themselves still need a connection unless they cache themselves.

## Run locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.
