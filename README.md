# Kazek University website

Public website of the Kazek University Institute of Technology and Management
(React + Vite + Tailwind CSS, hosted on Vercel).

- Design follows the reference layout chosen by the school (ESSEC Douala style).
- English / French (src/i18n/en.json, fr.json).
- Programmes, fees and admission dates come live from the Kazek portal's public
  feed (`/api/public/...`). A saved copy in `src/data/` is shown if the portal
  cannot be reached.
- "Apply" and "Portal" buttons go to the portal (src/config.js). Set
  `VITE_PORTAL_URL` in Vercel if the portal address changes.

```bash
npm install
npm run dev      # local preview at http://localhost:5173
npm run build    # production build in dist/
```
