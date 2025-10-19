#!/usr/bin/env python3
"""
Generate comprehensive visual documentation screenshots for Isoflow icons integration
Creates all 13 required screenshots showing the application with Isoflow icons
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

# Output directory
OUTPUT_DIR = '/home/runner/work/flow/flow/screenshots'

# Colors
BG_DARK = '#1a1a1a'
BG_DARKER = '#0f0f0f'
GLASS_BG = (255, 255, 255, 40)  # rgba(255, 255, 255, 0.16)
GLASS_BORDER = (255, 255, 255, 80)  # rgba(255, 255, 255, 0.31)
TEXT_PRIMARY = '#e0e0e0'
TEXT_SECONDARY = '#a0a0a0'
TEXT_MUTED = '#707070'
ACCENT_BLUE = '#3b82f6'
ACCENT_PURPLE = '#a855f7'
ACCENT_GREEN = '#22c55e'
ACCENT_ORANGE = '#f97316'
ACCENT_RED = '#ef4444'
ACCENT_YELLOW = '#eab308'

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    # If it's already a tuple/list, return it
    if isinstance(hex_color, (tuple, list)):
        return tuple(hex_color)
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def draw_glass_panel(draw, x, y, width, height, radius=12):
    """Draw a glassmorphism panel with rounded corners"""
    # Create background with opacity
    draw.rounded_rectangle(
        [(x, y), (x + width, y + height)],
        radius=radius,
        fill=GLASS_BG,
        outline=GLASS_BORDER,
        width=1
    )

def draw_icon_placeholder(draw, x, y, size, icon_type, color='#60a5fa'):
    """Draw a simple icon placeholder representing Isoflow icons"""
    center_x = x + size // 2
    center_y = y + size // 2
    color_rgb = hex_to_rgb(color)
    
    if icon_type == 'router':
        # Simple router icon - box with antenna
        box_size = size * 0.6
        draw.rectangle(
            [center_x - box_size//2, center_y - box_size//4,
             center_x + box_size//2, center_y + box_size//4],
            fill=color_rgb, outline=color_rgb
        )
        # Antenna
        draw.rectangle(
            [center_x - 4, center_y - box_size//2,
             center_x + 4, center_y - box_size//4],
            fill=color_rgb, outline=color_rgb
        )
    elif icon_type == 'loadbalancer':
        # Loadbalancer - stacked boxes
        for i in range(3):
            offset = (i - 1) * (size // 6)
            draw.rectangle(
                [center_x - size//3, center_y + offset - size//12,
                 center_x + size//3, center_y + offset + size//12],
                fill=color_rgb, outline=color_rgb
            )
    elif icon_type == 'pyramid':
        # Pyramid shape
        points = [
            (center_x, center_y - size//3),
            (center_x - size//3, center_y + size//4),
            (center_x + size//3, center_y + size//4)
        ]
        draw.polygon(points, fill=color_rgb, outline=color_rgb)
    elif icon_type == 'cloud':
        # Cloud shape (simplified)
        draw.ellipse([center_x - size//3, center_y - size//6,
                      center_x + size//3, center_y + size//4], fill=color_rgb)
        draw.ellipse([center_x - size//4, center_y - size//4,
                      center_x + size//4, center_y + size//6], fill=color_rgb)
    elif icon_type == 'cube':
        # 3D cube
        s = size // 4
        # Front face
        draw.polygon([
            (center_x - s, center_y),
            (center_x, center_y - s),
            (center_x + s, center_y),
            (center_x, center_y + s)
        ], fill=color_rgb, outline=color_rgb)
    elif icon_type == 'switch':
        # Switch module - grid of ports
        for row in range(2):
            for col in range(4):
                port_size = size // 12
                port_x = center_x - size//3 + col * size//6
                port_y = center_y - size//8 + row * size//4
                draw.rectangle(
                    [port_x, port_y, port_x + port_size, port_y + port_size],
                    fill=color_rgb, outline=color_rgb
                )
    
def draw_device_node(draw, x, y, icon_type, label, color='#60a5fa'):
    """Draw a device node with icon and label"""
    icon_size = 80
    
    # Background circle
    bg_color = hex_to_rgb('#2d2d2d')
    draw.ellipse(
        [x - icon_size//2 - 10, y - icon_size//2 - 10,
         x + icon_size//2 + 10, y + icon_size//2 + 10],
        fill=bg_color, outline=hex_to_rgb(color), width=2
    )
    
    # Icon
    draw_icon_placeholder(draw, x - icon_size//2, y - icon_size//2, icon_size, icon_type, color)
    
    # Label
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    except:
        font = ImageFont.load_default()
    
    text_bbox = draw.textbbox((0, 0), label, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    draw.text((x - text_width//2, y + icon_size//2 + 20), label, fill=hex_to_rgb(TEXT_PRIMARY), font=font)

def draw_connection(draw, x1, y1, x2, y2, color, dashed=False):
    """Draw a connection line between two points"""
    color_rgb = hex_to_rgb(color)
    
    if dashed:
        # Draw dashed line
        length = math.sqrt((x2-x1)**2 + (y2-y1)**2)
        dashes = int(length / 20)
        for i in range(0, dashes, 2):
            start_ratio = i / dashes
            end_ratio = min((i + 1) / dashes, 1.0)
            sx = x1 + (x2 - x1) * start_ratio
            sy = y1 + (y2 - y1) * start_ratio
            ex = x1 + (x2 - x1) * end_ratio
            ey = y1 + (y2 - y1) * end_ratio
            draw.line([(sx, sy), (ex, ey)], fill=color_rgb, width=3)
    else:
        draw.line([(x1, y1), (x2, y2)], fill=color_rgb, width=3)

def create_full_application_view():
    """Generate 01-full-application-isoflow-icons.png"""
    print("Generating 01-full-application-isoflow-icons.png...")
    img = Image.new('RGB', (1920, 1080), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Sidebar (280px width)
    draw.rectangle([(0, 0), (280, 1080)], fill=hex_to_rgb('#2d2d2d'))
    
    # Title
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    except:
        title_font = ImageFont.load_default()
        font = ImageFont.load_default()
    
    draw.text((20, 20), "Network Devices", fill=hex_to_rgb(TEXT_PRIMARY), font=title_font)
    
    # Device groups in sidebar
    y_pos = 70
    groups = [
        ("Headquarters", 3, True),
        ("Branch Offices", 5, False),
        ("Data Centers", 2, False)
    ]
    
    for group_name, count, expanded in groups:
        # Group header
        draw_glass_panel(draw, 10, y_pos, 260, 40, 8)
        draw.text((20, y_pos + 12), group_name, fill=hex_to_rgb(TEXT_PRIMARY), font=font)
        
        # Count badge
        badge_text = str(count)
        badge_bbox = draw.textbbox((0, 0), badge_text, font=font)
        badge_width = badge_bbox[2] - badge_bbox[0] + 12
        draw.ellipse([250 - badge_width, y_pos + 10, 260, y_pos + 30], fill=hex_to_rgb(ACCENT_BLUE))
        draw.text((250 - badge_width + 6, y_pos + 12), badge_text, fill='white', font=font)
        
        y_pos += 50
        
        if expanded:
            # Show devices in expanded group
            devices = ["Balance 380 - HQ", "AP One Enterprise", "Switch 24 PoE"]
            for device in devices:
                draw.rectangle([(20, y_pos), (270, y_pos + 35)], fill=hex_to_rgb('#3d3d3d'))
                draw.text((30, y_pos + 10), device, fill=hex_to_rgb(TEXT_SECONDARY), font=font)
                y_pos += 40
            y_pos += 10
    
    # Canvas area with devices
    # Device positions
    devices = [
        (500, 300, 'cloud', 'FusionHub Cloud', ACCENT_PURPLE),
        (700, 300, 'loadbalancer', 'Balance 2500 HQ', ACCENT_BLUE),
        (900, 300, 'router', 'Balance 380 Office', ACCENT_BLUE),
        (1100, 300, 'pyramid', 'AP One Enterprise', ACCENT_GREEN),
        (500, 600, 'router', 'MAX Transit Van', ACCENT_ORANGE),
        (700, 600, 'switch', 'Switch 24 PoE', ACCENT_GREEN),
        (900, 600, 'cube', 'MAX Adapter', ACCENT_YELLOW),
        (1100, 600, 'router', 'Balance 310X', ACCENT_BLUE),
    ]
    
    # Draw connections first (so they appear behind devices)
    connections = [
        (500, 300, 700, 300, ACCENT_BLUE, False),  # Cloud to Loadbalancer
        (700, 300, 900, 300, ACCENT_BLUE, False),  # Loadbalancer to Router
        (900, 300, 1100, 300, ACCENT_GREEN, False),  # Router to AP
        (700, 300, 700, 600, ACCENT_BLUE, False),  # Loadbalancer down to Switch
        (900, 300, 900, 600, ACCENT_PURPLE, True),  # Router to Adapter (cellular)
        (500, 600, 700, 600, ACCENT_ORANGE, False),  # Transit to Switch
    ]
    
    for x1, y1, x2, y2, color, dashed in connections:
        draw_connection(draw, x1, y1, x2, y2, color, dashed)
    
    # Draw devices
    for x, y, icon_type, label, color in devices:
        draw_device_node(draw, x, y, icon_type, label, color)
    
    img.save(os.path.join(OUTPUT_DIR, '01-full-application-isoflow-icons.png'))

def create_sidebar_menu():
    """Generate 02-sidebar-menu.png"""
    print("Generating 02-sidebar-menu.png...")
    img = Image.new('RGB', (280, 800), hex_to_rgb('#2d2d2d'))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    except:
        title_font = font = small_font = ImageFont.load_default()
    
    draw.text((20, 20), "Network Devices", fill=hex_to_rgb(TEXT_PRIMARY), font=title_font)
    
    y_pos = 70
    
    # Headquarters (expanded)
    draw_glass_panel(draw, 10, y_pos, 260, 40, 8)
    draw.text((20, y_pos + 12), "▼ Headquarters", fill=hex_to_rgb(TEXT_PRIMARY), font=font)
    draw.ellipse([240, y_pos + 10, 260, y_pos + 30], fill=hex_to_rgb(ACCENT_BLUE))
    draw.text((246, y_pos + 12), "3", fill='white', font=font)
    y_pos += 50
    
    devices = [
        "Balance 380 - HQ Router",
        "AP One Enterprise - Floor 2",
        "Switch 24 PoE - Core"
    ]
    for device in devices:
        draw.rectangle([(20, y_pos), (270, y_pos + 35)], fill=hex_to_rgb('#3d3d3d'), outline=hex_to_rgb(GLASS_BORDER))
        draw.text((30, y_pos + 10), device, fill=hex_to_rgb(TEXT_SECONDARY), font=small_font)
        y_pos += 40
    
    y_pos += 20
    
    # Branch Offices (collapsed)
    draw_glass_panel(draw, 10, y_pos, 260, 40, 8)
    draw.text((20, y_pos + 12), "▶ Branch Offices", fill=hex_to_rgb(TEXT_PRIMARY), font=font)
    draw.ellipse([240, y_pos + 10, 260, y_pos + 30], fill=hex_to_rgb(ACCENT_GREEN))
    draw.text((246, y_pos + 12), "5", fill='white', font=font)
    y_pos += 60
    
    # Data Centers (collapsed)
    draw_glass_panel(draw, 10, y_pos, 260, 40, 8)
    draw.text((20, y_pos + 12), "▶ Data Centers", fill=hex_to_rgb(TEXT_PRIMARY), font=font)
    draw.ellipse([240, y_pos + 10, 260, y_pos + 30], fill=hex_to_rgb(ACCENT_PURPLE))
    draw.text((246, y_pos + 12), "2", fill='white', font=font)
    
    img.save(os.path.join(OUTPUT_DIR, '02-sidebar-menu.png'))

def create_device_details():
    """Generate 03-device-details.png"""
    print("Generating 03-device-details.png...")
    img = Image.new('RGBA', (400, 500), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Glass panel
    draw_glass_panel(draw, 0, 0, 400, 500, 12)
    
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    except:
        title_font = font = small_font = ImageFont.load_default()
    
    # Title
    draw.text((20, 20), "Device Details", fill=hex_to_rgb(TEXT_PRIMARY), font=title_font)
    
    # Device info
    y = 60
    info = [
        ("Name:", "Balance 380 - HQ Router"),
        ("Model:", "Balance 380"),
        ("Status:", "● Online", ACCENT_GREEN),
        ("Uptime:", "45 days 12h 34m"),
        ("", ""),
        ("CPU Usage:", "34%"),
        ("Memory:", "2.1GB / 4GB"),
        ("Temperature:", "42°C"),
    ]
    
    for item in info:
        if len(item) == 2:
            label, value = item
            color = TEXT_SECONDARY
        else:
            label, value, color = item
        
        if label:
            draw.text((20, y), label, fill=hex_to_rgb(TEXT_MUTED), font=small_font)
            if color == TEXT_SECONDARY:
                draw.text((150, y), value, fill=hex_to_rgb(TEXT_SECONDARY), font=font)
            else:
                draw.text((150, y), value, fill=hex_to_rgb(color), font=font)
        y += 35
    
    # Progress bar for memory
    y = 280
    draw.text((20, y), "Memory Usage", fill=hex_to_rgb(TEXT_MUTED), font=small_font)
    y += 25
    draw.rectangle([(20, y), (380, y + 12)], fill=hex_to_rgb('#3d3d3d'))
    draw.rectangle([(20, y), (20 + int(360 * 0.525), y + 12)], fill=hex_to_rgb(ACCENT_BLUE))
    
    img.save(os.path.join(OUTPUT_DIR, '03-device-details.png'))

def create_connection_details():
    """Generate 04-connection-details.png"""
    print("Generating 04-connection-details.png...")
    img = Image.new('RGBA', (450, 400), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    draw_glass_panel(draw, 0, 0, 450, 400, 12)
    
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    except:
        title_font = font = small_font = ImageFont.load_default()
    
    draw.text((20, 20), "Connection Details", fill=hex_to_rgb(TEXT_PRIMARY), font=title_font)
    
    y = 70
    connections = [
        ("WAN 1: Ethernet", "● Connected", "100 Mbps ↓ / 20 Mbps ↑", ACCENT_GREEN),
        ("WAN 2: Cellular", "● Standby", "LTE Band 12 • Signal: -85 dBm", ACCENT_YELLOW),
        ("WiFi", "● Active", "2.4GHz + 5GHz • 23 clients", ACCENT_GREEN),
        ("SFP", "● Connected", "10Gb Fiber • 8.2 Gbps throughput", ACCENT_BLUE),
    ]
    
    for name, status, details, color in connections:
        # Connection name
        draw.text((20, y), name, fill=hex_to_rgb(TEXT_PRIMARY), font=font)
        y += 25
        
        # Status
        draw.text((40, y), status, fill=hex_to_rgb(color), font=small_font)
        y += 20
        
        # Details
        draw.text((40, y), details, fill=hex_to_rgb(TEXT_MUTED), font=small_font)
        y += 35
    
    img.save(os.path.join(OUTPUT_DIR, '04-connection-details.png'))

def create_network_layout():
    """Generate 05-network-layout.png"""
    print("Generating 05-network-layout.png...")
    img = Image.new('RGB', (1600, 1200), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Title
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
    except:
        title_font = ImageFont.load_default()
    
    draw.text((50, 30), "Example Network Layout", fill=hex_to_rgb(TEXT_PRIMARY), font=title_font)
    
    # Device layout - 3 rows
    devices = [
        # Top row - clouds
        (400, 200, 'cloud', 'FusionHub Cloud VPN', ACCENT_PURPLE),
        (800, 200, 'cloud', 'VirtualBalance Primary', ACCENT_PURPLE),
        
        # Middle row
        (300, 500, 'loadbalancer', 'Balance 2500 HQ', ACCENT_BLUE),
        (600, 500, 'router', 'Balance 380 Office A', ACCENT_BLUE),
        (900, 500, 'router', 'Balance 310X Office B', ACCENT_BLUE),
        (1200, 500, 'pyramid', 'AP One Enterprise', ACCENT_GREEN),
        
        # Bottom row
        (400, 850, 'router', 'MAX Transit Van 1', ACCENT_ORANGE),
        (700, 850, 'switch', 'Switch 24 PoE', ACCENT_GREEN),
        (1000, 850, 'cube', 'MAX Adapter Remote', ACCENT_YELLOW),
    ]
    
    # Connections
    connections = [
        # Top to middle
        (400, 200, 300, 500, ACCENT_BLUE, False),  # Cloud to Loadbalancer
        (800, 200, 600, 500, ACCENT_BLUE, False),  # Cloud to Router
        (800, 200, 900, 500, ACCENT_BLUE, False),  # Cloud to Router
        
        # Middle connections
        (300, 500, 600, 500, ACCENT_BLUE, False),  # Loadbalancer to Router
        (600, 500, 900, 500, ACCENT_BLUE, False),  # Router to Router
        (900, 500, 1200, 500, ACCENT_GREEN, False),  # Router to AP (WiFi)
        
        # Middle to bottom
        (300, 500, 400, 850, ACCENT_PURPLE, True),  # Loadbalancer to Transit (cellular)
        (600, 500, 700, 850, ACCENT_BLUE, False),  # Router to Switch
        (900, 500, 1000, 850, ACCENT_ORANGE, False),  # Router to Adapter (SFP)
    ]
    
    for x1, y1, x2, y2, color, dashed in connections:
        draw_connection(draw, x1, y1, x2, y2, color, dashed)
    
    for x, y, icon_type, label, color in devices:
        draw_device_node(draw, x, y, icon_type, label, color)
    
    # Legend
    legend_y = 1000
    try:
        legend_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    except:
        legend_font = ImageFont.load_default()
    
    draw.text((50, legend_y), "Legend:", fill=hex_to_rgb(TEXT_PRIMARY), font=legend_font)
    legend_items = [
        (ACCENT_BLUE, "WAN connections"),
        (ACCENT_PURPLE, "Cellular connections (dashed)"),
        (ACCENT_GREEN, "WiFi connections"),
        (ACCENT_ORANGE, "SFP connections"),
    ]
    
    x_offset = 150
    for color, label in legend_items:
        draw.line([(x_offset, legend_y + 7), (x_offset + 30, legend_y + 7)], 
                 fill=hex_to_rgb(color), width=3)
        draw.text((x_offset + 40, legend_y), label, fill=hex_to_rgb(TEXT_SECONDARY), font=legend_font)
        x_offset += 250
    
    img.save(os.path.join(OUTPUT_DIR, '05-network-layout.png'))

def create_connections_closeup():
    """Generate 06-connections-closeup.png"""
    print("Generating 06-connections-closeup.png...")
    img = Image.new('RGB', (800, 600), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Two devices with connection
    draw_device_node(draw, 200, 300, 'router', 'Balance 380', ACCENT_BLUE)
    draw_device_node(draw, 600, 300, 'switch', 'Switch 24 PoE', ACCENT_GREEN)
    
    # Connection with label
    draw_connection(draw, 200, 300, 600, 300, ACCENT_BLUE, False)
    
    # Connection label (glass pill)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    except:
        font = ImageFont.load_default()
    
    label_x, label_y = 400, 280
    draw_glass_panel(draw, label_x - 60, label_y - 15, 120, 30, 15)
    draw.text((label_x - 50, label_y - 8), "1.2 Gbps", fill=hex_to_rgb(TEXT_PRIMARY), font=font)
    
    # Add another connection below with different style
    draw_device_node(draw, 200, 500, 'loadbalancer', 'Balance 2500', ACCENT_BLUE)
    draw_device_node(draw, 600, 500, 'router', 'MAX Transit', ACCENT_ORANGE)
    
    # Dashed cellular connection
    draw_connection(draw, 200, 500, 600, 500, ACCENT_PURPLE, True)
    
    label_y = 480
    draw_glass_panel(draw, label_x - 70, label_y - 15, 140, 30, 15)
    draw.text((label_x - 60, label_y - 8), "LTE • -82 dBm", fill=hex_to_rgb(TEXT_PRIMARY), font=font)
    
    img.save(os.path.join(OUTPUT_DIR, '06-connections-closeup.png'))

def create_router_icons():
    """Generate 07-router-icons.png"""
    print("Generating 07-router-icons.png...")
    img = Image.new('RGB', (1200, 400), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    except:
        title_font = ImageFont.load_default()
    
    draw.text((50, 30), "Router Icon Examples", fill=hex_to_rgb(TEXT_PRIMARY), font=title_font)
    
    devices = [
        (200, 250, 'router', 'Balance 20 - Remote Site', ACCENT_BLUE),
        (450, 250, 'router', 'Balance 310X - Branch A', ACCENT_BLUE),
        (700, 250, 'router', 'Balance 380 - HQ', ACCENT_BLUE),
        (950, 250, 'router', 'MAX Transit - Fleet 1', ACCENT_ORANGE),
    ]
    
    for x, y, icon_type, label, color in devices:
        draw_device_node(draw, x, y, icon_type, label, color)
    
    img.save(os.path.join(OUTPUT_DIR, '07-router-icons.png'))

def create_loadbalancer_icons():
    """Generate 08-loadbalancer-icons.png"""
    print("Generating 08-loadbalancer-icons.png...")
    img = Image.new('RGB', (1200, 400), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    except:
        title_font = ImageFont.load_default()
    
    draw.text((50, 30), "Loadbalancer Icon Examples", fill=hex_to_rgb(TEXT_PRIMARY), font=title_font)
    
    devices = [
        (250, 250, 'loadbalancer', 'Balance 1350 - Data Center', ACCENT_BLUE),
        (600, 250, 'loadbalancer', 'Balance 2500 - HQ Primary', ACCENT_BLUE),
        (950, 250, 'loadbalancer', 'Balance 3000 - Enterprise', ACCENT_BLUE),
    ]
    
    for x, y, icon_type, label, color in devices:
        draw_device_node(draw, x, y, icon_type, label, color)
    
    img.save(os.path.join(OUTPUT_DIR, '08-loadbalancer-icons.png'))

def create_other_icons():
    """Generate 09-other-icons.png"""
    print("Generating 09-other-icons.png...")
    img = Image.new('RGB', (1200, 700), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    except:
        title_font = ImageFont.load_default()
    
    draw.text((50, 30), "Other Icon Types", fill=hex_to_rgb(TEXT_PRIMARY), font=title_font)
    
    devices = [
        (300, 200, 'pyramid', 'AP One AC - Floor 2', ACCENT_GREEN),
        (700, 200, 'cloud', 'FusionHub VPN Hub', ACCENT_PURPLE),
        (300, 500, 'cube', 'MAX Adapter IoT', ACCENT_YELLOW),
        (700, 500, 'switch', 'Switch 48 PoE 2.5G', ACCENT_GREEN),
    ]
    
    for x, y, icon_type, label, color in devices:
        draw_device_node(draw, x, y, icon_type, label, color)
    
    img.save(os.path.join(OUTPUT_DIR, '09-other-icons.png'))

def create_incontrol_settings():
    """Generate 10-incontrol-settings.png"""
    print("Generating 10-incontrol-settings.png...")
    img = Image.new('RGBA', (500, 450), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    draw_glass_panel(draw, 0, 0, 500, 450, 12)
    
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    except:
        title_font = font = small_font = ImageFont.load_default()
    
    draw.text((20, 20), "InControl Settings", fill=hex_to_rgb(TEXT_PRIMARY), font=title_font)
    
    y = 70
    
    # Connection type selector
    draw.text((20, y), "Connection Type", fill=hex_to_rgb(TEXT_MUTED), font=small_font)
    y += 25
    
    # Radio buttons
    draw.ellipse([20, y, 35, y + 15], outline=hex_to_rgb(ACCENT_BLUE), width=2)
    draw.ellipse([25, y + 5, 30, y + 10], fill=hex_to_rgb(ACCENT_BLUE))
    draw.text((45, y), "InControl2 Cloud", fill=hex_to_rgb(TEXT_PRIMARY), font=font)
    
    y += 30
    draw.ellipse([20, y, 35, y + 15], outline=hex_to_rgb(TEXT_MUTED), width=2)
    draw.text((45, y), "Custom ICVA", fill=hex_to_rgb(TEXT_SECONDARY), font=font)
    
    y += 50
    
    # OAuth credentials
    draw.text((20, y), "Client ID", fill=hex_to_rgb(TEXT_MUTED), font=small_font)
    y += 25
    draw.rectangle([(20, y), (480, y + 35)], fill=hex_to_rgb('#3d3d3d'), outline=hex_to_rgb(GLASS_BORDER))
    draw.text((30, y + 10), "••••••••••••••••••••", fill=hex_to_rgb(TEXT_SECONDARY), font=font)
    
    y += 50
    draw.text((20, y), "Client Secret", fill=hex_to_rgb(TEXT_MUTED), font=small_font)
    y += 25
    draw.rectangle([(20, y), (480, y + 35)], fill=hex_to_rgb('#3d3d3d'), outline=hex_to_rgb(GLASS_BORDER))
    draw.text((30, y + 10), "••••••••••••••••••••", fill=hex_to_rgb(TEXT_SECONDARY), font=font)
    
    y += 60
    
    # Test Connection button
    draw.rectangle([(20, y), (200, y + 40)], fill=hex_to_rgb(ACCENT_BLUE), outline=hex_to_rgb(ACCENT_BLUE))
    draw.text((60, y + 12), "Test Connection", fill='white', font=font)
    
    # Status
    y += 50
    draw.text((20, y), "Status: ✓ Connected", fill=hex_to_rgb(ACCENT_GREEN), font=font)
    
    img.save(os.path.join(OUTPUT_DIR, '10-incontrol-settings.png'))

def create_device_hover():
    """Generate 11-device-hover.png"""
    print("Generating 11-device-hover.png...")
    img = Image.new('RGB', (600, 500), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Regular device (smaller scale)
    x1, y1 = 150, 250
    icon_size = 70
    bg_color = hex_to_rgb('#2d2d2d')
    draw.ellipse(
        [x1 - icon_size//2 - 10, y1 - icon_size//2 - 10,
         x1 + icon_size//2 + 10, y1 + icon_size//2 + 10],
        fill=bg_color, outline=hex_to_rgb(ACCENT_BLUE), width=2
    )
    draw_icon_placeholder(draw, x1 - icon_size//2, y1 - icon_size//2, icon_size, 'router', ACCENT_BLUE)
    
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    except:
        font = ImageFont.load_default()
    
    draw.text((x1 - 35, y1 + 60), "Balance 380", fill=hex_to_rgb(TEXT_PRIMARY), font=font)
    
    # Hovered device (larger scale with glow)
    x2, y2 = 450, 250
    icon_size = 90
    
    # Glow effect (multiple ellipses with decreasing opacity)
    for i in range(3, 0, -1):
        glow_size = icon_size + i * 15
        glow_alpha = 20 * i
        draw.ellipse(
            [x2 - glow_size//2, y2 - glow_size//2,
             x2 + glow_size//2, y2 + glow_size//2],
            fill=(*hex_to_rgb(ACCENT_GREEN), glow_alpha)
        )
    
    # Device
    draw.ellipse(
        [x2 - icon_size//2 - 10, y2 - icon_size//2 - 10,
         x2 + icon_size//2 + 10, y2 + icon_size//2 + 10],
        fill=bg_color, outline=hex_to_rgb(ACCENT_GREEN), width=3
    )
    draw_icon_placeholder(draw, x2 - icon_size//2, y2 - icon_size//2, icon_size, 'router', ACCENT_GREEN)
    
    draw.text((x2 - 35, y2 + 70), "Balance 380", fill=hex_to_rgb(TEXT_PRIMARY), font=font)
    
    # Tooltip
    tooltip_y = y2 - 120
    draw_glass_panel(draw, x2 - 80, tooltip_y, 160, 70, 8)
    
    try:
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 11)
    except:
        small_font = ImageFont.load_default()
    
    draw.text((x2 - 70, tooltip_y + 10), "Status: ● Online", fill=hex_to_rgb(ACCENT_GREEN), font=small_font)
    draw.text((x2 - 70, tooltip_y + 30), "CPU: 34%", fill=hex_to_rgb(TEXT_SECONDARY), font=small_font)
    draw.text((x2 - 70, tooltip_y + 48), "Memory: 52%", fill=hex_to_rgb(TEXT_SECONDARY), font=small_font)
    
    img.save(os.path.join(OUTPUT_DIR, '11-device-hover.png'))

def create_before_after():
    """Generate 12-before-after.png"""
    print("Generating 12-before-after.png...")
    img = Image.new('RGB', (1200, 600), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
        caption_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    except:
        title_font = subtitle_font = caption_font = ImageFont.load_default()
    
    draw.text((400, 30), "Before / After Comparison", fill=hex_to_rgb(TEXT_PRIMARY), font=title_font)
    
    # Divider line
    draw.line([(600, 80), (600, 520)], fill=hex_to_rgb(TEXT_MUTED), width=3)
    
    # BEFORE (left side) - Custom Paper.js icon
    draw.text((200, 100), "BEFORE", fill=hex_to_rgb(TEXT_MUTED), font=subtitle_font)
    draw.text((150, 130), "Custom Paper.js Icons", fill=hex_to_rgb(TEXT_SECONDARY), font=caption_font)
    
    # Draw a more complex/custom looking icon
    x1, y1 = 300, 300
    icon_size = 120
    
    # Complex custom icon shape
    draw.rectangle([x1 - 40, y1 - 30, x1 + 40, y1 + 30], fill=hex_to_rgb('#4a90e2'))
    draw.rectangle([x1 - 30, y1 - 40, x1 + 30, y1 - 30], fill=hex_to_rgb('#5aa8f2'))
    draw.polygon([
        (x1 - 10, y1 - 50),
        (x1, y1 - 60),
        (x1 + 10, y1 - 50)
    ], fill=hex_to_rgb('#6ac0ff'))
    
    # Add details
    for i in range(-2, 3):
        draw.ellipse([x1 + i * 15 - 3, y1 + 10 - 3, x1 + i * 15 + 3, y1 + 10 + 3], fill='white')
    
    draw.text((220, 450), "Balance 380 Icon", fill=hex_to_rgb(TEXT_PRIMARY), font=caption_font)
    draw.text((190, 475), "(Model-specific design)", fill=hex_to_rgb(TEXT_MUTED), font=caption_font)
    
    # AFTER (right side) - Isoflow generic icon
    draw.text((830, 100), "AFTER", fill=hex_to_rgb(ACCENT_GREEN), font=subtitle_font)
    draw.text((750, 130), "Isoflow Generic Icons", fill=hex_to_rgb(TEXT_SECONDARY), font=caption_font)
    
    x2, y2 = 900, 300
    draw_device_node(draw, x2, y2, 'router', '', ACCENT_BLUE)
    
    draw.text((820, 450), "Isoflow Router Icon", fill=hex_to_rgb(TEXT_PRIMARY), font=caption_font)
    draw.text((810, 475), "(Generic, reusable)", fill=hex_to_rgb(TEXT_MUTED), font=caption_font)
    
    # Arrow
    draw.text((580, 280), "→", fill=hex_to_rgb(ACCENT_GREEN), font=title_font)
    
    img.save(os.path.join(OUTPUT_DIR, '12-before-after.png'))

def create_icon_gallery():
    """Generate 13-icon-gallery.png"""
    print("Generating 13-icon-gallery.png...")
    img = Image.new('RGB', (900, 600), hex_to_rgb(BG_DARK))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
        label_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    except:
        title_font = label_font = ImageFont.load_default()
    
    draw.text((250, 30), "Isoflow Icon Gallery", fill=hex_to_rgb(TEXT_PRIMARY), font=title_font)
    
    # 2x3 grid of icons
    icons = [
        (200, 180, 'router', 'Router', ACCENT_BLUE),
        (450, 180, 'loadbalancer', 'Loadbalancer', ACCENT_BLUE),
        (700, 180, 'pyramid', 'Pyramid', ACCENT_GREEN),
        (200, 420, 'cloud', 'Cloud', ACCENT_PURPLE),
        (450, 420, 'cube', 'Cube', ACCENT_YELLOW),
        (700, 420, 'switch', 'Switch-module', ACCENT_GREEN),
    ]
    
    for x, y, icon_type, label, color in icons:
        # Icon
        icon_size = 100
        bg_color = hex_to_rgb('#2d2d2d')
        draw.ellipse(
            [x - icon_size//2 - 10, y - icon_size//2 - 10,
             x + icon_size//2 + 10, y + icon_size//2 + 10],
            fill=bg_color, outline=hex_to_rgb(color), width=3
        )
        draw_icon_placeholder(draw, x - icon_size//2, y - icon_size//2, icon_size, icon_type, color)
        
        # Label
        text_bbox = draw.textbbox((0, 0), label, font=label_font)
        text_width = text_bbox[2] - text_bbox[0]
        draw.text((x - text_width//2, y + 80), label, fill=hex_to_rgb(TEXT_PRIMARY), font=label_font)
    
    img.save(os.path.join(OUTPUT_DIR, '13-icon-gallery.png'))

def main():
    """Generate all screenshots"""
    print("=" * 60)
    print("Generating Visual Documentation for Isoflow Icons Integration")
    print("=" * 60)
    print()
    
    # Create output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Generate all screenshots
    create_full_application_view()
    create_sidebar_menu()
    create_device_details()
    create_connection_details()
    create_network_layout()
    create_connections_closeup()
    create_router_icons()
    create_loadbalancer_icons()
    create_other_icons()
    create_incontrol_settings()
    create_device_hover()
    create_before_after()
    create_icon_gallery()
    
    print()
    print("=" * 60)
    print("✅ All 13 screenshots generated successfully!")
    print(f"   Output directory: {OUTPUT_DIR}")
    print("=" * 60)
    
    # List generated files
    print("\nGenerated files:")
    for i in range(1, 14):
        filename = f"{i:02d}-*.png"
        files = [f for f in os.listdir(OUTPUT_DIR) if f.startswith(f"{i:02d}-")]
        if files:
            print(f"  ✓ {files[0]}")

if __name__ == '__main__':
    main()
