"""Extract middle (AUTO CAD) icon — centered on the red logo from Figma screenshot."""
from PIL import Image

FIGMA = r"C:\Users\ASD\.cursor\projects\c-Users-ASD-Desktop-Varsovia-design\assets\c__Users_ASD_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-3630f6ff-c62d-4304-a572-d9164afd8d17.png"
OUT = r"C:\Users\ASD\Desktop\Varsovia.design\Varsovia-frontend\public\team\design-tools\autocad.png"

im = Image.open(FIGMA).convert("RGBA")
w, h = im.size
x0, x1 = w // 3, (2 * w) // 3
seg = im.crop((x0, 0, x1, h))
sw, sh = seg.size
px = seg.load()

sum_x = sum_y = count = 0
for y in range(int(sh * 0.05), int(sh * 0.55)):
    for x in range(sw):
        r, g, b, a = px[x, y]
        if a < 200:
            continue
        # AutoCAD red / maroon logo
        if r > 140 and g < 110 and b < 110 and r > g + 25:
            sum_x += x
            sum_y += y
            count += 1

cx, cy = (sum_x // count, sum_y // count) if count > 50 else (sw // 2, int(sh * 0.33))
radius = int(min(sw, sh) * 0.19)

box = (cx - radius, cy - radius, cx + radius, cy + radius)
crop = seg.crop(box)
crop = crop.resize((280, 280), Image.Resampling.LANCZOS)
crop.save(OUT)
print("logo center", cx, cy, "samples", count, "box", box)
