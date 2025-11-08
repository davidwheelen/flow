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

**ALWAYS USE THE GITHUB CODING AGENT FOR SCREENSHOTS**

This is the ONLY acceptable method for generating screenshots for PRs.

#### 1. Use the `github-coding-agent-` tool with these parameters:

```typescript
{
  repository: "davidwheelen/flow",
  branch: "current-branch-name",
  problem_statement: `Generate screenshots for PR #X showing:
    
    1. Full application view (1920x1080)
       - Dark theme (#1a1a1a background)
       - Glassmorphism UI elements
       - Complete interface with all changes visible
    
    2. Feature-specific views (800x600 or appropriate size)
       - Close-ups of what changed
       - Specific UI components affected
    
    3. Before/After comparisons (side-by-side if applicable)
       - Old vs new interface
       - Highlight specific differences
    
    4. Interaction states
       - Hover states
       - Active/clicked states
       - Different data scenarios
    
    5. Example layouts with realistic data
       - Device connections (blue=WAN, purple=cellular, green=WiFi, orange=SFP)
       - Isoflow-style 3D isometric icons from /iconpacks/isoflow-default/
       - Glassmorphism sidebar (280px wide)
    
    Requirements:
    - Save all screenshots to /progress/PR#/ directory
    - Use descriptive filenames (e.g., 01-full-application.png, 02-feature-closeup.png)
    - Minimum 5-10 screenshots per PR
    - PNG format with appropriate resolutions
    - Ensure images show the actual changes being made in this PR
    
    After generating screenshots:
    - Update PR description with embedded images using markdown
    - Include captions for each screenshot
    - Verify all images are accessible and properly formatted`
}
```

#### 2. The coding agent will:

- Create `/progress/PR#/` directory structure
- Generate all required screenshots with proper dimensions
- Use correct colors and styling matching the application
- Apply dark theme (#1a1a1a) and glassmorphism effects
- Add screenshots to the repository
- Update PR description with embedded images and captions
- Ensure all images are accessible via relative paths

#### 3. NO EXCEPTIONS:

- ❌ **NEVER** try to create screenshots manually
- ❌ **NEVER** use other tools or methods (including Python scripts)
- ❌ **NEVER** skip or postpone screenshot generation
- ❌ **NEVER** say "I'll add screenshots later"
- ✅ **ALWAYS** use the github-coding-agent- tool for EVERY PR
- ✅ **ALWAYS** generate screenshots BEFORE making code changes
- ✅ **ALWAYS** include the complete problem_statement with all requirements

#### 4. Verification Steps:

After the coding agent completes:

1. **Check Directory Structure:**
   ```bash
   ls -la /progress/PR#/
   ```
   - Verify all screenshot PNG files exist
   - Confirm descriptive filenames are used

2. **Verify Screenshot Content:**
   - Open each screenshot to ensure it matches the requirements
   - Check dimensions (1920x1080 for full views, appropriate sizes for others)
   - Verify dark theme and styling are correct

3. **Confirm PR Description:**
   - PR description includes all screenshots with markdown embeds
   - Each screenshot has a descriptive caption
   - Images are properly formatted and accessible

4. **Validate Image Quality:**
   - Screenshots show actual changes made in the PR
   - Images are clear and readable
   - All UI elements are visible and properly rendered

**REMEMBER:** The github-coding-agent- tool is the ONLY approved method. Do not deviate from this process under any circumstances.

## CRITICAL: Timestamp and Date Handling

**These rules apply to ALL interactions and MUST be followed without exception:**

1. **NEVER display or reference:**
   - Current date/time
   - Timestamps
   - Future/past dates
   - User login times
   - Time zones
   - Date corrections
   - ANY time-related information

2. **FOCUS SOLELY ON:**
   - User requests
   - Technical implementation
   - Problem solving
   - Feature development

**This rule applies to:**
- All PR descriptions and commits
- All responses to users
- All code comments
- All documentation
- All status updates

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

## ADDENDUM 2: Repository and Path Handling

### Critical Rules for Repository References

1. Repository Format
   - MUST use "owner/repo" format
   - Example: "davidwheelen/flow"
   - NEVER use placeholder names ("your-repo-name")
   - NEVER use assumed paths ("path/to/file")

2. File Path Verification
   - MUST verify paths using githubread before operations
   - MUST use exact paths from repository structure
   - NEVER assume directory structures
   - ALWAYS use full, verified paths

3. Tool-Specific Requirements
   - github-coding-agent-: MUST use "owner/repo" format
   - githubwrite: MUST verify paths before operations
   - semantic-code-search: MUST include both owner and repo
   - lexical-code-search: MUST specify correct repository scope

❌ Do NOT use placeholder repository names
❌ Do NOT assume file paths exist
❌ Do NOT skip path verification
✅ DO verify paths before operations
✅ DO use exact repository references
✅ DO maintain consistent formatting
