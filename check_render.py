import urllib.request

html = urllib.request.urlopen('https://ai-employee-app-1.onrender.com/dashboard/numbers').read().decode('utf-8', errors='ignore')

# Check for new UI elements
checks = ['timeFilter', 'Total Leads', 'Stats Cards', 'Clear Filters', 'Call Logs', 'payment_status', 'conversion_status']
for c in checks:
    print(f"{c}: {'FOUND' if c in html else 'NOT FOUND'}")

# Check webpack hash
parts = html.split('"')
for p in parts:
    if 'webpack-' in p and '.js' in p:
        print(f"WEBPACK: {p}")
        break

# Check local build webpack
import os
local_html_path = os.path.join('C:\\xampp\\htdocs\\ai-employee-app', '.next', 'server', 'app', 'dashboard', 'numbers', 'page.html')
if os.path.exists(local_html_path):
    local = open(local_html_path).read()
    for p2 in local.split('"'):
        if 'webpack-' in p2 and '.js' in p2:
            print(f"LOCAL WEBPACK: {p2}")
            break
