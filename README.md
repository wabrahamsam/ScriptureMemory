# Scripture Memory Verses — Emmanuel Believers' Fellowship

A simple, shareable weekly verse page in five languages: NKJV, ESV, Tamil (BSI Old Version), Malayalam (BSI Old Version), and Hindi (BSI Old Version).

## Files

- **index.html** — Archive homepage; lists current week and past weeks
- **weeks/current.html** — The active weekly page (what you share)
- **manifest.js** — Simple config file listing all weeks

## How to Update Each Week

### Step 1: Edit `weeks/current.html`

At the top of the file, look for the `WEEK` object (around line 146). Edit **only this block**:

```javascript
const WEEK = {
  dates: "Jun 21–27",
  ref: "Romans 10:13–15",
  versions: [
    {
      key: "full",
      label: "Full Version",
      ref: "Romans 10:13–15",
      verses: {
        nkjv: [ /* paste lines here */ ],
        esv:  [ /* paste lines here */ ],
        ta:   [ /* paste lines here */ ],
        ml:   [ /* paste lines here */ ],
        hi:   [ /* paste lines here */ ]
      }
    },
    // ... other versions (short, easy) follow the same pattern
  ]
};
```

Replace:
- `dates` — the week's date range
- `ref` — the scripture reference
- Each `verses` array — the verse text, split into lines (each line in backticks)

You can have 1, 2, or 3 versions — tabs will appear/disappear automatically.

### Step 2: Update `manifest.js`

Update the `CURRENT` object with the new week's reference:

```javascript
const CURRENT = {
  ref: "Your new reference here"
};
```

Optionally, move the old week into the `WEEKS` array to create an archive:

```javascript
const WEEKS = [
  { file: "2026-06-27.html", dates: "Jun 21–27", ref: "Romans 10:13–15" },
  // Add more as weeks pass
];
```

If you keep an archive, duplicate `weeks/current.html` and rename it (e.g., `weeks/2026-06-27.html`), then update its data block to reflect the old week.

## Features

- **Share button** — Uses your device's native share sheet (WhatsApp, Messages, etc.) or copies to clipboard
- **Dynamic tabs** — Shows 1–3 version tabs depending on how many you provide that week
- **Responsive** — Works beautifully on phones and desktop
- **No dependencies** — Pure HTML/CSS/JavaScript, very fast

## Hosting (GitHub Pages)

To share this as a link:

1. Create a new GitHub repo (e.g., `verse-memory`)
2. Upload these files (`index.html`, `manifest.js`, `weeks/` folder)
3. Go to repo Settings → Pages → set branch to `main`, folder to `/ (root)`
4. Your link will be: `https://yourusername.github.io/verse-memory`
5. Share that link in Classroom, WhatsApp, etc. — it stays the same every week, you just update the content

## Styling Notes

The design uses a warm, paper-like aesthetic with:
- Serif display font (Source Serif 4) for references
- Clean sans-serif (Source Sans 3) for UI
- Proper fonts for each script: Noto Serif Tamil, Noto Sans Malayalam, Noto Serif Devanagari
- Colored left borders for each language block (helps eyes jump to their language)

All styling is in the `<style>` tag at the top — feel free to adjust colors (CSS variables at `:root`) or fonts if you like.

## Questions?

For each new week, you really only need to:
1. Copy/paste verse text into the `WEEK.versions` arrays
2. Update the dates and references
3. (Optional) Update `manifest.js` if keeping an archive

That's it. The page does the rest.
