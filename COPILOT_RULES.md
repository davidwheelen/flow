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

*Last Updated: 2025-10-19*
*User: davidwheelen*
