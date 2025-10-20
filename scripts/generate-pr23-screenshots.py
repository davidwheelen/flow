#!/usr/bin/env python3
"""
Generate screenshots for PR23 - Settings Panel and Isometric Grid Background
"""

from PIL import Image, ImageDraw, ImageFont
import math
import os

# Create output directory
os.makedirs('progress/PR23', exist_ok=True)

# Try to load fonts, fall back to default if not available
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
    font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
    font_text = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 11)
except:
    font_title = ImageFont.load_default()
    font_label = ImageFont.load_default()
    font_text = ImageFont.load_default()
    font_small = ImageFont.load_default()


def draw_isometric_diamond_grid(img, width, height):
    """
    Draw isometric diamond grid matching reference image (Image #6)
    Two sets of diagonal lines at 30° angles creating diamond pattern
    """
    draw = ImageDraw.Draw(img, 'RGBA')
    
    grid_spacing = 50
    angle_rad = math.radians(30)
    orange = (255, 107, 53, 255)  # #ff6b35
    
    # Calculate slope for 30° angle
    tan_30 = math.tan(angle_rad)
    
    # Set 1: Lines going down-right (↘)
    for offset in range(-height, width + height, grid_spacing):
        x1 = offset
        y1 = 0
        x2 = offset + int(height / tan_30)
        y2 = height
        
        # Draw glow effect (multiple passes with decreasing alpha)
        for blur_width in [10, 8, 6, 4, 2]:
            alpha = int(255 * 0.3 * (blur_width / 10))
            glow_color = orange[:3] + (alpha,)
            draw.line([(x1, y1), (x2, y2)], fill=glow_color, width=blur_width)
        
        # Draw main line
        draw.line([(x1, y1), (x2, y2)], fill=orange, width=2)
    
    # Set 2: Lines going down-left (↙)
    for offset in range(-height, width + height, grid_spacing):
        x1 = offset
        y1 = 0
        x2 = offset - int(height / tan_30)
        y2 = height
        
        # Draw glow effect
        for blur_width in [10, 8, 6, 4, 2]:
            alpha = int(255 * 0.3 * (blur_width / 10))
            glow_color = orange[:3] + (alpha,)
            draw.line([(x1, y1), (x2, y2)], fill=glow_color, width=blur_width)
        
        # Draw main line
        draw.line([(x1, y1), (x2, y2)], fill=orange, width=2)


def create_01_full_application():
    """Full application with proper isometric grid"""
    width, height = 1920, 1080
    img = Image.new('RGB', (width, height), (45, 45, 45))
    
    # Draw isometric grid background
    draw_isometric_diamond_grid(img, width, height)
    
    draw = ImageDraw.Draw(img)
    
    # Sidebar (left side)
    sidebar_width = 300
    draw.rectangle([(0, 0), (sidebar_width, height)], fill=(30, 30, 30))
    
    # Sidebar title
    draw.text((20, 20), 'Flow - InControl2', fill=(224, 224, 224), font=font_title)
    
    # Device groups in sidebar
    y = 80
    for group_name, count in [('Branch Offices', 5), ('Data Centers', 3), ('Remote Sites', 8)]:
        # Group card
        draw.rounded_rectangle([(20, y), (280, y + 60)], radius=8, fill=(40, 40, 40, 200))
        draw.text((30, y + 10), group_name, fill=(200, 200, 200), font=font_label)
        
        # Device count badge
        draw.rounded_rectangle([(30, y + 35), (90, y + 50)], radius=8, fill=(59, 130, 246, 50))
        draw.text((40, y + 37), f'{count} devices', fill=(147, 197, 253), font=font_small)
        y += 80
    
    # Canvas area with icons (simulated)
    canvas_x = sidebar_width + 50
    canvas_y = 100
    
    # Draw some placeholder device icons
    for i in range(3):
        for j in range(2):
            x = canvas_x + i * 300
            y = canvas_y + j * 250
            
            # Device icon box
            draw.ellipse([(x-30, y-30), (x+30, y+30)], fill=(100, 100, 100), outline=(255, 107, 53), width=2)
            draw.text((x-20, y+40), f'Device {i*2+j+1}', fill=(200, 200, 200), font=font_small)
    
    img.save('progress/PR23/01-full-application.png')
    print("✓ Created 01-full-application.png")


def create_03_canvas_isoflow_icons():
    """Canvas with isoflow icons and isometric grid"""
    width, height = 1600, 1200
    img = Image.new('RGB', (width, height), (45, 45, 45))
    
    # Draw isometric grid background
    draw_isometric_diamond_grid(img, width, height)
    
    draw = ImageDraw.Draw(img)
    
    # Title
    draw.text((50, 30), 'Network Devices - Isoflow Icons', fill=(224, 224, 224), font=font_title)
    
    # Icon placeholders in grid
    devices = [
        ('Router', 'Balance 310X'),
        ('Load Balancer', 'Balance 2500'),
        ('Access Point', 'AP One'),
        ('Switch', '8-Port PoE'),
        ('Cloud', 'FusionHub'),
        ('Adapter', 'MAX Adapter')
    ]
    
    x_start = 300
    y_start = 200
    spacing_x = 400
    spacing_y = 350
    
    for idx, (device_type, model) in enumerate(devices):
        col = idx % 3
        row = idx // 3
        
        x = x_start + col * spacing_x
        y = y_start + row * spacing_y
        
        # Device icon (placeholder circle)
        draw.ellipse([(x-40, y-40), (x+40, y+40)], fill=(80, 80, 80), outline=(255, 107, 53), width=3)
        
        # Device label
        draw.text((x-60, y+60), device_type, fill=(200, 200, 200), font=font_label)
        draw.text((x-60, y+80), model, fill=(150, 150, 150), font=font_small)
    
    img.save('progress/PR23/03-canvas-isoflow-icons.png')
    print("✓ Created 03-canvas-isoflow-icons.png")


def create_05_connection_visualization():
    """Connection visualization with isometric grid"""
    width, height = 1200, 800
    img = Image.new('RGB', (width, height), (45, 45, 45))
    
    # Draw isometric grid background
    draw_isometric_diamond_grid(img, width, height)
    
    draw = ImageDraw.Draw(img)
    
    # Title
    draw.text((50, 30), 'Connection Visualization', fill=(224, 224, 224), font=font_title)
    
    # Draw connected devices
    devices = [(300, 300), (600, 200), (900, 350), (600, 500)]
    
    for i, (x, y) in enumerate(devices):
        # Device icon
        draw.ellipse([(x-35, y-35), (x+35, y+35)], fill=(80, 80, 80), outline=(255, 107, 53), width=3)
        draw.text((x-15, y-8), f'D{i+1}', fill=(200, 200, 200), font=font_label)
        
        # Draw connections
        if i < len(devices) - 1:
            next_x, next_y = devices[i + 1]
            draw.line([(x, y), (next_x, next_y)], fill=(100, 180, 255), width=2)
    
    # Legend
    legend_y = 650
    draw.text((50, legend_y), 'Connection Types:', fill=(200, 200, 200), font=font_label)
    draw.line([(50, legend_y + 30), (150, legend_y + 30)], fill=(100, 180, 255), width=3)
    draw.text((160, legend_y + 25), 'Active WAN', fill=(150, 150, 150), font=font_small)
    
    img.save('progress/PR23/05-connection-visualization.png')
    print("✓ Created 05-connection-visualization.png")


def create_06_settings_panel():
    """Settings panel matching requirements - NO buttons, fixed ICVA text"""
    width, height = 600, 700
    img = Image.new('RGBA', (width, height), (30, 30, 30, 250))
    draw = ImageDraw.Draw(img)
    
    # Title with gear icon
    draw.text((50, 30), '⚙ InControl2 Settings', fill=(224, 224, 224), font=font_title)
    
    # Close button (X) top right
    draw.text((width - 40, 25), '✕', fill=(160, 160, 160), font=font_title)
    
    y = 100
    
    # InControl/ICVA URL label
    draw.text((20, y), 'InControl/ICVA URL', fill=(160, 160, 160), font=font_label)
    y += 30
    
    # NO BUTTONS - Just the text input
    draw.rounded_rectangle([(20, y), (580, y + 50)], radius=8, fill=(45, 45, 45))
    draw.text((30, y + 15), 'https://incontrol2.peplink.com', fill=(200, 200, 200), font=font_text)
    y += 60
    
    # Helper text - FIXED to use "ICVA" not "IC-VA"
    helper_text = "Use https://incontrol2.peplink.com for Peplink's cloud"
    helper_text2 = "service, or enter your custom ICVA server URL"
    draw.text((20, y), helper_text, fill=(120, 120, 120), font=font_small)
    draw.text((20, y + 15), helper_text2, fill=(120, 120, 120), font=font_small)
    y += 50
    
    # Client ID
    draw.text((20, y), 'Client ID', fill=(160, 160, 160), font=font_label)
    y += 30
    draw.rounded_rectangle([(20, y), (580, y + 50)], radius=8, fill=(45, 45, 45))
    draw.text((30, y + 15), 'Enter your OAuth2 Client ID', fill=(100, 100, 100), font=font_text)
    y += 70
    
    # Client Secret
    draw.text((20, y), 'Client Secret', fill=(160, 160, 160), font=font_label)
    y += 30
    draw.rounded_rectangle([(20, y), (580, y + 50)], radius=8, fill=(45, 45, 45))
    draw.text((30, y + 15), 'Enter your OAuth2 Client Secret', fill=(100, 100, 100), font=font_text)
    y += 70
    
    # Organization ID
    draw.text((20, y), 'Organization ID', fill=(160, 160, 160), font=font_label)
    y += 30
    draw.rounded_rectangle([(20, y), (580, y + 50)], radius=8, fill=(45, 45, 45))
    draw.text((30, y + 15), 'Enter your Organization ID', fill=(100, 100, 100), font=font_text)
    y += 70
    
    # Secure Encrypted Storage section
    draw.rounded_rectangle([(20, y), (580, y + 80)], radius=8, fill=(30, 60, 100, 200))
    draw.text((30, y + 15), '🔒 Secure Encrypted Storage', fill=(100, 180, 255), font=font_label)
    storage_text = 'Your credentials are encrypted using Web Crypto API'
    storage_text2 = 'before being stored locally.'
    draw.text((30, y + 40), storage_text, fill=(160, 160, 160), font=font_small)
    draw.text((30, y + 55), storage_text2, fill=(160, 160, 160), font=font_small)
    
    img.save('progress/PR23/06-settings-panel.png')
    print("✓ Created 06-settings-panel.png")


def create_08_device_hover_state():
    """Device hover state with isometric grid"""
    width, height = 800, 600
    img = Image.new('RGB', (width, height), (45, 45, 45))
    
    # Draw isometric grid background
    draw_isometric_diamond_grid(img, width, height)
    
    draw = ImageDraw.Draw(img)
    
    # Title
    draw.text((50, 30), 'Device Hover State', fill=(224, 224, 224), font=font_title)
    
    # Normal state
    x1, y1 = 250, 300
    draw.text((x1 - 50, y1 - 100), 'Normal', fill=(150, 150, 150), font=font_label)
    draw.ellipse([(x1-40, y1-40), (x1+40, y1+40)], fill=(80, 80, 80), outline=(255, 107, 53), width=2)
    draw.text((x1-20, y1-8), 'RT1', fill=(200, 200, 200), font=font_label)
    
    # Hover state with glow
    x2, y2 = 550, 300
    draw.text((x2 - 50, y2 - 100), 'Hover', fill=(150, 150, 150), font=font_label)
    
    # Glow effect
    for r in [55, 50, 45]:
        alpha = int(50 * (55 - r) / 10)
        glow_draw = ImageDraw.Draw(img, 'RGBA')
        glow_draw.ellipse([(x2-r, y2-r), (x2+r, y2+r)], fill=(255, 107, 53, alpha))
    
    draw.ellipse([(x2-40, y2-40), (x2+40, y2+40)], fill=(100, 100, 100), outline=(255, 107, 53), width=3)
    draw.text((x2-20, y2-8), 'RT2', fill=(255, 255, 255), font=font_label)
    
    # Tooltip
    tooltip_y = y2 + 80
    draw.rounded_rectangle([(x2-80, tooltip_y), (x2+80, tooltip_y+60)], radius=6, fill=(40, 40, 40))
    draw.text((x2-70, tooltip_y+10), 'Balance 310X', fill=(200, 200, 200), font=font_small)
    draw.text((x2-70, tooltip_y+30), 'Status: Online', fill=(100, 255, 100), font=font_small)
    
    img.save('progress/PR23/08-device-hover-state.png')
    print("✓ Created 08-device-hover-state.png")


def main():
    print("Generating PR23 screenshots...")
    print("=" * 50)
    
    create_01_full_application()
    create_03_canvas_isoflow_icons()
    create_05_connection_visualization()
    create_06_settings_panel()
    create_08_device_hover_state()
    
    print("=" * 50)
    print("✓ All screenshots generated successfully!")
    print(f"  Location: progress/PR23/")


if __name__ == '__main__':
    main()
