# Release Scripts

## Create Historical Releases

This script creates all missing GitHub releases for versions v0.1.0 through v0.13.0.

### Setup

1. Install dependencies:
   ```bash
   cd scripts
   npm install
   ```

2. Create a GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (full control)
   - Copy the token

3. Run the script:
   ```bash
   GITHUB_TOKEN=your_token_here node create-historical-releases.js
   ```

### What it does

Creates 17 releases documenting all PRs from #1 through #117:
- v0.1.0 - Initial Release
- v0.2.0 - Core Renderer
- v0.3.0 - Isoflow Integration
- v0.4.0 - Documentation & Rules
- v0.5.0 - Grid System
- v0.6.0 - Docker & Deployment
- v0.7.0 - OAuth & Error Handling
- v0.8.0 - Security & API Improvements
- v0.9.0 - UI Enhancements
- v0.10.0 - Network Topology
- v0.11.0 - Sidebar & Panels
- v0.12.0 - Connection Visualization & Debugging
- v0.12.1 - Wireless Mesh & Refresh
- v0.12.2 - LAN Port Improvements
- v0.12.3 - LAN Port Detection
- v0.12.4 - Sidebar Collapsible
- v0.13.0 - Versioning & Footer

After running, check: https://github.com/davidwheelen/flow/releases

## Expected Result

✅ Complete version history on GitHub releases page
✅ All PRs documented and categorized by version
✅ Professional release notes for every version
✅ Historical record of project evolution
