with open('portfolio.html', 'r') as f:
    content = f.read()

# Proiectele și locațiile lor exacte
projects = {
    "budget-tracker-web": "budget-tracker-web/",
    "hash-table": "hash-table/", 
    "isbn-validator": "isbn-validator/",
    "polygon-calculator": "polygon-calculator/",
    "quicksort-visualizer": "quicksort-visualizer/",
    "rpg-game-final": "rpg-game-final/"  # Acum va merge către index.html din root care redirecționează
}

# Corectează fiecare link
for project, path in projects.items():
    # Găsește toate link-urile pentru acest proiect
    import re
    
    # Pattern pentru href="proiect/" (cu sau fără slash la început)
    pattern1 = f'href=["\']{project}/["\']'
    replacement1 = f'href="{path}"'
    content = re.sub(pattern1, replacement1, content)
    
    pattern2 = f'href=["\']/{project}/["\']'
    replacement2 = f'href="{path}"'
    content = re.sub(pattern2, replacement2, content)

# Scrie fișierul corectat
with open('portfolio.html', 'w') as f:
    f.write(content)

print("✅ Portfolio links fixed to point to exact locations")
print("Project paths:")
for project, path in projects.items():
    print(f"  - {project}: {path}")
