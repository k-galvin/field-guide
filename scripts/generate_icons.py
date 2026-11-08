import math
from PIL import Image, ImageDraw

def create_archival_icon(size=2048):
    # Render at high resolution for super-sampled anti-aliasing
    scale = size / 512.0
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # 1. Background: Iconic Archival Klein Blue
    # #0047ab = (0, 71, 171)
    # Slight subtle gradient/vignette from center (0, 75, 185) to corner (0, 65, 155) for luminous iOS feel
    cx, cy = size / 2.0, size / 2.0
    max_r = math.hypot(cx, cy)
    
    # We can create a radial gradient image or uniform rich Klein Blue
    # In iOS homescreen icons, flat bold Klein Blue with crisp geometry has that iconic Swiss/Dieter Rams/Archival aesthetic
    base_blue = (0, 71, 171, 255) # Klein Blue #0047ab
    
    # Draw solid blue background
    draw.rectangle([0, 0, size, size], fill=base_blue)

    # Blueprint corner calibration brackets: [ ] in 4 corners (inside safe zone)
    # Margin ~14%
    m = 70.0 * scale
    bracket_len = 32.0 * scale
    bracket_w = int(max(3, 4.0 * scale))
    white = (255, 255, 255, 255)
    white_trans = (255, 255, 255, 180)

    # Top-Left bracket
    draw.line([(m, m), (m + bracket_len, m)], fill=white_trans, width=bracket_w)
    draw.line([(m, m), (m, m + bracket_len)], fill=white_trans, width=bracket_w)

    # Top-Right bracket
    draw.line([(size - m, m), (size - m - bracket_len, m)], fill=white_trans, width=bracket_w)
    draw.line([(size - m, m), (size - m, m + bracket_len)], fill=white_trans, width=bracket_w)

    # Bottom-Left bracket
    draw.line([(m, size - m), (m + bracket_len, size - m)], fill=white_trans, width=bracket_w)
    draw.line([(m, size - m), (m, size - m - bracket_len)], fill=white_trans, width=bracket_w)

    # Bottom-Right bracket
    draw.line([(size - m, size - m), (size - m - bracket_len, size - m)], fill=white_trans, width=bracket_w)
    draw.line([(size - m, size - m), (size - m, size - m - bracket_len)], fill=white_trans, width=bracket_w)

    # Center Reticle & Compass Geometry:
    # Outer circle: radius = 135 * scale
    r_outer = 135.0 * scale
    circle_w = max(3, int(4.5 * scale))
    draw.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], outline=white, width=circle_w)

    # Mid dashed / secondary circle: radius = 95 * scale
    r_mid = 92.0 * scale
    mid_w = max(2, int(2.5 * scale))
    draw.ellipse([cx - r_mid, cy - r_mid, cx + r_mid, cy + r_mid], outline=(255, 255, 255, 140), width=mid_w)

    # Crosshair lines cutting through
    # Cardinal ticks extend past outer ring: from r_outer - 15 to r_outer + 25
    cross_w = max(3, int(4.5 * scale))
    tick_in = r_outer - 20.0 * scale
    tick_out = r_outer + 28.0 * scale

    # North tick
    draw.line([(cx, cy - tick_in), (cx, cy - tick_out)], fill=white, width=cross_w)
    # South tick
    draw.line([(cx, cy + tick_in), (cx, cy + tick_out)], fill=white, width=cross_w)
    # West tick
    draw.line([(cx - tick_in, cy), (cx - tick_out, cy)], fill=white, width=cross_w)
    # East tick
    draw.line([(cx + tick_in, cy), (cx + tick_out, cy)], fill=white, width=cross_w)

    # 4 Cardinal Dots at compass points outside ticks
    dot_r = 4.0 * scale
    dot_dist = r_outer + 44.0 * scale
    for angle in [0, 90, 180, 270]:
        rad = math.radians(angle)
        dx = cx + dot_dist * math.cos(rad)
        dy = cy + dot_dist * math.sin(rad)
        draw.ellipse([dx - dot_r, dy - dot_r, dx + dot_r, dy + dot_r], fill=white)

    # Center Compass Star (architectural drafting 4-point faceted star)
    # North/South/East/West main tips: length 60 * scale
    # Inner corners: length 16 * scale
    r_tip = 58.0 * scale
    r_inner = 14.0 * scale
    
    # 8-point polygon: (tip_n, in_ne, tip_e, in_se, tip_s, in_sw, tip_w, in_nw)
    # Let's draw with alternating facets for subtle architectural depth!
    pts_n = (cx, cy - r_tip)
    pts_s = (cx, cy + r_tip)
    pts_e = (cx + r_tip, cy)
    pts_w = (cx - r_tip, cy)

    in_ne = (cx + r_inner * 0.7071, cy - r_inner * 0.7071)
    in_se = (cx + r_inner * 0.7071, cy + r_inner * 0.7071)
    in_sw = (cx - r_inner * 0.7071, cy + r_inner * 0.7071)
    in_nw = (cx - r_inner * 0.7071, cy - r_inner * 0.7071)

    # Facet 1 (N-right, S-left, E-bottom, W-top) pure white
    # Facet 2 subtle shaded white (220, 235, 255) for crisp vector drafting facet look
    c_bright = (255, 255, 255, 255)
    c_shade = (215, 230, 255, 255)

    # North blade
    draw.polygon([(cx, cy), pts_n, in_ne], fill=c_bright)
    draw.polygon([(cx, cy), pts_n, in_nw], fill=c_shade)

    # East blade
    draw.polygon([(cx, cy), pts_e, in_se], fill=c_bright)
    draw.polygon([(cx, cy), pts_e, in_ne], fill=c_shade)

    # South blade
    draw.polygon([(cx, cy), pts_s, in_sw], fill=c_bright)
    draw.polygon([(cx, cy), pts_s, in_se], fill=c_shade)

    # West blade
    draw.polygon([(cx, cy), pts_w, in_nw], fill=c_bright)
    draw.polygon([(cx, cy), pts_w, in_sw], fill=c_shade)

    # Center reticle dot
    center_dot_r = 5.0 * scale
    draw.ellipse([cx - center_dot_r, cy - center_dot_r, cx + center_dot_r, cy + center_dot_r], fill=(0, 71, 171, 255), outline=white, width=int(2.5 * scale))

    return im

def create_favicon_32():
    # Tailored specifically for 32x32 pixel density so lines stay crisp and not blurry
    im = Image.new('RGBA', (128, 128), (0, 71, 171, 255))
    draw = ImageDraw.Draw(im)
    cx, cy = 64, 64
    
    # Outer ring
    draw.ellipse([20, 20, 108, 108], outline=(255, 255, 255, 255), width=8)
    
    # 4 Cardinal crosshair ticks
    draw.line([(64, 8), (64, 30)], fill=(255, 255, 255, 255), width=8)
    draw.line([(64, 98), (64, 120)], fill=(255, 255, 255, 255), width=8)
    draw.line([(8, 64), (30, 64)], fill=(255, 255, 255, 255), width=8)
    draw.line([(98, 64), (120, 64)], fill=(255, 255, 255, 255), width=8)
    
    # Central diamond
    d = 26
    draw.polygon([(64, 64 - d), (64 + d, 64), (64, 64 + d), (64 - d, 64)], fill=(255, 255, 255, 255))
    
    # Center dot
    draw.ellipse([58, 58, 70, 70], fill=(0, 71, 171, 255))
    
    return im.resize((32, 32), Image.Resampling.LANCZOS)

# Generate master
master = create_archival_icon(2048)

# Export all sizes
icon_512 = master.resize((512, 512), Image.Resampling.LANCZOS)
icon_512.save('icons/icon-512.png', 'PNG')

icon_192 = master.resize((192, 192), Image.Resampling.LANCZOS)
icon_192.save('icons/icon-192.png', 'PNG')

icon_apple = master.resize((180, 180), Image.Resampling.LANCZOS)
icon_apple.save('icons/apple-touch-icon.png', 'PNG')

fav_32 = create_favicon_32()
fav_32.save('icons/favicon-32x32.png', 'PNG')

print("Generated all icons successfully!")
