from screeninfo import Monitor, get_monitors

for monitor in get_monitors():
    print("[DEBUG]", monitor.__dict__)
