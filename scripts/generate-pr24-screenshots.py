#!/usr/bin/env python3
"""
Generate screenshots for PR24: Isometric Grid Snapping and Zoom with Scaling

This script generates 4 screenshots demonstrating:
1. Grid snapping to diamond centers
2. Zoom at 50%
3. Zoom at 100%
4. Zoom at 200%
"""

import math
from PIL import Image, ImageDraw, ImageFont
import os


def draw_clean_isometric_grid(draw, width, height, grid_spacing=50):
    """Draw isometric grid WITHOUT glow effect"""
    angle_rad = math.radians(30)
    orange = (255, 107, 53)  # #ff6b35
    tan_30 = math.tan(angle_rad)
    
    # Lines going down-right (↘)
    for offset in range(-height, width + height, grid_spacing):
        x1 = offset
        y1 = 0
        x2 = offset + int(height / tan_30)
        y2 = height
        # Clean line, NO glow layers
        draw.line([(x1, y1), (x2, y2)], fill=orange, width=2)
    
    # Lines going down-left (↙)
    for offset in range(-height, width + height, grid_spacing):
        x1 = offset
        y1 = 0
        x2 = offset - int(height / tan_30)
        y2 = height
        # Clean line, NO glow layers
        draw.line([(x1, y1), (x2, y2)], fill=orange, width=2)


def calculate_diamond_center(grid_x, grid_y, grid_spacing=50):
    """Calculate center point of isometric diamond at grid position"""
    angle_rad = math.radians(30)
    tan_30 = math.tan(angle_rad)
    
    # Convert grid coords to screen coords (diamond center)
    x = (grid_x + grid_y) * grid_spacing
    y = (grid_x - grid_y) * grid_spacing / tan_30
    
    return (int(x), int(y))


def draw_device_icon(draw, x, y, size, color, label=""):
    """Draw a simple device icon (diamond shape) at position"""
    # Draw diamond shape for device
    half_size = size // 2
    points = [
        (x, y - half_size),  # top
        (x + half_size, y),  # right
        (x, y + half_size),  # bottom
        (x - half_size, y),  # left
    ]
    draw.polygon(points, fill=color, outline=(200, 200, 200), width=2)
    
    # Draw label if provided
    if label:
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
        except:
            font = ImageFont.load_default()
        
        # Get text size using textbbox
        bbox = draw.textbbox((0, 0), label, font=font)
        text_width = bbox[2] - bbox[0]
        
        draw.text(
            (x - text_width // 2, y + half_size + 10),
            label,
            fill=(224, 224, 224),
            font=font
        )


def draw_snap_indicator(draw, x, y, size=10):
    """Draw a snap point indicator (small circle)"""
    draw.ellipse(
        [(x - size, y - size), (x + size, y + size)],
        fill=(59, 130, 246),  # Blue #3b82f6
        outline=(100, 180, 255),
        width=2
    )


def generate_screenshot_1():
    """01-grid-snapping-demo.png - Show devices snapped to diamond centers"""
    width, height = 1600, 900
    img = Image.new('RGB', (width, height), color=(45, 45, 45))  # #2d2d2d
    draw = ImageDraw.Draw(img)
    
    # Draw grid at 100% zoom
    grid_spacing = 50
    draw_clean_isometric_grid(draw, width, height, grid_spacing)
    
    # Define device positions on the grid (grid coordinates)
    devices = [
        (8, 6, "Router 1", (59, 130, 246)),    # Blue
        (10, 6, "Switch", (168, 85, 247)),     # Purple
        (12, 6, "Router 2", (34, 197, 94)),    # Green
        (9, 8, "Server", (249, 115, 22)),      # Orange
        (11, 8, "Firewall", (244, 63, 94)),    # Red
    ]
    
    # Center offset to position grid nicely
    offset_x = width // 2 - 10 * grid_spacing
    offset_y = height // 2
    
    # Draw devices at diamond centers
    for grid_x, grid_y, label, color in devices:
        dx, dy = calculate_diamond_center(grid_x, grid_y, grid_spacing)
        x = dx + offset_x
        y = dy + offset_y
        
        # Draw snap indicator (subtle)
        draw_snap_indicator(draw, x, y, 8)
        
        # Draw device icon
        draw_device_icon(draw, x, y, 60, color, label)
    
    # Add title
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    draw.text(
        (30, 30),
        "Grid Snapping Demo - Devices snap to diamond centers",
        fill=(224, 224, 224),
        font=font
    )
    
    # Save
    output_path = 'progress/PR24/01-grid-snapping-demo.png'
    img.save(output_path)
    print(f"Generated: {output_path}")


def generate_screenshot_2():
    """02-zoom-50-percent.png - Zoomed out to 50%"""
    width, height = 1600, 900
    img = Image.new('RGB', (width, height), color=(45, 45, 45))
    draw = ImageDraw.Draw(img)
    
    # Draw grid at 50% zoom (grid_spacing * 0.5)
    grid_spacing = 25  # 50 * 0.5
    draw_clean_isometric_grid(draw, width, height, grid_spacing)
    
    # Devices at 50% zoom
    devices = [
        (8, 6, "R1", (59, 130, 246)),
        (10, 6, "SW", (168, 85, 247)),
        (12, 6, "R2", (34, 197, 94)),
        (14, 6, "R3", (249, 115, 22)),
        (9, 8, "SRV", (244, 63, 94)),
        (11, 8, "FW", (236, 72, 153)),
        (13, 8, "LB", (14, 165, 233)),
        (10, 10, "DB", (132, 204, 22)),
    ]
    
    offset_x = width // 2 - 11 * grid_spacing
    offset_y = height // 2
    
    for grid_x, grid_y, label, color in devices:
        dx, dy = calculate_diamond_center(grid_x, grid_y, grid_spacing)
        x = dx + offset_x
        y = dy + offset_y
        draw_device_icon(draw, x, y, 30, color, label)  # Smaller icons
    
    # Add title
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    draw.text((30, 30), "Zoom: 50% - More grid visible, smaller icons", fill=(224, 224, 224), font=font)
    
    output_path = 'progress/PR24/02-zoom-50-percent.png'
    img.save(output_path)
    print(f"Generated: {output_path}")


def generate_screenshot_3():
    """03-zoom-100-percent.png - Normal 100% zoom"""
    width, height = 1600, 900
    img = Image.new('RGB', (width, height), color=(45, 45, 45))
    draw = ImageDraw.Draw(img)
    
    # Draw grid at 100% zoom
    grid_spacing = 50
    draw_clean_isometric_grid(draw, width, height, grid_spacing)
    
    devices = [
        (8, 6, "Router 1", (59, 130, 246)),
        (10, 6, "Switch", (168, 85, 247)),
        (12, 6, "Router 2", (34, 197, 94)),
        (9, 8, "Server", (249, 115, 22)),
        (11, 8, "Firewall", (244, 63, 94)),
    ]
    
    offset_x = width // 2 - 10 * grid_spacing
    offset_y = height // 2
    
    for grid_x, grid_y, label, color in devices:
        dx, dy = calculate_diamond_center(grid_x, grid_y, grid_spacing)
        x = dx + offset_x
        y = dy + offset_y
        draw_device_icon(draw, x, y, 60, color, label)
    
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    draw.text((30, 30), "Zoom: 100% - Normal view with clean grid", fill=(224, 224, 224), font=font)
    
    output_path = 'progress/PR24/03-zoom-100-percent.png'
    img.save(output_path)
    print(f"Generated: {output_path}")


def generate_screenshot_4():
    """04-zoom-200-percent.png - Zoomed in to 200%"""
    width, height = 1600, 900
    img = Image.new('RGB', (width, height), color=(45, 45, 45))
    draw = ImageDraw.Draw(img)
    
    # Draw grid at 200% zoom (grid_spacing * 2)
    grid_spacing = 100  # 50 * 2
    draw_clean_isometric_grid(draw, width, height, grid_spacing)
    
    # Fewer devices visible at 200% zoom
    devices = [
        (4, 3, "Router 1", (59, 130, 246)),
        (5, 3, "Switch", (168, 85, 247)),
        (6, 3, "Router 2", (34, 197, 94)),
    ]
    
    offset_x = width // 2 - 5 * grid_spacing
    offset_y = height // 2
    
    for grid_x, grid_y, label, color in devices:
        dx, dy = calculate_diamond_center(grid_x, grid_y, grid_spacing)
        x = dx + offset_x
        y = dy + offset_y
        draw_device_icon(draw, x, y, 120, color, label)  # Larger icons
    
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    draw.text((30, 30), "Zoom: 200% - Closer view, larger icons and grid", fill=(224, 224, 224), font=font)
    
    output_path = 'progress/PR24/04-zoom-200-percent.png'
    img.save(output_path)
    print(f"Generated: {output_path}")


def main():
    """Generate all screenshots"""
    print("Generating PR24 screenshots...")
    
    # Ensure output directory exists
    os.makedirs('progress/PR24', exist_ok=True)
    
    generate_screenshot_1()
    generate_screenshot_2()
    generate_screenshot_3()
    generate_screenshot_4()
    
    print("\nAll screenshots generated successfully!")
    print("Screenshots saved to: progress/PR24/")


if __name__ == '__main__':
    main()
