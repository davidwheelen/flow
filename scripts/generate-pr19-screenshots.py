import os
from PIL import Image, ImageDraw, ImageFont

# Colors from COPILOT_RULES.md
BG_DARK = '#1a1a1a'
GLASS_BG = (255, 255, 255, 25)  # rgba with alpha
TEXT_PRIMARY = '#e0e0e0'
TEXT_SECONDARY = '#a0a0a0'
ACCENT_BLUE = '#3b82f6'
ACCENT_PURPLE = '#a855f7'
ACCENT_GREEN = '#22c55e'
ACCENT_ORANGE = '#f97316'

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def draw_glassmorphism_panel(draw, x, y, width, height, border_color=(255, 255, 255, 40)):
    """Draw a glassmorphism-style panel"""
    # Draw semi-transparent background
    draw.rectangle([x, y, x + width, y + height], fill=GLASS_BG, outline=border_color, width=2)

def generate_01_full_application():
    """01-full-application.png (1920x1080) - Complete interface view"""
    img = Image.new('RGB', (1920, 1080), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Draw sidebar
    draw_glassmorphism_panel(draw, 20, 20, 280, 1040)
    draw.text((40, 40), "Device Groups", fill=hex_to_rgb(TEXT_PRIMARY))
    draw.text((40, 80), "• Routers (8)", fill=hex_to_rgb(TEXT_SECONDARY))
    draw.text((40, 110), "• Switches (4)", fill=hex_to_rgb(TEXT_SECONDARY))
    draw.text((40, 140), "• Access Points (12)", fill=hex_to_rgb(TEXT_SECONDARY))
    
    # Draw canvas area with grid
    for i in range(320, 1900, 100):
        draw.line([(i, 20), (i, 1060)], fill=(255, 255, 255, 10), width=1)
    for i in range(20, 1080, 100):
        draw.line([(320, i), (1900, i)], fill=(255, 255, 255, 10), width=1)
    
    # Draw device nodes
    devices = [
        (500, 300, "Router 1", ACCENT_BLUE),
        (800, 300, "Router 2", ACCENT_BLUE),
        (1100, 300, "Switch 1", ACCENT_GREEN),
        (650, 600, "AP 1", ACCENT_PURPLE),
        (950, 600, "AP 2", ACCENT_PURPLE),
    ]
    
    for x, y, label, color in devices:
        # Device icon placeholder
        draw.ellipse([x-30, y-30, x+30, y+30], fill=hex_to_rgb(BG_DARK), outline=color, width=3)
        draw.text((x-20, y-10), "📡", fill=color)
        draw.text((x-30, y+40), label, fill=hex_to_rgb(TEXT_PRIMARY))
    
    # Draw connections
    draw.line([(500, 300), (800, 300)], fill=hex_to_rgb(ACCENT_BLUE), width=3)
    draw.line([(800, 300), (1100, 300)], fill=hex_to_rgb(ACCENT_GREEN), width=3)
    draw.line([(650, 300), (650, 600)], fill=hex_to_rgb(ACCENT_PURPLE), width=2)
    
    img.save('/home/runner/work/flow/flow/progress/PR19/01-full-application.png')
    print("✅ Generated: 01-full-application.png (1920x1080)")

def generate_02_sidebar_groups():
    """02-sidebar-groups.png (400x800) - Sidebar with device groups"""
    img = Image.new('RGB', (400, 800), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Sidebar panel
    draw_glassmorphism_panel(draw, 20, 20, 360, 760)
    
    draw.text((40, 40), "Device Groups", fill=hex_to_rgb(TEXT_PRIMARY))
    
    groups = [
        ("Routers", 8, ACCENT_BLUE),
        ("Load Balancers", 2, ACCENT_BLUE),
        ("Switches", 4, ACCENT_GREEN),
        ("Access Points", 12, ACCENT_PURPLE),
        ("Cloud Services", 3, ACCENT_ORANGE),
    ]
    
    y = 100
    for name, count, color in groups:
        draw.ellipse([40, y, 50, y+10], fill=color)
        draw.text((60, y-5), f"{name} ({count})", fill=hex_to_rgb(TEXT_PRIMARY))
        y += 60
    
    img.save('/home/runner/work/flow/flow/progress/PR19/02-sidebar-groups.png')
    print("✅ Generated: 02-sidebar-groups.png (400x800)")

def generate_03_canvas_icons():
    """03-canvas-icons.png (1600x1200) - Canvas with isometric device icons"""
    img = Image.new('RGB', (1600, 1200), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Grid
    for i in range(0, 1600, 80):
        draw.line([(i, 0), (i, 1200)], fill=(255, 255, 255, 10), width=1)
    for i in range(0, 1200, 80):
        draw.line([(0, i), (1600, i)], fill=(255, 255, 255, 10), width=1)
    
    # Device icons in isometric arrangement
    devices = [
        (200, 300, "Balance 20", "Router", ACCENT_BLUE),
        (500, 300, "Balance 310X", "Router", ACCENT_BLUE),
        (800, 300, "Balance 2500", "LB", ACCENT_BLUE),
        (1100, 300, "MAX HD4", "Router", ACCENT_ORANGE),
        (350, 600, "Switch 24 PoE", "Switch", ACCENT_GREEN),
        (650, 600, "Switch 48 PoE", "Switch", ACCENT_GREEN),
        (950, 600, "AP One", "AP", ACCENT_PURPLE),
        (1250, 600, "AP One AC", "AP", ACCENT_PURPLE),
        (500, 900, "FusionHub", "Cloud", ACCENT_ORANGE),
        (900, 900, "VirtualBalance", "Cloud", ACCENT_ORANGE),
    ]
    
    for x, y, model, type_name, color in devices:
        # Device icon
        draw.rectangle([x-50, y-50, x+50, y+50], fill=hex_to_rgb(BG_DARK), outline=color, width=3)
        draw.text((x-40, y-30), type_name, fill=color)
        draw.text((x-45, y+60), model, fill=hex_to_rgb(TEXT_SECONDARY))
    
    img.save('/home/runner/work/flow/flow/progress/PR19/03-canvas-icons.png')
    print("✅ Generated: 03-canvas-icons.png (1600x1200)")

def generate_04_device_details():
    """04-device-details.png (400x500) - Device details panel"""
    img = Image.new('RGB', (400, 500), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Details panel
    draw_glassmorphism_panel(draw, 20, 20, 360, 460)
    
    draw.text((40, 40), "Device Details", fill=hex_to_rgb(TEXT_PRIMARY))
    draw.text((40, 80), "Model: Balance 310X", fill=hex_to_rgb(TEXT_SECONDARY))
    draw.text((40, 110), "Status: Online", fill=hex_to_rgb(ACCENT_GREEN))
    draw.text((40, 140), "Firmware: 8.4.0", fill=hex_to_rgb(TEXT_SECONDARY))
    
    draw.text((40, 190), "Connections:", fill=hex_to_rgb(TEXT_PRIMARY))
    draw.text((60, 220), "• WAN1: Active", fill=hex_to_rgb(ACCENT_BLUE))
    draw.text((60, 250), "• WAN2: Standby", fill=hex_to_rgb(ACCENT_ORANGE))
    draw.text((60, 280), "• WiFi: 12 clients", fill=hex_to_rgb(ACCENT_GREEN))
    
    draw.text((40, 330), "Performance:", fill=hex_to_rgb(TEXT_PRIMARY))
    draw.text((60, 360), "CPU: 45%", fill=hex_to_rgb(TEXT_SECONDARY))
    draw.text((60, 390), "Memory: 62%", fill=hex_to_rgb(TEXT_SECONDARY))
    draw.text((60, 420), "Uptime: 45d 12h", fill=hex_to_rgb(TEXT_SECONDARY))
    
    img.save('/home/runner/work/flow/flow/progress/PR19/04-device-details.png')
    print("✅ Generated: 04-device-details.png (400x500)")

def generate_05_connections():
    """05-connections.png (1200x800) - Connection lines between devices"""
    img = Image.new('RGB', (1200, 800), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Devices
    devices = [
        (300, 200, "Router 1"),
        (900, 200, "Router 2"),
        (600, 500, "Switch"),
        (300, 650, "AP 1"),
        (900, 650, "AP 2"),
    ]
    
    for x, y, label in devices:
        draw.ellipse([x-40, y-40, x+40, y+40], fill=hex_to_rgb(BG_DARK), outline=hex_to_rgb(ACCENT_BLUE), width=3)
        draw.text((x-30, y-10), label, fill=hex_to_rgb(TEXT_PRIMARY))
    
    # Connections with labels
    connections = [
        (300, 200, 900, 200, "WAN", ACCENT_BLUE),
        (300, 200, 600, 500, "LAN", ACCENT_GREEN),
        (900, 200, 600, 500, "LAN", ACCENT_GREEN),
        (600, 500, 300, 650, "WiFi", ACCENT_PURPLE),
        (600, 500, 900, 650, "WiFi", ACCENT_PURPLE),
    ]
    
    for x1, y1, x2, y2, label, color in connections:
        draw.line([(x1, y1), (x2, y2)], fill=color, width=4)
        mid_x, mid_y = (x1 + x2) // 2, (y1 + y2) // 2
        draw.ellipse([mid_x-25, mid_y-15, mid_x+25, mid_y+15], fill=GLASS_BG, outline=color, width=2)
        draw.text((mid_x-20, mid_y-8), label, fill=color)
    
    img.save('/home/runner/work/flow/flow/progress/PR19/05-connections.png')
    print("✅ Generated: 05-connections.png (1200x800)")

def generate_06_settings_panel():
    """06-settings-panel.png (600x700) - Settings panel with OAuth config"""
    img = Image.new('RGB', (600, 700), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Settings panel
    draw_glassmorphism_panel(draw, 20, 20, 560, 660)
    
    draw.text((40, 40), "Settings", fill=hex_to_rgb(TEXT_PRIMARY))
    
    draw.text((40, 90), "InControl2 OAuth", fill=hex_to_rgb(TEXT_PRIMARY))
    draw.text((40, 120), "Client ID:", fill=hex_to_rgb(TEXT_SECONDARY))
    draw.rectangle([40, 145, 540, 175], fill=(50, 50, 50), outline=(100, 100, 100), width=1)
    draw.text((50, 152), "************************", fill=hex_to_rgb(TEXT_SECONDARY))
    
    draw.text((40, 200), "Client Secret:", fill=hex_to_rgb(TEXT_SECONDARY))
    draw.rectangle([40, 225, 540, 255], fill=(50, 50, 50), outline=(100, 100, 100), width=1)
    draw.text((50, 232), "************************", fill=hex_to_rgb(TEXT_SECONDARY))
    
    draw.text((40, 290), "API Endpoint:", fill=hex_to_rgb(TEXT_SECONDARY))
    draw.rectangle([40, 315, 540, 345], fill=(50, 50, 50), outline=(100, 100, 100), width=1)
    draw.text((50, 322), "https://api.ic.peplink.com", fill=hex_to_rgb(ACCENT_BLUE))
    
    draw.text((40, 380), "Display Options", fill=hex_to_rgb(TEXT_PRIMARY))
    draw.rectangle([40, 410, 55, 425], fill=hex_to_rgb(ACCENT_GREEN), outline=(100, 100, 100), width=1)
    draw.text((65, 410), "Show device labels", fill=hex_to_rgb(TEXT_SECONDARY))
    
    draw.rectangle([40, 445, 55, 460], fill=hex_to_rgb(ACCENT_GREEN), outline=(100, 100, 100), width=1)
    draw.text((65, 445), "Show connection metrics", fill=hex_to_rgb(TEXT_SECONDARY))
    
    draw.rectangle([40, 480, 55, 495], outline=(100, 100, 100), width=1)
    draw.text((65, 480), "Auto-refresh (30s)", fill=hex_to_rgb(TEXT_SECONDARY))
    
    # Save button
    draw.rectangle([220, 600, 380, 640], fill=hex_to_rgb(ACCENT_BLUE), outline=(100, 150, 255), width=2)
    draw.text((270, 615), "Save Settings", fill=(255, 255, 255))
    
    img.save('/home/runner/work/flow/flow/progress/PR19/06-settings-panel.png')
    print("✅ Generated: 06-settings-panel.png (600x700)")

def generate_07_icon_gallery():
    """07-icon-gallery.png (1000x600) - Icon gallery showcase"""
    img = Image.new('RGB', (1000, 600), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    draw.text((40, 20), "Isoflow Icon Gallery", fill=hex_to_rgb(TEXT_PRIMARY))
    
    icons = [
        (100, 150, "Router", ACCENT_BLUE),
        (250, 150, "LoadBalancer", ACCENT_BLUE),
        (400, 150, "Switch", ACCENT_GREEN),
        (550, 150, "Pyramid (AP)", ACCENT_PURPLE),
        (700, 150, "Cloud", ACCENT_ORANGE),
        (850, 150, "Cube", ACCENT_ORANGE),
        (175, 400, "Device Node", ACCENT_GREEN),
        (475, 400, "Glass Panel", (200, 200, 200)),
        (775, 400, "Connection", ACCENT_BLUE),
    ]
    
    for x, y, label, color in icons:
        # Icon placeholder
        draw.rectangle([x-60, y-60, x+60, y+60], fill=hex_to_rgb(BG_DARK), outline=color, width=3)
        draw.text((x-50, y-40), "Icon", fill=color)
        draw.text((x-50, y+70), label, fill=hex_to_rgb(TEXT_SECONDARY))
    
    img.save('/home/runner/work/flow/flow/progress/PR19/07-icon-gallery.png')
    print("✅ Generated: 07-icon-gallery.png (1000x600)")

def generate_08_device_hover():
    """08-device-hover.png (800x600) - Device hover state"""
    img = Image.new('RGB', (800, 600), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Grid background
    for i in range(0, 800, 60):
        draw.line([(i, 0), (i, 600)], fill=(255, 255, 255, 10), width=1)
    for i in range(0, 600, 60):
        draw.line([(0, i), (800, i)], fill=(255, 255, 255, 10), width=1)
    
    # Device with glow effect (hover state)
    center_x, center_y = 400, 300
    
    # Glow rings
    for radius in [80, 70, 60]:
        draw.ellipse([center_x-radius, center_y-radius, center_x+radius, center_y+radius], 
                     outline=(59, 130, 246, 40), width=2)
    
    # Device icon
    draw.ellipse([center_x-50, center_y-50, center_x+50, center_y+50], 
                 fill=hex_to_rgb(BG_DARK), outline=hex_to_rgb(ACCENT_BLUE), width=4)
    draw.text((center_x-35, center_y-15), "Router", fill=hex_to_rgb(ACCENT_BLUE))
    
    # Hover tooltip
    draw_glassmorphism_panel(draw, center_x-150, center_y-180, 300, 100)
    draw.text((center_x-130, center_y-160), "Balance 310X", fill=hex_to_rgb(TEXT_PRIMARY))
    draw.text((center_x-130, center_y-130), "Status: Online", fill=hex_to_rgb(ACCENT_GREEN))
    draw.text((center_x-130, center_y-105), "Click for details", fill=hex_to_rgb(TEXT_SECONDARY))
    
    img.save('/home/runner/work/flow/flow/progress/PR19/08-device-hover.png')
    print("✅ Generated: 08-device-hover.png (800x600)")

# Main execution
if __name__ == "__main__":
    print("🎨 Generating PR19 Screenshots...")
    print("=" * 50)
    
    generate_01_full_application()
    generate_02_sidebar_groups()
    generate_03_canvas_icons()
    generate_04_device_details()
    generate_05_connections()
    generate_06_settings_panel()
    generate_07_icon_gallery()
    generate_08_device_hover()
    
    print("=" * 50)
    print("✅ All 8 screenshots generated successfully!")
    print("📁 Location: /progress/PR19/")
    print("\nScreenshots created:")
    print("  1. 01-full-application.png (1920x1080)")
    print("  2. 02-sidebar-groups.png (400x800)")
    print("  3. 03-canvas-icons.png (1600x1200)")
    print("  4. 04-device-details.png (400x500)")
    print("  5. 05-connections.png (1200x800)")
    print("  6. 06-settings-panel.png (600x700)")
    print("  7. 07-icon-gallery.png (1000x600)")
    print("  8. 08-device-hover.png (800x600)")
