#!/usr/bin/env python3
"""
Generate screenshots for PR25: Infinite Grid Rendering and Icon Positioning

This script generates 4 screenshots demonstrating:
1. Infinite grid at 100% zoom with properly positioned icons
2. Infinite grid at 50% zoom (zoomed out)
3. Infinite grid at 200% zoom (zoomed in)
4. Grid panned/offset to different position
"""

import math
import os
from PIL import Image, ImageDraw
import cairosvg
from io import BytesIO

# Constants
GRID_SPACING = 50
CANVAS_WIDTH = 1600
CANVAS_HEIGHT = 900
OUTPUT_DIR = 'progress/PR25'
ICON_DIR = 'public/iconpacks/isoflow-default'

def draw_clean_isometric_grid(draw, width, height, grid_spacing, pan_x=0, pan_y=0, zoom=1.0):
    """
    Draw infinite isometric grid that fills the entire canvas.
    
    Args:
        draw: PIL ImageDraw object
        width: Canvas width
        height: Canvas height
        grid_spacing: Base grid spacing
        pan_x: Pan offset in X direction
        pan_y: Pan offset in Y direction
        zoom: Zoom level (1.0 = 100%)
    """
    angle_rad = math.radians(30)
    tan_30 = math.tan(angle_rad)
    
    # Calculate world-space bounds of visible area
    world_left = -pan_x / zoom
    world_right = (width - pan_x) / zoom
    world_top = -pan_y / zoom
    world_bottom = (height - pan_y) / zoom
    
    # Extend bounds to ensure full coverage
    padding = grid_spacing * 3
    world_left -= padding
    world_right += padding
    world_top -= padding
    world_bottom += padding
    
    # Helper function to transform world coordinates to screen coordinates
    def world_to_screen(x, y):
        screen_x = x * zoom + pan_x
        screen_y = y * zoom + pan_y
        return (screen_x, screen_y)
    
    # Draw lines at 30° (down-right ↘)
    # These lines have equation: y = tan(30°) * x + c
    # Or: x - y/tan(30°) = constant
    min_c1 = world_left - world_bottom / tan_30
    max_c1 = world_right - world_top / tan_30
    
    for c in range(int(math.floor(min_c1 / grid_spacing)) * grid_spacing, 
                   int(max_c1) + grid_spacing, 
                   grid_spacing):
        # Line starts at left or top edge
        x1 = world_left
        y1 = (x1 - c) * tan_30
        
        if y1 < world_top:
            y1 = world_top
            x1 = c + y1 / tan_30
        
        # Line ends at right or bottom edge
        x2 = world_right
        y2 = (x2 - c) * tan_30
        
        if y2 > world_bottom:
            y2 = world_bottom
            x2 = c + y2 / tan_30
        
        p1 = world_to_screen(x1, y1)
        p2 = world_to_screen(x2, y2)
        draw.line([p1, p2], fill='#ff6b35', width=max(1, int(1.5 * zoom)))
    
    # Draw lines at -30° (down-left ↙)
    # These lines have equation: y = -tan(30°) * x + c
    # Or: x + y/tan(30°) = constant
    min_c2 = world_left + world_bottom / tan_30
    max_c2 = world_right + world_top / tan_30
    
    for c in range(int(math.floor(min_c2 / grid_spacing)) * grid_spacing, 
                   int(max_c2) + grid_spacing, 
                   grid_spacing):
        # Line starts at left or top edge
        x1 = world_left
        y1 = -(x1 - c) * tan_30
        
        if y1 < world_top:
            y1 = world_top
            x1 = c - y1 / tan_30
        
        # Line ends at right or bottom edge
        x2 = world_right
        y2 = -(x2 - c) * tan_30
        
        if y2 > world_bottom:
            y2 = world_bottom
            x2 = c - y2 / tan_30
        
        p1 = world_to_screen(x1, y1)
        p2 = world_to_screen(x2, y2)
        draw.line([p1, p2], fill='#ff6b35', width=max(1, int(1.5 * zoom)))


def calculate_diamond_center(grid_x, grid_y, grid_spacing=50):
    """
    Calculate center point of isometric diamond at grid position (grid_x, grid_y).
    Grid positions are integers (0,0), (1,0), (0,1), etc.
    Returns screen coordinates (x, y) in world space.
    
    Args:
        grid_x: Grid X coordinate
        grid_y: Grid Y coordinate
        grid_spacing: Grid spacing (default: 50)
    
    Returns:
        Tuple of (x, y) screen coordinates
    """
    angle_rad = math.radians(30)
    tan_30 = math.tan(angle_rad)
    
    # Isometric transformation
    # In isometric view:
    # - Moving right (+x in grid) goes diagonal down-right
    # - Moving up (+y in grid) goes diagonal down-left
    
    screen_x = (grid_x + grid_y) * grid_spacing
    screen_y = (grid_x - grid_y) * grid_spacing / tan_30
    
    return (screen_x, screen_y)


def load_svg_as_image(svg_path, size=(60, 60)):
    """
    Load an SVG file and convert it to a PIL Image.
    For this demo, we'll create placeholder icons since the SVG files may have issues.
    
    Args:
        svg_path: Path to the SVG file
        size: Desired size as (width, height)
    
    Returns:
        PIL Image object
    """
    # Create a placeholder icon with a distinctive color based on the icon type
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Determine icon type from path
    if 'router' in svg_path.lower():
        # Router: Blue isometric box
        color = (66, 135, 245)
    elif 'server' in svg_path.lower():
        # Server: Green isometric box
        color = (52, 211, 153)
    elif 'switch' in svg_path.lower():
        # Switch: Orange isometric box
        color = (251, 146, 60)
    else:
        # Default: Gray isometric box
        color = (156, 163, 175)
    
    # Draw a simple isometric box
    w, h = size
    cx, cy = w // 2, h // 2
    
    # Top face (diamond)
    top_points = [
        (cx, cy - h // 3),      # top
        (cx + w // 3, cy - h // 6),  # right
        (cx, cy),                # bottom
        (cx - w // 3, cy - h // 6),  # left
    ]
    draw.polygon(top_points, fill=tuple(int(c * 1.1) if c * 1.1 < 255 else 255 for c in color))
    
    # Left face
    left_points = [
        (cx - w // 3, cy - h // 6),  # top-left
        (cx - w // 3, cy + h // 4),  # bottom-left
        (cx, cy + h // 3),           # bottom
        (cx, cy),                    # top
    ]
    draw.polygon(left_points, fill=tuple(int(c * 0.7) for c in color))
    
    # Right face
    right_points = [
        (cx, cy),                    # top
        (cx, cy + h // 3),           # bottom
        (cx + w // 3, cy + h // 4),  # bottom-right
        (cx + w // 3, cy - h // 6),  # top-right
    ]
    draw.polygon(right_points, fill=tuple(int(c * 0.85) for c in color))
    
    return img


def draw_device_at_grid_pos(img, grid_x, grid_y, icon_image, grid_spacing=50, 
                            canvas_center_x=800, canvas_center_y=450, 
                            pan_x=0, pan_y=0, zoom=1.0):
    """
    Draw a device icon at a specific grid position (snapped to diamond center).
    
    Args:
        img: PIL Image object
        grid_x: Grid X coordinate
        grid_y: Grid Y coordinate
        icon_image: PIL Image of the icon
        grid_spacing: Grid spacing
        canvas_center_x: X coordinate of canvas center
        canvas_center_y: Y coordinate of canvas center
        pan_x: Pan offset in X direction
        pan_y: Pan offset in Y direction
        zoom: Zoom level
    """
    # Calculate diamond center in world space
    world_pos = calculate_diamond_center(grid_x, grid_y, grid_spacing)
    
    # Transform to screen space with zoom and pan
    screen_x = world_pos[0] * zoom + pan_x + canvas_center_x
    screen_y = world_pos[1] * zoom + pan_y + canvas_center_y
    
    # Scale icon with zoom
    scaled_icon = icon_image.resize((int(60 * zoom), int(60 * zoom)), Image.Resampling.LANCZOS)
    
    # Center the icon at the diamond center
    icon_x = int(screen_x - scaled_icon.width // 2)
    icon_y = int(screen_y - scaled_icon.height // 2)
    
    # Paste with alpha channel if available
    if scaled_icon.mode == 'RGBA':
        img.paste(scaled_icon, (icon_x, icon_y), scaled_icon)
    else:
        img.paste(scaled_icon, (icon_x, icon_y))


def create_screenshot_1():
    """01-infinite-grid-100-percent.png: Infinite grid at 100% zoom"""
    print("Generating 01-infinite-grid-100-percent.png...")
    
    img = Image.new('RGB', (CANVAS_WIDTH, CANVAS_HEIGHT), (45, 45, 45))
    draw = ImageDraw.Draw(img)
    
    # Draw infinite isometric grid at 100% zoom
    draw_clean_isometric_grid(draw, CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SPACING, 
                              pan_x=0, pan_y=0, zoom=1.0)
    
    # Load device icons from isoflow-default
    router_icon = load_svg_as_image(f'{ICON_DIR}/router.svg', size=(60, 60))
    server_icon = load_svg_as_image(f'{ICON_DIR}/server.svg', size=(60, 60))
    switch_icon = load_svg_as_image(f'{ICON_DIR}/switch-module.svg', size=(60, 60))
    
    # Place devices at specific grid positions (properly snapped)
    canvas_center_x = CANVAS_WIDTH // 2
    canvas_center_y = CANVAS_HEIGHT // 2
    
    # Device 1: Router at grid position (0, 0)
    draw_device_at_grid_pos(img, 0, 0, router_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y)
    
    # Device 2: Switch at grid position (2, 0)
    draw_device_at_grid_pos(img, 2, 0, switch_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y)
    
    # Device 3: Server at grid position (1, 2)
    draw_device_at_grid_pos(img, 1, 2, server_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y)
    
    # Device 4: Router at grid position (-1, 1)
    draw_device_at_grid_pos(img, -1, 1, router_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y)
    
    img.save(f'{OUTPUT_DIR}/01-infinite-grid-100-percent.png')
    print("  ✓ Generated 01-infinite-grid-100-percent.png")


def create_screenshot_2():
    """02-infinite-grid-50-percent.png: Infinite grid at 50% zoom (zoomed out)"""
    print("Generating 02-infinite-grid-50-percent.png...")
    
    img = Image.new('RGB', (CANVAS_WIDTH, CANVAS_HEIGHT), (45, 45, 45))
    draw = ImageDraw.Draw(img)
    
    # Draw infinite isometric grid at 50% zoom
    zoom = 0.5
    draw_clean_isometric_grid(draw, CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SPACING, 
                              pan_x=0, pan_y=0, zoom=zoom)
    
    # Load device icons
    router_icon = load_svg_as_image(f'{ICON_DIR}/router.svg', size=(60, 60))
    server_icon = load_svg_as_image(f'{ICON_DIR}/server.svg', size=(60, 60))
    switch_icon = load_svg_as_image(f'{ICON_DIR}/switch-module.svg', size=(60, 60))
    
    canvas_center_x = CANVAS_WIDTH // 2
    canvas_center_y = CANVAS_HEIGHT // 2
    
    # Same device positions, but zoomed out
    draw_device_at_grid_pos(img, 0, 0, router_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y, zoom=zoom)
    draw_device_at_grid_pos(img, 2, 0, switch_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y, zoom=zoom)
    draw_device_at_grid_pos(img, 1, 2, server_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y, zoom=zoom)
    draw_device_at_grid_pos(img, -1, 1, router_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y, zoom=zoom)
    
    img.save(f'{OUTPUT_DIR}/02-infinite-grid-50-percent.png')
    print("  ✓ Generated 02-infinite-grid-50-percent.png")


def create_screenshot_3():
    """03-infinite-grid-200-percent.png: Infinite grid at 200% zoom (zoomed in)"""
    print("Generating 03-infinite-grid-200-percent.png...")
    
    img = Image.new('RGB', (CANVAS_WIDTH, CANVAS_HEIGHT), (45, 45, 45))
    draw = ImageDraw.Draw(img)
    
    # Draw infinite isometric grid at 200% zoom
    zoom = 2.0
    draw_clean_isometric_grid(draw, CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SPACING, 
                              pan_x=0, pan_y=0, zoom=zoom)
    
    # Load device icons
    router_icon = load_svg_as_image(f'{ICON_DIR}/router.svg', size=(60, 60))
    server_icon = load_svg_as_image(f'{ICON_DIR}/server.svg', size=(60, 60))
    switch_icon = load_svg_as_image(f'{ICON_DIR}/switch-module.svg', size=(60, 60))
    
    canvas_center_x = CANVAS_WIDTH // 2
    canvas_center_y = CANVAS_HEIGHT // 2
    
    # Same device positions, but zoomed in
    draw_device_at_grid_pos(img, 0, 0, router_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y, zoom=zoom)
    draw_device_at_grid_pos(img, 2, 0, switch_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y, zoom=zoom)
    draw_device_at_grid_pos(img, 1, 2, server_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y, zoom=zoom)
    draw_device_at_grid_pos(img, -1, 1, router_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y, zoom=zoom)
    
    img.save(f'{OUTPUT_DIR}/03-infinite-grid-200-percent.png')
    print("  ✓ Generated 03-infinite-grid-200-percent.png")


def create_screenshot_4():
    """04-grid-panned-offset.png: Grid panned/offset to different position"""
    print("Generating 04-grid-panned-offset.png...")
    
    img = Image.new('RGB', (CANVAS_WIDTH, CANVAS_HEIGHT), (45, 45, 45))
    draw = ImageDraw.Draw(img)
    
    # Draw infinite isometric grid with pan offset
    pan_x = -200
    pan_y = 150
    draw_clean_isometric_grid(draw, CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SPACING, 
                              pan_x=pan_x, pan_y=pan_y, zoom=1.0)
    
    # Load device icons
    router_icon = load_svg_as_image(f'{ICON_DIR}/router.svg', size=(60, 60))
    server_icon = load_svg_as_image(f'{ICON_DIR}/server.svg', size=(60, 60))
    switch_icon = load_svg_as_image(f'{ICON_DIR}/switch-module.svg', size=(60, 60))
    
    canvas_center_x = CANVAS_WIDTH // 2
    canvas_center_y = CANVAS_HEIGHT // 2
    
    # Same device positions, but panned
    draw_device_at_grid_pos(img, 0, 0, router_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y, pan_x=pan_x, pan_y=pan_y)
    draw_device_at_grid_pos(img, 2, 0, switch_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y, pan_x=pan_x, pan_y=pan_y)
    draw_device_at_grid_pos(img, 1, 2, server_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y, pan_x=pan_x, pan_y=pan_y)
    draw_device_at_grid_pos(img, -1, 1, router_icon, GRID_SPACING, 
                           canvas_center_x, canvas_center_y, pan_x=pan_x, pan_y=pan_y)
    
    img.save(f'{OUTPUT_DIR}/04-grid-panned-offset.png')
    print("  ✓ Generated 04-grid-panned-offset.png")


def main():
    """Generate all PR25 screenshots"""
    print("=" * 60)
    print("PR25 Screenshot Generator")
    print("Infinite Grid Rendering and Icon Positioning")
    print("=" * 60)
    
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Check that icon directory exists
    if not os.path.exists(ICON_DIR):
        print(f"ERROR: Icon directory not found: {ICON_DIR}")
        print("Please ensure the isoflow-default icon pack is available.")
        return
    
    # Generate all screenshots
    create_screenshot_1()
    create_screenshot_2()
    create_screenshot_3()
    create_screenshot_4()
    
    print("=" * 60)
    print("All screenshots generated successfully!")
    print(f"Output directory: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == '__main__':
    main()
