# Ians Biashara Grid

An online shop for home and kitchen appliances, computer accessories, electronics and IT services.
Customers pay with **Safaricom M-Pesa** or **Airtel Money**: the site sends a payment prompt to their phone and they confirm with their PIN.
Plain HTML, CSS and JavaScript, plus small serverless functions in `api/`.

## Why two payment systems?
Safaricom's Daraja STK Push only works for Safaricom lines. Airtel lines need Airtel's own API (Airtel Money Open API).
The checkout suggests the network from the number prefix and the customer can change it. The server routes the request to the right provider.

## Files
| File | What it does |
|---|---|
| `index.html`, `styles.css` | Page and design |
| `products.js` | **Edit this** to change products, prices and icons |
| `app.js` | Search, cart, checkout and the terminal-style payment log |
| `api/pay.js` | Picks Safaricom or Airtel and sends the prompt |
| `api/status.js` | Checks whether the customer paid |
| `api/callback.js` | Receives the provider's final result |
| `api/_mpesa.js`, `api/_airtel.js` | Talk to Daraja and to Airtel |

## Step 1: Put it on GitHub
1. On github.com click **New repository** (e.g. `ians-biashara-grid`, Public).
2. Click **uploading an existing file**, drag in everything from this folder (keep the `api` folder), then **Commit changes**.

## Step 2a: Quick shareable link (demo mode)
**Settings → Pages → Deploy from a branch → `main` / root → Save.** Link: `https://YOUR-USERNAME.github.io/ians-biashara-grid/`.
GitHub Pages cannot run the `api` folder, so checkout **simulates** payments for both networks. Good for showing the design.

## Step 2b: Real payments on test credentials
1. **Safaricom:** at developer.safaricom.co.ke go to **My Apps → Add a new app** (tick the sandbox M-Pesa options), copy the Consumer Key and Secret. Under **APIs → M-Pesa Express → Simulate** copy the sandbox Passkey. Test shortcode: `174379`. Test number: `254708374149`.
2. **Airtel:** at developers.airtel.africa create an account and an app, add the Collection API product, and copy the client ID and secret. Test (UAT) access and live access depend on Airtel approving your account, and their exact field names may change, so check their current docs if a request fails.
3. At vercel.com sign in with GitHub, **Add New → Project**, import the repo. Under **Environment Variables** add the names from `.env.example`.
4. Click **Deploy**. Share the link Vercel gives you (like `https://ians-biashara-grid.vercel.app`).
5. To see Airtel's final result also set `https://YOUR-LINK/api/callback` as the callback URL in the Airtel portal.

**Good to know:** sandboxes do not ring real phones. Results show in the terminal panel and in Vercel's **Logs** tab. If you only have Safaricom credentials, Safaricom payments work and Airtel ones show an error message. Going live needs a real Paybill/Till from Safaricom and an Airtel merchant account. Never commit real keys: keep them in Vercel only.
