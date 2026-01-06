# Google Workspace Marketplace Publishing

Optional guide for publishing Invoice Suite to the Google Workspace Marketplace.

## Overview

Publishing to the Marketplace allows:
- Public distribution (anyone can install)
- Organization-wide deployment (Google Workspace admins)
- Discoverability through Marketplace search

**Note**: For personal use or small teams, you don't need to publish. Just deploy with `clasp push` and share the Sheet.

## Prerequisites

- Google Cloud Platform project
- OAuth consent screen configured
- Completed and tested add-on
- Privacy policy URL
- Support email

## Step 1: Create GCP Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Note the project number (you'll need it later)

## Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services → OAuth consent screen**
2. Choose user type:
   - **Internal**: Only your organization (Workspace accounts)
   - **External**: Anyone with Google account (requires verification)

3. Fill in app information:
   - App name: `Invoice Suite`
   - User support email: your email
   - App logo: 512x512 PNG
   - Application home page: your website
   - Privacy policy link: required
   - Terms of service link: optional

4. Add scopes:
   ```
   https://www.googleapis.com/auth/spreadsheets.currentonly
   https://www.googleapis.com/auth/documents
   https://www.googleapis.com/auth/drive.file
   https://www.googleapis.com/auth/script.container.ui
   ```

5. Add test users (for External apps during testing)

## Step 3: Enable Marketplace SDK

1. Go to **APIs & Services → Library**
2. Search for "Google Workspace Marketplace SDK"
3. Enable it

## Step 4: Configure Marketplace SDK

1. Go to **APIs & Services → Google Workspace Marketplace SDK**
2. Click **App Configuration**

### App Configuration

**App visibility:**
- Private (your domain only)
- Public (anyone)

**App integration:**
- Sheets add-on
- Editor add-on

**OAuth scopes:** (same as consent screen)

**Extensions:**
```
Sheets homepageTrigger: onOpen
```

### Store Listing

**App details:**
- Application name: Invoice Suite
- Short description (under 80 chars): Generate professional PDF invoices from Google Sheets
- Detailed description: Full marketing copy

**Graphics:**
- Application icon: 128x128 PNG
- Screenshots: At least 1, recommended 3-5
- Banner (optional): 220x140 PNG

**Links:**
- Terms of service URL
- Privacy policy URL
- Support URL

**Category:**
- Business Tools
- Productivity

## Step 5: Link Apps Script Project

1. Open your Apps Script project
2. Go to **Project Settings**
3. Find "Google Cloud Platform (GCP) Project"
4. Click "Change project"
5. Enter your GCP project number

## Step 6: Deploy as Add-on

In Apps Script editor:

1. Click **Deploy → New deployment**
2. Select type: **Add-on**
3. Description: "Initial release" or version notes
4. Click **Deploy**
5. Note the Deployment ID

## Step 7: Test Installation

1. Go to your Marketplace SDK configuration
2. Under "Test installation", get the install link
3. Test installing on a fresh account
4. Verify all features work

## Step 8: Submit for Review

**For External apps:**

1. Complete OAuth consent screen verification
   - May require security assessment
   - Can take several weeks

2. Submit app in Marketplace SDK
   - Review typically takes 1-2 weeks
   - May receive feedback requiring changes

**For Internal apps:**
- Can publish immediately to your organization
- No external review required

## Step 9: Publish

Once approved:

1. Return to Marketplace SDK
2. Click **Publish**
3. App appears in Marketplace within 24 hours

## Maintaining the Listing

### Updates

1. Make code changes
2. Create new Apps Script deployment
3. Test thoroughly
4. Update Marketplace listing if needed

### Responding to Reviews

- Monitor Marketplace reviews
- Respond to user feedback
- Address issues promptly

## Privacy Policy Template

Your privacy policy should cover:

```markdown
# Invoice Suite Privacy Policy

## Data Collection
Invoice Suite accesses only the data you explicitly provide:
- Invoice data in your Google Sheet
- Template document you specify
- Output folder you configure

## Data Storage
- Settings stored in your Google account (UserProperties)
- No data sent to external servers
- All processing happens within Google services

## Data Sharing
- No data shared with third parties
- Generated PDFs stored in your Google Drive

## Permissions Used
- spreadsheets.currentonly: Read invoice data from active sheet
- documents: Create invoices from your template
- drive.file: Save generated PDFs
- script.container.ui: Display sidebar interface

## Contact
For questions: your-email@example.com
```

## Cost Considerations

- **Marketplace listing**: Free
- **Google Cloud**: Free tier usually sufficient
- **Custom domain** (for privacy policy): ~$12/year
- **OAuth verification** (for external apps): May require paid security assessment

## Alternatives to Marketplace

If Marketplace publishing seems heavy:

1. **Direct sharing**: Share the bound Sheet with users
2. **Standalone script**: Users copy and configure themselves
3. **Internal deployment**: Workspace admin installs for organization

## Resources

- [Marketplace SDK documentation](https://developers.google.com/workspace/marketplace)
- [Apps Script add-on documentation](https://developers.google.com/apps-script/add-ons)
- [OAuth verification guide](https://support.google.com/cloud/answer/9110914)
