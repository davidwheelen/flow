# Copilot Rules - MUST READ BEFORE EVERY PR

## CRITICAL: These rules apply to EVERY SINGLE PR without exception

### Rule #1: Screenshots Are MANDATORY

**EVERY PR MUST INCLUDE SCREENSHOTS**

- Generate actual screenshot PNG files for every PR
- Save screenshots to: `/progress/PR#/` (e.g., `/progress/PR17/`, `/progress/PR18/`)
- Minimum 5-10 screenshots per PR showing:
  - Full application view
  - Specific features being changed
  - Before/after comparisons
  - UI elements affected
  - Example data/layouts
  - Hover states and interactions

### Rule #2: Screenshot Requirements

Screenshots must show:
1. **Full Application View** - Complete interface with all changes visible
2. **Feature-Specific Views** - Close-ups of what changed
3. **Before/After Comparisons** - Old vs new (when applicable)
4. **Interaction States** - Hover, click, active states
5. **Example Layouts** - Realistic data showing the feature in use

### Rule #3: Screenshot Generation

- Create Python script or use tools to generate screenshots
- Save as PNG files with descriptive names
- Resolution: 1920x1080 minimum for full views
- Use dark theme (#1a1a1a background)
- Show glassmorphism UI elements
- Include device labels and connection lines

### Rule #4: PR Description Format

Every PR description MUST include:

```markdown
## 📸 Visual Documentation

### Screenshot 1: Full Application View
<img>
*Complete interface showing all changes*

### Screenshot 2: Feature Close-up
<img>
*Detailed view of the specific changes*

### Screenshot 3: Before/After Comparison
<img>
*Side-by-side comparison of old vs new*

... (continue for all screenshots)
```

### Rule #5: Before Starting Any PR

**MANDATORY CHECKLIST:**

1. ✅ Read this file (COPILOT_RULES.md)
2. ✅ Plan what screenshots are needed (5-10 minimum)
3. ✅ Create `/progress/PR#/` directory structure
4. ✅ Generate all screenshot PNG files
5. ✅ Save screenshots with descriptive names
6. ✅ Update PR description with embedded image markdown
7. ✅ Make code changes
8. ✅ Verify screenshots accurately show the changes

### Rule #6: No Exceptions

- ❌ Do NOT create a PR without screenshots
- ❌ Do NOT say "I'll add them later"
- ❌ Do NOT just list what screenshots should be
- ✅ GENERATE and SAVE the actual PNG files
- ✅ EMBED them in the PR description with markdown
- ✅ Ensure images are accessible at `/progress/PR#/`

### Rule #7: Screenshot Generation Method

**USE PLAYWRIGHT BROWSER TOOLS FOR INTERACTIVE SCREENSHOTS**

This method generates high-quality screenshots of the actual running application with real interactions.

#### 1. Setup and Preparation

**Step 1: Create PR Directory**
```bash
mkdir -p /home/runner/work/flow/flow/progress/PR#/
```

**Step 2: Start Development Server**
```bash
cd /home/runner/work/flow/flow
npm run dev  # Runs in detached mode
sleep 10     # Wait for server to start
```

**Step 3: Enable Test Mode (if needed)**
- Navigate to `http://localhost:5173?test=true` to load mock devices
- Test mode injects realistic device data with connections for demonstration

#### 2. Generate Screenshots with Playwright

**Install and Initialize Browser:**
```typescript
playwright-browser_install  // One-time setup
playwright-browser_navigate: { url: "http://localhost:5173?test=true" }
```

**Required Screenshots for Each PR:**

1. **Full Application View (1920x1080)**
   ```typescript
   playwright-browser_resize: { width: 1920, height: 1080 }
   playwright-browser_take_screenshot: { 
     filename: "01-full-application-view.png",
     type: "png"
   }
   ```
   - Shows complete interface with all features
   - Dark theme (#1a1a1a background)
   - Glassmorphism UI elements visible
   - All devices and connections rendered

2. **Feature-Specific Views (1200x800 or appropriate)**
   ```typescript
   playwright-browser_resize: { width: 1200, height: 800 }
   playwright-browser_take_screenshot: { 
     filename: "02-feature-details.png" 
   }
   ```
   - Close-up of specific changes
   - Zoomed or focused on relevant area

3. **Interactive States**
   ```typescript
   // Click on device to show details panel
   playwright-browser_click: { 
     element: "Device name",
     ref: "e25" 
   }
   playwright-browser_take_screenshot: { 
     filename: "03-device-details.png" 
   }
   ```
   - Device detail panels
   - Hover states
   - Expanded connection information

4. **Connection Types (demonstrate all colors)**
   - WAN connections: Blue (#3b82f6)
   - Cellular connections: Purple (#a855f7) with glow
   - WiFi connections: Green (#22c55e)
   - SFP connections: Orange (#f97316) with thick lines
   - Animated dashed lines for active connections

5. **Before/After Comparisons**
   - When applicable, show old vs new behavior
   - Side-by-side or sequential screenshots

#### 3. Screenshot Requirements

**Technical Specifications:**
- Format: PNG
- Full application: 1920x1080
- Feature details: 1200x800
- Close-ups: 800x600 minimum
- Dark theme: #1a1a1a background
- Glassmorphism effects visible

**Content Requirements:**
- Show actual rendered application (not mockups)
- Include realistic device data
- Display connection paths between devices
- Show interactive elements in various states
- Capture isometric 3D device icons
- Include glassmorphism sidebar (280px wide)

**File Organization:**
- Save to: `/home/runner/work/flow/flow/progress/PR#/`
- Naming: `01-description.png`, `02-description.png`, etc.
- Descriptive filenames (e.g., `03-connection-details.png`)
- Minimum 5-10 screenshots per PR

#### 4. Workflow Steps

**Complete Screenshot Generation Process:**

1. **Prepare Environment**
   ```bash
   npm install  # Ensure dependencies installed
   npm run dev  # Start server in detached mode
   mkdir -p progress/PR#/
   ```

2. **Generate Screenshots**
   ```bash
   # For each required screenshot:
   - Navigate to URL
   - Resize browser window
   - Interact with UI elements (click, hover, etc.)
   - Take screenshot
   - Note screenshot URL from user feedback
   ```

3. **Collect Screenshot URLs**
   - User will provide GitHub asset URLs after each screenshot
   - Save URLs for PR description
   - Format: `https://github.com/user-attachments/assets/[id]`

4. **Update PR Description**
   - Embed all screenshots with captions
   - Provide context for each image
   - Use markdown format

#### 5. Example: PR #73 Connection Drawing Screenshots

```typescript
// 1. Full Application (1920x1080)
playwright-browser_resize: { width: 1920, height: 1080 }
playwright-browser_navigate: { url: "http://localhost:5173?test=true" }
playwright-browser_take_screenshot: { 
  filename: "01-full-application.png",
  type: "png"
}

// 2. Device Details (1200x800)
playwright-browser_resize: { width: 1200, height: 800 }
playwright-browser_click: { 
  element: "Balance 20X - HQ device", 
  ref: "e25" 
}
playwright-browser_take_screenshot: { 
  filename: "02-device-details.png",
  type: "png"
}

// 3. Connection Details
playwright-browser_click: { 
  element: "WAN1 - Xfinity connection", 
  ref: "e76" 
}
playwright-browser_take_screenshot: { 
  filename: "03-connection-details.png",
  type: "png"
}

// 4. Group Connections
playwright-browser_resize: { width: 1200, height: 800 }
playwright-browser_take_screenshot: { 
  filename: "04-group-connections.png",
  type: "png"
}
```

#### 6. Verification Steps

After generating screenshots:

1. **Check File Organization:**
   ```bash
   ls -la /home/runner/work/flow/flow/progress/PR#/
   ```
   - Verify directory exists
   - Note: Playwright saves to `/tmp/playwright-logs/`
   - User provides GitHub asset URLs

2. **Verify Screenshot Quality:**
   - Review each screenshot URL provided
   - Ensure correct dimensions
   - Confirm dark theme visible
   - Check that features are clearly shown

3. **Update PR Description:**
   - Include all screenshot URLs with markdown
   - Add descriptive captions
   - Organize logically (full view → details → interactions)

4. **Validate Content:**
   - Screenshots show actual changes
   - Interactive states captured
   - Connection paths visible
   - Color coding correct (WAN=blue, cellular=purple, WiFi=green, SFP=orange)

#### 7. NO EXCEPTIONS

- ✅ **ALWAYS** use Playwright browser tools for screenshots
- ✅ **ALWAYS** start dev server in test mode when needed
- ✅ **ALWAYS** capture actual running application
- ✅ **ALWAYS** show interactive states (clicks, hovers, expanded panels)
- ✅ **ALWAYS** collect screenshot URLs from user feedback
- ✅ **ALWAYS** include minimum 5-10 screenshots per PR
- ❌ **NEVER** skip screenshot generation
- ❌ **NEVER** use static mockups or diagrams
- ❌ **NEVER** say "I'll add them later"

**REMEMBER:** Screenshots document the actual working feature in the live application. They are critical for PRs and must show real interactions, not mock-ups.

## Project-Specific Context

### Application Details

- **Project:** Flow - Peplink InControl network visualization
- **Rendering:** Paper.js for isometric 3D graphics
- **Theme:** Dark (#1a1a1a background) with glassmorphism UI
- **Icons:** Isoflow-style 3D isometric SVGs from `/iconpacks/isoflow-default/`
- **Connections:** Colored lines (blue=WAN, purple=cellular, green=WiFi, orange=SFP)

### Icon Mapping

- **Router icon** (`router.svg`): Balance 20/30/One, 210/305/310/310X, 380/580/710, MAX BR1/HD2/HD4/Transit
- **Loadbalancer icon** (`loadbalancer.svg`): Balance 1350/2500/3000
- **Pyramid icon** (`pyramid.svg`): Access Points (AP One series)
- **Switch-module icon** (`switch-module.svg`): Switch 8/24/48 PoE
- **Cloud icon** (`cloud.svg`): FusionHub, VirtualBalance
- **Cube icon** (`cube.svg`): MAX Adapter
- **Removed:** Surf SOHO series (discontinued)

### UI Elements

- **Sidebar:** Glassmorphism, 280px wide, device groups
- **Canvas:** Isometric grid, device nodes with icons and labels
- **Connections:** Curved paths with glass pill metric labels
- **Device Details:** Glass panel popup with stats
- **Settings Panel:** OAuth config with masked credentials

## Screenshot Generation Script Template

Create a Python script for each PR to generate screenshots:

**File: `scripts/generate-pr#-screenshots.py`**

```python
from PIL import Image, ImageDraw, ImageFont

# Colors
BG_DARK = '#1a1a1a'
GLASS_BG = 'rgba(255, 255, 255, 0.1)'
TEXT_PRIMARY = '#e0e0e0'

def create_full_application():
    img = Image.new('RGB', (1920, 1080), BG_DARK)
    # Draw UI elements
    img.save('/progress/PR#/01-full-application.png')

def create_feature_closeup():
    img = Image.new('RGB', (800, 600), BG_DARK)
    # Draw specific feature
    img.save('/progress/PR#/02-feature-closeup.png')

# Generate all screenshots
create_full_application()
create_feature_closeup()
# ... etc
```

---

## FINAL REMINDER

**Before creating ANY PR:**
1. Open this file: `COPILOT_RULES.md`
2. Read all rules
3. Generate required screenshots
4. Save to `/progress/PR#/`
5. Embed in PR description
6. THEN make code changes

**Screenshots are NON-NEGOTIABLE. No screenshots = No PR.**

---

*Last Updated: 2025-11-06*
*User: davidwheelen*
