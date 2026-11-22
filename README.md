# Document

🌐 **Live site:** [document.us.ci](https://document.us.ci)

A collection of tools, notes and small projects. The home page shows every folder as a card, and clicking a card opens that folder's page.

---

## Features

- **Automatic listing:** Reads the list of folders and files from `files.json` and builds the cards for you.
- **Instant search:** Type a name and the cards are filtered immediately.
- **Subfolder pages:** A folder that contains other folders gets its own listing page, with a back button, breadcrumbs, search, and colored icons by file type.
- **Works on any host:** GitHub Pages, Cloudflare Pages, or any other static hosting. No server and no GitHub API required.
- **Mobile and desktop:** Responsive layout. Subfolder pages follow the device's dark or light mode automatically.

---

## Folder structure

```
/
├── index.html            ← main page (lists all folders)
├── files.json            ← list of folders and files
├── generate-files.js     ← script that builds files.json
├── README.md
├── Admission class/
├── Authenticator/
├── Encryption/
│   ├── index.html        ← listing page for this subfolder
│   ├── files.json
│   ├── Any file/
│   └── Only text/
├── Gallery/
├── Hsc GPA Calculator/
├── HSC Routine 2026/
├── Just Communicate/
├── Practical for HSC/
├── QR code generator/
└── Telegram bot controller/
```

Each tool folder has its own `index.html`, which is what opens when you click its card.

---

## How it works

On static hosting, a browser cannot list the contents of a server folder directly. So the site uses a manifest file, `files.json`:

1. When the page loads, `index.html` reads the `files.json` next to it.
2. For every folder or file in that list, it creates a card (or a row on subfolder pages).
3. Clicking a folder opens that folder's own `index.html`.
4. A subfolder page looks for `files.json` in its own folder first. If it is not there, it checks the parent folders one by one, and reads the nested list (`children`) from the root `files.json` if available.
5. If no `files.json` is found anywhere, it falls back to reading the server's own directory listing (works on Apache, nginx autoindex and local servers).

### `files.json` format

```json
[
  { "name": "Gallery", "type": "dir" },
  { "name": "notes.pdf", "type": "file" }
]
```

`type` is either `dir` (folder) or `file`. When generated with `generate-files.js`, each folder also includes its contents under `children`.

### What is hidden from the listing

`index.html`, `files.json`, `generate-files.js`, `_headers`, `_redirects`, `_worker.js`, `functions`, `node_modules`, and anything whose name starts with a dot (`.`). To hide more, add names to the `ignore` list in `index.html` and `generate-files.js`.

---

## Adding a new folder

### Option 1: Manually (simplest)

1. Create the new folder and put an `index.html` inside it.
2. Add this line to the root `files.json`:
   ```json
   { "name": "New folder name", "type": "dir" }
   ```
3. Upload or push everything.

### Option 2: With the script (requires Node.js)

Run this in the root folder:

```bash
node generate-files.js
```

It walks through all folders and files and creates a fresh `files.json`.

### Option 3: Automatically on deploy (Cloudflare Pages)

Connect the GitHub repository to Cloudflare Pages and use these settings:

- **Build command:** `node generate-files.js`
- **Build output directory:** `.`

After that, `files.json` is regenerated on every push.

> If you use this option, delete any hand-written `files.json` inside subfolders. Otherwise the subfolder page will keep reading its own old list.

---

## Troubleshooting

| Problem | Cause and fix |
|---|---|
| "Failed to load" / "files.json not found" | `files.json` was not uploaded next to `index.html`, or the name is wrong (for example `files(1).json`). Fix the name and upload again. |
| Error when opening from the phone's file manager | Browsers block reading neighboring files from `file://` addresses. Open the site through its link instead. |
| A new folder does not show up | `files.json` was not updated. Add the name or run the script, then clear the cache or open a private tab. |
| A subfolder shows an old list | That folder's own `files.json` is outdated. Update it or delete it. |
| Clicking a card shows a blank page or 404 | That folder has no `index.html`. |

---

## Built with

- HTML, CSS and plain JavaScript (no frameworks or external libraries)
- `files.json` manifest plus an optional Node.js script
- Any static hosting
