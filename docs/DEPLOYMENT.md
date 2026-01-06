# Deployment Guide

How to deploy Invoice Suite to Google Apps Script.

## Prerequisites

- Node.js 18+
- pnpm
- Google account
- [clasp](https://github.com/google/clasp) CLI

## Initial Setup

### 1. Install Dependencies

```bash
cd invoice-suite
pnpm install
```

### 2. Login to Google

```bash
npx clasp login
```

This opens a browser window for authentication. Grant the requested permissions.

### 3. Create Apps Script Project

```bash
cd packages/google-addon

# Create new project linked to Sheets
npx clasp create --type sheets --title "Invoice Suite"
```

This creates:
- A new Google Sheet with the script attached
- `.clasp.json` file with your `scriptId`

### 4. Build and Deploy

```bash
# Build the bundle
pnpm build

# Push to Apps Script
npx clasp push
```

### 5. Open and Test

```bash
# Open the project in browser
npx clasp open
```

Or:
1. Open the created Google Sheet
2. Refresh the page
3. Look for "Invoice Suite" in the Extensions menu

## Project Structure After Build

```
dist/
├── Code.js           # Bundled JavaScript
├── appsscript.json   # Manifest with scopes
└── sidebar.html      # UI template
```

## Updating the Add-on

After making changes:

```bash
# Rebuild and push
pnpm build
npx clasp push

# Or use the combined command
pnpm push
```

## Development Workflow

### Watch Mode

For active development:

```bash
# Terminal 1: Watch source files
pnpm build:watch

# Terminal 2: Push on changes
npx clasp push --watch
```

### View Logs

```bash
npx clasp logs
```

Or use the Apps Script editor's "Executions" panel.

## Deploying to Multiple Accounts

### Testing Account

1. Create project with `clasp create`
2. Use `.clasp.json` as-is

### Production Account

1. Login to production account: `clasp login`
2. Create new project or use existing
3. Update `.clasp.json` with production `scriptId`

### Multiple Environments

Create separate config files:

```bash
# .clasp.dev.json
{ "scriptId": "dev-script-id", "rootDir": "./dist" }

# .clasp.prod.json
{ "scriptId": "prod-script-id", "rootDir": "./dist" }

# Deploy to dev
CLASP_CONFIG=.clasp.dev.json npx clasp push

# Deploy to prod
CLASP_CONFIG=.clasp.prod.json npx clasp push
```

## Publishing to Marketplace (Optional)

### 1. Prepare for Review

- Test thoroughly with multiple accounts
- Ensure all scopes are necessary and documented
- Add privacy policy URL
- Add screenshots and descriptions

### 2. Configure for Marketplace

Update `appsscript.json`:

```json
{
  "addOns": {
    "common": {
      "name": "Invoice Suite",
      "logoUrl": "https://your-domain.com/logo.png",
      "homepageTrigger": {
        "runFunction": "onOpen"
      }
    }
  }
}
```

### 3. Create OAuth Consent Screen

1. Go to Google Cloud Console
2. APIs & Services → OAuth consent screen
3. Fill in app information
4. Add required scopes

### 4. Submit for Review

1. Go to Google Workspace Marketplace SDK
2. Enable the API
3. Configure listing
4. Submit for review

See `docs/MARKETPLACE.md` for detailed instructions.

## Troubleshooting

### "Script not found" error

- Check `.clasp.json` has correct `scriptId`
- Ensure you're logged into the correct Google account

### "Authorization required" error

- Open the script in browser
- Run any function manually to trigger auth flow
- Grant requested permissions

### Changes not appearing

- Clear browser cache
- Hard refresh the Sheet (Ctrl+Shift+R)
- Check `clasp push` completed successfully

### Build errors

```bash
# Clean and rebuild
pnpm clean
pnpm build
```

### Scope errors

If you get "Insufficient permissions":
1. Open Apps Script editor
2. Go to Project Settings
3. Check "Show appsscript.json manifest file"
4. Verify scopes in manifest

## Security Notes

### API Keys and Secrets

- Never commit `.clasp.json` with production `scriptId`
- Add to `.gitignore`:
  ```
  .clasp.json
  .clasprc.json
  ```

### User Data

- All settings stored in user's own Google account
- No external servers involved
- Only requested scopes are used

### Template Access

- Templates must be accessible to the user generating invoices
- Consider using a shared company template in Google Drive
