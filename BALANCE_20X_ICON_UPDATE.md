# Balance 20X Router Icon Update Instructions

## Overview
This document explains how to update the Balance 20X router icon with a custom base64 image.

## Current Status
✅ LAN ports display with Bootstrap Ethernet icons - COMPLETE
✅ LAN port card layout (Port Name | Status/IP) - COMPLETE  
✅ LAN port filter (virtualType !== 'wan') - COMPLETE
✅ Test data with proper LAN interfaces - COMPLETE
⏳ Balance 20X router icon - PENDING base64 image from user

## How to Update the Balance 20X Icon

### Option 1: Create SVG with Embedded Base64 Image (Recommended)

1. Create a new file: `/public/iconpacks/isoflow-default/balance-20x.svg`

2. Use this template, replacing `YOUR_BASE64_IMAGE_HERE` with the actual base64 data:

```xml
<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="518" height="477" viewBox="0 0 518 477">
  <image x="0" y="0" width="518" height="477" 
         xlink:href="data:image/png;base64,YOUR_BASE64_IMAGE_HERE"
         style="background: transparent;" />
</svg>
```

3. Update `/src/data/deviceSpecifications.ts`:

Change line 32 from:
```typescript
icon: 'router',
```
to:
```typescript
icon: 'balance-20x',
```

### Option 2: Direct Data URI (Alternative)

Modify `/src/utils/deviceIconMapping.ts` to handle the Balance 20X as a special case:

```typescript
export const getDeviceIconUrl = (model: string): string => {
  // Normalize model name by removing "Peplink " prefix if present
  const normalizedModel = model.replace(/^Peplink\s+/i, '').trim();
  
  // Special case for Balance 20X with base64 image
  if (normalizedModel.toLowerCase() === 'balance 20x') {
    return 'data:image/png;base64,YOUR_BASE64_IMAGE_HERE';
  }
  
  const spec = deviceSpecifications.find(
    (s) => s.model.toLowerCase() === normalizedModel.toLowerCase()
  );
  
  if (!spec) {
    return '/iconpacks/isoflow-default/cube.svg';
  }

  return `/iconpacks/isoflow-default/${spec.icon}.svg`;
};
```

## Testing

After updating the icon:

1. Build the project:
   ```bash
   npm run build
   ```

2. Test with the test data:
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173?test=true`

3. Click on "Balance 20X - HQ Router" to verify the new icon appears

## Screenshot Requirements

After updating the icon, take a complete screenshot of the Balance 20X device details panel showing:
- The new router icon in the device node on the canvas
- The complete details window from top to bottom
- All LAN ports fully visible

## Current Implementation

All other requirements have been implemented:
- ✅ Bootstrap Ethernet icon with both SVG paths
- ✅ Green (connected) vs Gray (disconnected) colors
- ✅ LAN port card layout with Port Name | Status/IP
- ✅ Filter excludes WAN interfaces (virtualType !== 'wan')
- ✅ WAN connections retain original UI
- ✅ Complete screenshots provided

Only the Balance 20X router icon is pending the base64 image.
