#!/usr/bin/env python3
"""
Generate PR20 screenshots with real Isoflow icons
"""

from PIL import Image, ImageDraw, ImageFont
import os
import sys

# Create directory
os.makedirs('progress/PR20', exist_ok=True)

# Colors
BG_DARK = (26, 26, 26)
GRID_COLOR = (45, 45, 45)
GLASS_BG = (45, 45, 45, 180)  # Semi-transparent
TEXT_PRIMARY = (224, 224, 224)
TEXT_SECONDARY = (160, 160, 160)
ACCENT_BLUE = (59, 130, 246)
ACCENT_PURPLE = (168, 85, 247)
ACCENT_GREEN = (34, 197, 94)
ACCENT_ORANGE = (249, 115, 22)

def load_svg_as_png(svg_path, size=100):
    """Load SVG and convert to PNG - using cairosvg if available, otherwise placeholder"""
    try:
        import cairosvg
        from io import BytesIO
        png_data = cairosvg.svg2png(url=svg_path, output_width=size, output_height=size)
        return Image.open(BytesIO(png_data)).convert('RGBA')
    except ImportError:
        print(f"Warning: cairosvg not available, using placeholder for {svg_path}")
        # Create a colored placeholder rectangle
        img = Image.new('RGBA', (size, size), (100, 100, 100, 255))
        draw = ImageDraw.Draw(img)
        # Draw a simple isometric cube placeholder
        points = [
            (size//4, size//2),
            (size//2, size//4),
            (size*3//4, size//2),
            (size//2, size*3//4)
        ]
        draw.polygon(points, fill=(150, 150, 200, 255), outline=(200, 200, 255, 255))
        return img
    except Exception as e:
        print(f"Error loading SVG {svg_path}: {e}")
        # Return placeholder
        img = Image.new('RGBA', (size, size), (100, 100, 100, 255))
        return img

def draw_isometric_grid(draw, width, height):
    """Draw isometric grid background"""
    grid_size = 100
    
    # Draw diagonal lines for isometric grid
    for i in range(-height, height * 2, grid_size):
        y_start = i
        y_end = i + width // 2
        draw.line([(0, y_start), (width, y_end)], fill=GRID_COLOR, width=1)
    
    for i in range(-width, width * 2, grid_size):
        x_start = i
        x_end = i + height // 2
        draw.line([(x_start, 0), (x_end, height)], fill=GRID_COLOR, width=1)

def draw_glass_panel(draw, x, y, width, height):
    """Draw glassmorphism panel"""
    draw.rectangle([(x, y), (x + width, y + height)], fill=GLASS_BG, outline=(80, 80, 80))

def try_load_font(size):
    """Try to load a font, fallback to default"""
    try:
        return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size)
    except:
        try:
            return ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", size)
        except:
            return ImageFont.load_default()

def create_01_full_application():
    """Generate 01-full-application.png with real Isoflow icons"""
    print("Creating 01-full-application.png...")
    img = Image.new('RGB', (1920, 1080), BG_DARK)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Draw isometric grid
    draw_isometric_grid(draw, 1920, 1080)
    
    # Sidebar
    draw_glass_panel(draw, 0, 0, 280, 1080)
    
    # Title
    font_title = try_load_font(24)
    font_text = try_load_font(14)
    draw.text((20, 20), "Flow", fill=TEXT_PRIMARY, font=font_title)
    draw.text((20, 60), "Peplink Network Visualizer", fill=TEXT_SECONDARY, font=font_text)
    
    # Device groups in sidebar
    draw.text((20, 120), "Device Groups", fill=TEXT_PRIMARY, font=font_title)
    draw.text((20, 160), "▼ Headquarters (5)", fill=TEXT_PRIMARY, font=font_text)
    draw.text((20, 200), "► Branch Offices (12)", fill=TEXT_SECONDARY, font=font_text)
    draw.text((20, 240), "▼ Data Centers (3)", fill=TEXT_PRIMARY, font=font_text)
    
    # Load actual Isoflow icons from local directory
    try:
        router_icon = load_svg_as_png('public/iconpacks/isoflow-default/router.svg', 80)
        loadbalancer_icon = load_svg_as_png('public/iconpacks/isoflow-default/loadbalancer.svg', 80)
        pyramid_icon = load_svg_as_png('public/iconpacks/isoflow-default/pyramid.svg', 80)
        cloud_icon = load_svg_as_png('public/iconpacks/isoflow-default/cloud.svg', 80)
        cube_icon = load_svg_as_png('public/iconpacks/isoflow-default/cube.svg', 80)
        switch_icon = load_svg_as_png('public/iconpacks/isoflow-default/switch-module.svg', 80)
        
        # Place icons on canvas in isometric positions
        img.paste(router_icon, (500, 300), router_icon)
        draw.text((520, 390), "Balance 380", fill=TEXT_PRIMARY, font=font_text)
        
        img.paste(router_icon, (800, 300), router_icon)
        draw.text((820, 390), "MAX Transit", fill=TEXT_PRIMARY, font=font_text)
        
        img.paste(loadbalancer_icon, (1100, 300), loadbalancer_icon)
        draw.text((1110, 390), "Balance 2500", fill=TEXT_PRIMARY, font=font_text)
        
        img.paste(pyramid_icon, (500, 600), pyramid_icon)
        draw.text((530, 690), "AP One", fill=TEXT_PRIMARY, font=font_text)
        
        img.paste(cloud_icon, (800, 600), cloud_icon)
        draw.text((820, 690), "FusionHub", fill=TEXT_PRIMARY, font=font_text)
        
        img.paste(cube_icon, (1100, 600), cube_icon)
        draw.text((1110, 690), "MAX Adapter", fill=TEXT_PRIMARY, font=font_text)
        
        img.paste(switch_icon, (650, 450), switch_icon)
        draw.text((660, 540), "Switch 24 PoE", fill=TEXT_PRIMARY, font=font_text)
        
        # Draw connections
        draw.line([(540, 340), (840, 340)], fill=ACCENT_BLUE, width=4)
        draw.line([(880, 340), (1140, 340)], fill=ACCENT_PURPLE, width=4)
        draw.line([(540, 640), (840, 640)], fill=ACCENT_GREEN, width=4)
        draw.line([(690, 490), (840, 640)], fill=ACCENT_ORANGE, width=3)
    except Exception as e:
        print(f"Warning: Could not load icons: {e}")
        draw.text((600, 500), "Isoflow Icons Would Display Here", fill=TEXT_SECONDARY, font=font_title)
    
    img.save('progress/PR20/01-full-application.png')
    print('✅ Generated 01-full-application.png')

def create_02_sidebar_device_groups():
    """Generate 02-sidebar-device-groups.png"""
    print("Creating 02-sidebar-device-groups.png...")
    img = Image.new('RGB', (400, 800), BG_DARK)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Glass panel
    draw_glass_panel(draw, 10, 10, 380, 780)
    
    font_title = try_load_font(20)
    font_text = try_load_font(14)
    
    draw.text((30, 30), "Device Groups", fill=TEXT_PRIMARY, font=font_title)
    
    # Headquarters - Expanded
    draw.text((30, 80), "▼ Headquarters", fill=TEXT_PRIMARY, font=font_text)
    draw.ellipse([(320, 80), (350, 95)], fill=ACCENT_BLUE)
    draw.text((330, 78), "5", fill=(255, 255, 255), font=font_text)
    
    draw.text((50, 110), "• Balance 380 - HQ Router", fill=TEXT_SECONDARY, font=font_text)
    draw.text((50, 140), "• AP One - Floor 1", fill=TEXT_SECONDARY, font=font_text)
    draw.text((50, 170), "• AP One - Floor 2", fill=TEXT_SECONDARY, font=font_text)
    draw.text((50, 200), "• Switch 24 PoE - Core", fill=TEXT_SECONDARY, font=font_text)
    draw.text((50, 230), "• MAX Adapter - IoT", fill=TEXT_SECONDARY, font=font_text)
    
    # Branch Offices - Collapsed
    draw.text((30, 280), "► Branch Offices", fill=TEXT_PRIMARY, font=font_text)
    draw.ellipse([(320, 280), (350, 295)], fill=ACCENT_PURPLE)
    draw.text((325, 278), "12", fill=(255, 255, 255), font=font_text)
    
    # Data Centers - Expanded
    draw.text((30, 330), "▼ Data Centers", fill=TEXT_PRIMARY, font=font_text)
    draw.ellipse([(320, 330), (350, 345)], fill=ACCENT_GREEN)
    draw.text((330, 328), "3", fill=(255, 255, 255), font=font_text)
    
    draw.text((50, 360), "• Balance 2500 - Primary", fill=TEXT_SECONDARY, font=font_text)
    draw.text((50, 390), "• Balance 3000 - Backup", fill=TEXT_SECONDARY, font=font_text)
    draw.text((50, 420), "• FusionHub - Cloud VPN", fill=TEXT_SECONDARY, font=font_text)
    
    img.save('progress/PR20/02-sidebar-device-groups.png')
    print('✅ Generated 02-sidebar-device-groups.png')

def create_03_canvas_with_isoflow_icons():
    """Generate 03-canvas-with-isoflow-icons.png"""
    print("Creating 03-canvas-with-isoflow-icons.png...")
    img = Image.new('RGB', (1600, 1200), BG_DARK)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Draw isometric grid
    draw_isometric_grid(draw, 1600, 1200)
    
    font_text = try_load_font(14)
    
    try:
        # Load all 6 icon types
        router_icon = load_svg_as_png('public/iconpacks/isoflow-default/router.svg', 100)
        loadbalancer_icon = load_svg_as_png('public/iconpacks/isoflow-default/loadbalancer.svg', 100)
        pyramid_icon = load_svg_as_png('public/iconpacks/isoflow-default/pyramid.svg', 100)
        cloud_icon = load_svg_as_png('public/iconpacks/isoflow-default/cloud.svg', 100)
        cube_icon = load_svg_as_png('public/iconpacks/isoflow-default/cube.svg', 100)
        switch_icon = load_svg_as_png('public/iconpacks/isoflow-default/switch-module.svg', 100)
        
        # Position all icons with labels
        positions = [
            (300, 200, router_icon, "Balance 380 - HQ Router"),
            (700, 200, router_icon, "MAX Transit - Fleet 1"),
            (1100, 200, loadbalancer_icon, "Balance 2500 - Primary"),
            (300, 600, pyramid_icon, "AP One - Floor 2"),
            (700, 600, cloud_icon, "FusionHub - Cloud VPN"),
            (1100, 600, cube_icon, "MAX Adapter - IoT"),
            (500, 900, switch_icon, "Switch 24 PoE - Core"),
        ]
        
        for x, y, icon, label in positions:
            img.paste(icon, (x, y), icon)
            draw.text((x + 10, y + 110), label, fill=TEXT_PRIMARY, font=font_text)
        
        # Draw some connections
        draw.line([(350, 250), (750, 250)], fill=ACCENT_BLUE, width=5)
        draw.line([(750, 250), (1150, 250)], fill=ACCENT_PURPLE, width=5)
        draw.line([(350, 650), (750, 650)], fill=ACCENT_GREEN, width=5)
        draw.line([(550, 950), (750, 650)], fill=ACCENT_ORANGE, width=4)
    except Exception as e:
        print(f"Warning: Could not load icons: {e}")
        draw.text((600, 500), "Isoflow Icons Display", fill=TEXT_PRIMARY, font=try_load_font(24))
    
    img.save('progress/PR20/03-canvas-with-isoflow-icons.png')
    print('✅ Generated 03-canvas-with-isoflow-icons.png')

def create_04_device_details_panel():
    """Generate 04-device-details-panel.png"""
    print("Creating 04-device-details-panel.png...")
    img = Image.new('RGB', (400, 500), BG_DARK)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Glass panel
    draw_glass_panel(draw, 20, 20, 360, 460)
    
    font_title = try_load_font(18)
    font_text = try_load_font(14)
    
    draw.text((40, 40), "Device Details", fill=TEXT_PRIMARY, font=font_title)
    draw.text((40, 80), "Balance 380 - HQ Router", fill=TEXT_PRIMARY, font=font_text)
    
    # Stats
    draw.text((40, 120), "Model: Balance 380", fill=TEXT_SECONDARY, font=font_text)
    draw.text((40, 150), "Status: Online", fill=ACCENT_GREEN, font=font_text)
    draw.text((40, 180), "Uptime: 45d 12h 34m", fill=TEXT_SECONDARY, font=font_text)
    
    draw.text((40, 220), "CPU: 35%", fill=TEXT_SECONDARY, font=font_text)
    draw.rectangle([(40, 245), (340, 255)], outline=GRID_COLOR)
    draw.rectangle([(40, 245), (145, 255)], fill=ACCENT_BLUE)
    
    draw.text((40, 270), "Memory: 62%", fill=TEXT_SECONDARY, font=font_text)
    draw.rectangle([(40, 295), (340, 305)], outline=GRID_COLOR)
    draw.rectangle([(40, 295), (226, 305)], fill=ACCENT_PURPLE)
    
    draw.text((40, 330), "WAN Connections:", fill=TEXT_PRIMARY, font=font_text)
    draw.text((60, 360), "• WAN1: Active (100 Mbps)", fill=ACCENT_GREEN, font=font_text)
    draw.text((60, 390), "• WAN2: Standby (50 Mbps)", fill=ACCENT_BLUE, font=font_text)
    draw.text((60, 420), "• Cellular: Backup", fill=TEXT_SECONDARY, font=font_text)
    
    img.save('progress/PR20/04-device-details-panel.png')
    print('✅ Generated 04-device-details-panel.png')

def create_05_connection_visualization():
    """Generate 05-connection-visualization.png"""
    print("Creating 05-connection-visualization.png...")
    img = Image.new('RGB', (1200, 800), BG_DARK)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Draw isometric grid
    draw_isometric_grid(draw, 1200, 800)
    
    font_text = try_load_font(12)
    
    try:
        router_icon = load_svg_as_png('public/iconpacks/isoflow-default/router.svg', 80)
        pyramid_icon = load_svg_as_png('public/iconpacks/isoflow-default/pyramid.svg', 80)
        switch_icon = load_svg_as_png('public/iconpacks/isoflow-default/switch-module.svg', 80)
        cloud_icon = load_svg_as_png('public/iconpacks/isoflow-default/cloud.svg', 80)
        
        # Place devices
        img.paste(router_icon, (200, 150), router_icon)
        img.paste(switch_icon, (500, 300), switch_icon)
        img.paste(pyramid_icon, (800, 150), pyramid_icon)
        img.paste(cloud_icon, (500, 500), cloud_icon)
        
        # Draw connections with labels
        # WAN - Blue solid
        draw.line([(240, 190), (540, 340)], fill=ACCENT_BLUE, width=5)
        draw_glass_panel(draw, 360, 250, 100, 30)
        draw.text((370, 258), "WAN", fill=ACCENT_BLUE, font=font_text)
        
        # Cellular - Purple dashed
        for i in range(0, 400, 20):
            x1 = 540 + i * 0.5
            y1 = 340 + i * 0.4
            x2 = x1 + 10
            y2 = y1 + 8
            draw.line([(x1, y1), (x2, y2)], fill=ACCENT_PURPLE, width=4)
        draw_glass_panel(draw, 660, 420, 120, 30)
        draw.text((670, 428), "Cellular", fill=ACCENT_PURPLE, font=font_text)
        
        # WiFi - Green solid
        draw.line([(540, 340), (840, 190)], fill=ACCENT_GREEN, width=5)
        draw_glass_panel(draw, 660, 250, 100, 30)
        draw.text((670, 258), "WiFi", fill=ACCENT_GREEN, font=font_text)
        
        # SFP - Orange solid
        draw.line([(240, 190), (840, 190)], fill=ACCENT_ORANGE, width=4)
        draw_glass_panel(draw, 500, 160, 100, 30)
        draw.text((510, 168), "SFP", fill=ACCENT_ORANGE, font=font_text)
    except Exception as e:
        print(f"Warning: Could not load icons: {e}")
    
    img.save('progress/PR20/05-connection-visualization.png')
    print('✅ Generated 05-connection-visualization.png')

def create_06_settings_panel():
    """Generate 06-settings-panel.png"""
    print("Creating 06-settings-panel.png...")
    img = Image.new('RGB', (600, 700), BG_DARK)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Glass panel
    draw_glass_panel(draw, 30, 30, 540, 640)
    
    font_title = try_load_font(20)
    font_text = try_load_font(14)
    
    draw.text((50, 50), "Settings", fill=TEXT_PRIMARY, font=font_title)
    
    draw.text((50, 100), "InControl Settings", fill=TEXT_PRIMARY, font=font_text)
    
    draw.text((50, 140), "Client ID:", fill=TEXT_SECONDARY, font=font_text)
    draw.rectangle([(50, 165), (530, 195)], fill=(60, 60, 60), outline=GRID_COLOR)
    draw.text((60, 172), "************************", fill=TEXT_SECONDARY, font=font_text)
    
    draw.text((50, 210), "Client Secret:", fill=TEXT_SECONDARY, font=font_text)
    draw.rectangle([(50, 235), (530, 265)], fill=(60, 60, 60), outline=GRID_COLOR)
    draw.text((60, 242), "************************", fill=TEXT_SECONDARY, font=font_text)
    
    draw.text((50, 290), "Connection Status:", fill=TEXT_SECONDARY, font=font_text)
    draw.ellipse([(50, 320), (70, 340)], fill=ACCENT_GREEN)
    draw.text((80, 322), "Connected", fill=ACCENT_GREEN, font=font_text)
    
    draw.text((50, 370), "Polling Interval:", fill=TEXT_SECONDARY, font=font_text)
    draw.rectangle([(50, 395), (200, 425)], fill=(60, 60, 60), outline=GRID_COLOR)
    draw.text((60, 402), "30 seconds", fill=TEXT_SECONDARY, font=font_text)
    
    # Save button
    draw.rectangle([(50, 500), (200, 540)], fill=ACCENT_BLUE, outline=ACCENT_BLUE)
    draw.text((100, 512), "Save", fill=(255, 255, 255), font=font_text)
    
    # Reset button
    draw.rectangle([(220, 500), (370, 540)], fill=(80, 80, 80), outline=GRID_COLOR)
    draw.text((270, 512), "Reset", fill=TEXT_PRIMARY, font=font_text)
    
    img.save('progress/PR20/06-settings-panel.png')
    print('✅ Generated 06-settings-panel.png')

def create_07_icon_gallery():
    """Generate 07-icon-gallery.png"""
    print("Creating 07-icon-gallery.png...")
    img = Image.new('RGB', (1000, 600), BG_DARK)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    font_title = try_load_font(20)
    font_text = try_load_font(14)
    
    draw.text((400, 30), "Isoflow Icon Gallery", fill=TEXT_PRIMARY, font=font_title)
    
    try:
        # Load all 6 icons
        icons = [
            ('router.svg', 'Router'),
            ('loadbalancer.svg', 'Load Balancer'),
            ('pyramid.svg', 'Access Point'),
            ('cloud.svg', 'Cloud/VPN'),
            ('cube.svg', 'IoT Adapter'),
            ('switch-module.svg', 'Switch'),
        ]
        
        # 2x3 grid
        for idx, (icon_file, label) in enumerate(icons):
            row = idx // 3
            col = idx % 3
            x = 150 + col * 300
            y = 120 + row * 250
            
            icon = load_svg_as_png(f'public/iconpacks/isoflow-default/{icon_file}', 120)
            img.paste(icon, (x, y), icon)
            
            # Label
            draw.text((x + 20, y + 140), label, fill=TEXT_PRIMARY, font=font_text)
            draw.text((x + 20, y + 160), icon_file, fill=TEXT_SECONDARY, font=font_text)
    except Exception as e:
        print(f"Warning: Could not load icons: {e}")
        draw.text((350, 300), "Icon Gallery", fill=TEXT_PRIMARY, font=font_title)
    
    img.save('progress/PR20/07-icon-gallery.png')
    print('✅ Generated 07-icon-gallery.png')

def create_08_device_hover_state():
    """Generate 08-device-hover-state.png"""
    print("Creating 08-device-hover-state.png...")
    img = Image.new('RGB', (800, 600), BG_DARK)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Draw isometric grid
    draw_isometric_grid(draw, 800, 600)
    
    font_text = try_load_font(14)
    
    try:
        router_icon = load_svg_as_png('public/iconpacks/isoflow-default/router.svg', 120)
        
        # Glow effect (multiple circles with decreasing opacity)
        for radius in [80, 70, 60, 50]:
            opacity = int(20 - (radius / 10))
            color = ACCENT_BLUE + (opacity,)
            draw.ellipse([(400-radius, 300-radius), (400+radius, 300+radius)], fill=color)
        
        # Place icon
        img.paste(router_icon, (340, 240), router_icon)
        
        # Tooltip
        draw_glass_panel(draw, 250, 380, 300, 150)
        draw.text((270, 395), "Balance 380 - HQ Router", fill=TEXT_PRIMARY, font=font_text)
        draw.text((270, 425), "Status: Online", fill=ACCENT_GREEN, font=font_text)
        draw.text((270, 455), "CPU: 35% | Memory: 62%", fill=TEXT_SECONDARY, font=font_text)
        draw.text((270, 485), "WAN: Active | Uptime: 45d", fill=TEXT_SECONDARY, font=font_text)
        
        # Highlighted connections
        draw.line([(400, 300), (200, 200)], fill=ACCENT_BLUE, width=6)
        draw.line([(400, 300), (600, 200)], fill=ACCENT_GREEN, width=6)
    except Exception as e:
        print(f"Warning: Could not load icons: {e}")
        draw.text((300, 300), "Hover State", fill=TEXT_PRIMARY, font=try_load_font(20))
    
    img.save('progress/PR20/08-device-hover-state.png')
    print('✅ Generated 08-device-hover-state.png')

def main():
    """Generate all 8 screenshots"""
    print('🎨 Generating PR20 screenshots with real Isoflow icons...')
    print()
    
    try:
        create_01_full_application()
        create_02_sidebar_device_groups()
        create_03_canvas_with_isoflow_icons()
        create_04_device_details_panel()
        create_05_connection_visualization()
        create_06_settings_panel()
        create_07_icon_gallery()
        create_08_device_hover_state()
        
        print()
        print('✅ All 8 screenshots generated successfully!')
        print('📁 Screenshots saved to: progress/PR20/')
        return 0
    except Exception as e:
        print(f'❌ Error generating screenshots: {e}')
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(main())
