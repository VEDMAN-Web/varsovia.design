from PIL import Image

src_path = r"C:\Users\ASD\.cursor\projects\c-Users-ASD-Desktop-Varsovia-design\assets\c__Users_ASD_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-3630f6ff-c62d-4304-a572-d9164afd8d17.png"
out_dir = r"C:\Users\ASD\Desktop\Varsovia.design\Varsovia-frontend\public\team\design-tools"

im = Image.open(src_path).convert("RGBA")
w, h = im.size
third = w // 3
names = ["caxa.png", "autocad.png", "3dmax.png"]

for i, name in enumerate(names):
    x0 = i * third
    x1 = (i + 1) * third if i < 2 else w
    segment = im.crop((x0, 0, x1, h))
    sw, sh = segment.size
    cx, cy = sw // 2, int(sh * 0.31)
    radius = int(min(sw, sh) * 0.21)
    box = (cx - radius, cy - radius, cx + radius, cy + radius)
    crop = segment.crop(box)
    crop.save(f"{out_dir}/{name}")
    print(name, "segment", (x0, x1), "box", box, "out", crop.size)
