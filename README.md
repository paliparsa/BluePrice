# BlueGate - Static VPN Landing Page 🚀

A highly customizable, blazing-fast, and completely static landing page designed for VPN/Proxy sellers. It features a stunning UI, multi-language support, a built-in Admin Panel for live configuration changes, and runs 100% free on GitHub Pages!

## ✨ Features

- **Completely Static:** Built with Vanilla HTML, CSS, and JS. No backend required!
- **Dynamic Configuration:** Everything (plans, pricing, texts, links, FAQs) is driven by a single `config.json` file.
- **Built-in Admin Panel:** Edit your site live! The admin panel includes a real-time preview and instantly updates your site's JSON configuration.
- **High Security:** The Admin Panel is protected by Password + 2FA (TOTP like Google Authenticator). Secrets are securely injected during the build process via GitHub Actions.
- **Dark / Light Mode:** A beautifully crafted, animated UI that seamlessly transitions between dark and light themes.
- **Multi-language Support:** Built-in toggle for English (EN) and Persian (FA). 
- **Discount System:** Built-in promo code logic to apply percentage discounts on the fly.
- **Free Hosting:** Ready to be deployed on GitHub Pages, Cloudflare Pages, Vercel, or Netlify with zero hosting costs.

---

## 🛠 How to Deploy Your Own

Deploying your own instance of BlueGate is easy and entirely free using GitHub Actions and GitHub Pages.

### Step 1: Fork or Clone
Fork this repository to your own GitHub account.

### Step 2: Configure GitHub Actions Permissions
Because the Admin Panel automatically commits changes back to your repository when you click "Save Settings", GitHub Actions needs write permissions.
1. Go to your repository **Settings** -> **Actions** -> **General**.
2. Scroll down to **Workflow permissions**.
3. Select **Read and write permissions** and click Save.

### Step 3: Set Up Security Secrets
To protect the admin panel, you must set up your password and 2FA secrets.
1. Go to your repository **Settings** -> **Secrets and variables** -> **Actions**.
2. Click **New repository secret**.
3. Create a secret named `ADMIN_PASSWORD` and set its value to your desired login password (e.g., `MySuperSecretPassword123`).
4. Create another secret named `ADMIN_2FA_SECRET` and set its value to a Base32 secret key (e.g., `JBSWY3DPEHPK3PXP`). *You can generate one using any authenticator app or online 2FA secret generator.*

### Step 4: Enable GitHub Pages
1. Go to your repository **Settings** -> **Pages**.
2. Under **Build and deployment**, set the Source to **Deploy from a branch**.
3. Select the `gh-pages` branch (this branch will be created automatically by the Action after your first deployment).

### Step 5: Trigger the Initial Build
1. Go to the **Actions** tab in your repository.
2. Select the `Deploy to GitHub Pages` workflow.
3. Click **Run workflow**.

Once the workflow completes, your site will be live at `https://<your-username>.github.io/<repo-name>/`!

---

## ⚙️ Accessing the Admin Panel

The Admin Panel allows you to easily edit site content without touching any code.

1. Go to your live site URL and append `/_p8x2k4m/` to the end. Example: `https://your-username.github.io/bluegate/_p8x2k4m/`
2. You will be prompted to log in.
3. Enter the `ADMIN_PASSWORD` you set in GitHub Secrets.
4. Open your Authenticator app (Google Authenticator, Authy, etc.) using the `ADMIN_2FA_SECRET` you created and enter the current 6-digit code.
5. Make your changes using the graphical editor and hit **Save Settings**.
6. The panel will trigger a GitHub Action to rebuild your site automatically! (Changes usually take ~1 minute to reflect).

> **Tip:** You can rename the `_p8x2k4m` folder to any secret URL path you want to further hide your admin panel from the public!

---

## 🎨 Modifying the Theme

The CSS uses standard Variables for easy theme modifications. Open `index.html` and look for the `:root` and `.light-theme` blocks at the top to change the primary neon colors, backgrounds, and text shades.

```css
  :root {
    --bg-deep: #050a1a;
    --neon-blue: #00b4ff;
    --neon-purple: #a855f7;
    /* ... */
  }
```

## 📜 License
This project is open-source. Feel free to modify, distribute, and use it for your own services!
