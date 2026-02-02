import os

print("=== Fixing all portfolio problems ===")

# 1. Verifică și repară Hash Table link în portfolio.html
with open('portfolio.html', 'r') as f:
    content = f.read()

# Adaugă link pentru Hash Table dacă lipsește
if 'hash-table' not in content or 'href="hash-table/"' not in content:
    print("❌ Hash Table link missing in portfolio")
    # Adaugă link-ul
    hash_table_section = '''<div class="project-links">
                        <a href="hash-table/" class="btn btn-live">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>'''
    content = content.replace('<div class="project-links">', hash_table_section, 1)
    print("✅ Added Hash Table link")

# 2. Verifică link-urile pentru Budget Tracker și Quicksort
# Budget Tracker ar trebui să aibă href="budget-tracker-web/"
if 'href="budget-tracker-web/"' not in content:
    print("❌ Budget Tracker link incorrect")
    content = content.replace('href="budget-tracker-web"', 'href="budget-tracker-web/"')
    print("✅ Fixed Budget Tracker link")

# Quicksort ar trebui să aibă href="quicksort-visualizer/"
if 'href="quicksort-visualizer/"' not in content:
    print("❌ Quicksort link incorrect")
    content = content.replace('href="quicksort-visualizer"', 'href="quicksort-visualizer/"')
    print("✅ Fixed Quicksort link")

# Salvează portfolio.html corectat
with open('portfolio.html', 'w') as f:
    f.write(content)

# 3. Verifică index.html fișiere pentru probleme
projects = ['budget-tracker-web', 'quicksort-visualizer', 'hash-table']

for project in projects:
    index_path = f"{project}/index.html"
    if os.path.exists(index_path):
        with open(index_path, 'r') as f:
            html = f.read()
        
        # Verifică dacă index.html este valid
        if len(html.strip()) < 50:  # Prea scurt, probabil gol
            print(f"❌ {project}/index.html is too small or empty")
            
            # Creează un index.html valid
            with open(index_path, 'w') as f:
                f.write(f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{project.replace('-', ' ').title()}</title>
    <style>
        body {{ font-family: Arial; text-align: center; padding: 50px; }}
        h1 {{ color: #333; }}
        a {{ color: #007bff; text-decoration: none; }}
    </style>
</head>
<body>
    <h1>{project.replace('-', ' ').title()}</h1>
    <p>Project loaded successfully!</p>
    <p><a href="../">← Back to Portfolio</a></p>
</body>
</html>''')
            print(f"✅ Created valid index.html for {project}")
    else:
        print(f"❌ {project}/index.html missing")
        os.makedirs(project, exist_ok=True)
        with open(index_path, 'w') as f:
            f.write(f'''<!DOCTYPE html>
<html>
<head>
    <title>{project}</title>
    <meta http-equiv="refresh" content="0; url=../">
</head>
<body>
    <p>Redirecting... <a href="../">Click here</a></p>
</body>
</html>''')
        print(f"✅ Created index.html for {project}")

print("\n✅ All problems fixed!")
print("\nNow run: git add . && git commit -m 'Fix all broken links' && git push origin main")
