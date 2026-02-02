import json

with open('budget_data.json', 'r') as f:
    old_data = json.load(f)

new_data = {
    'transactions': old_data,
    'next_id': len(old_data) + 1
}

with open('budget_data.json', 'w') as f:
    json.dump(new_data, f, indent=2)

print(f"✅ Converted {len(old_data)} transactions to new format")
