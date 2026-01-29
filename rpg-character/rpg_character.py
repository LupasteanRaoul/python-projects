# rpg_character.py
import random
import json
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
from enum import Enum
import pickle

class CharacterClass(Enum):
    WARRIOR = "Warrior"
    MAGE = "Mage"
    ROGUE = "Rogue"
    CLERIC = "Cleric"
    RANGER = "Ranger"
    PALADIN = "Paladin"

class Race(Enum):
    HUMAN = "Human"
    ELF = "Elf"
    DWARF = "Dwarf"
    ORC = "Orc"
    HALFLING = "Halfling"
    GNOME = "Gnome"

@dataclass
class Equipment:
    name: str
    type: str  # weapon, armor, accessory
    attack_bonus: int = 0
    defense_bonus: int = 0
    magic_bonus: int = 0
    value: int = 0

@dataclass
class Skill:
    name: str
    description: str
    damage_multiplier: float
    mana_cost: int
    level_required: int = 1

class RPGCharacter:
    def __init__(self, name: str, char_class: CharacterClass, race: Race):
        self.name = name
        self.char_class = char_class
        self.race = race
        self.level = 1
        self.experience = 0
        self.max_experience = 100
        
        # Atribute de bază
        self.strength = self._generate_attribute()
        self.dexterity = self._generate_attribute()
        self.constitution = self._generate_attribute()
        self.intelligence = self._generate_attribute()
        self.wisdom = self._generate_attribute()
        self.charisma = self._generate_attribute()
        
        # Aplică bonusurile de rasă
        self._apply_race_bonuses()
        
        # Aplică bonusurile de clasă
        self._apply_class_bonuses()
        
        # Statistici derivate
        self.max_health = self._calculate_max_health()
        self.current_health = self.max_health
        self.max_mana = self._calculate_max_mana()
        self.current_mana = self.max_mana
        self.attack_power = self._calculate_attack_power()
        self.defense = self._calculate_defense()
        
        # Inventar și echipament
        self.equipment: List[Equipment] = []
        self.skills: List[Skill] = []
        self.gold = random.randint(10, 50)
        self.inventory = []
        
        # Generează echipament inițial
        self._generate_starting_equipment()
        self._generate_starting_skills()
    
    def _generate_attribute(self) -> int:
        """Generează un atribut folosind metoda 4d6 drop lowest"""
        dice = [random.randint(1, 6) for _ in range(4)]
        dice.remove(min(dice))
        return sum(dice)
    
    def _apply_race_bonuses(self):
        """Aplică bonusurile de rasă"""
        bonuses = {
            Race.HUMAN: {'strength': 1, 'dexterity': 1, 'constitution': 1, 
                        'intelligence': 1, 'wisdom': 1, 'charisma': 1},
            Race.ELF: {'dexterity': 2, 'intelligence': 1, 'constitution': -1},
            Race.DWARF: {'constitution': 2, 'wisdom': 1, 'charisma': -1},
            Race.ORC: {'strength': 2, 'constitution': 1, 'intelligence': -1, 'charisma': -1},
            Race.HALFLING: {'dexterity': 2, 'charisma': 1, 'strength': -1},
            Race.GNOME: {'intelligence': 2, 'constitution': 1, 'strength': -1}
        }
        
        if self.race in bonuses:
            for attr, bonus in bonuses[self.race].items():
                current_value = getattr(self, attr)
                setattr(self, attr, max(1, current_value + bonus))
    
    def _apply_class_bonuses(self):
        """Aplică bonusurile de clasă"""
        bonuses = {
            CharacterClass.WARRIOR: {'strength': 2, 'constitution': 1},
            CharacterClass.MAGE: {'intelligence': 2, 'wisdom': 1},
            CharacterClass.ROGUE: {'dexterity': 2, 'charisma': 1},
            CharacterClass.CLERIC: {'wisdom': 2, 'constitution': 1},
            CharacterClass.RANGER: {'dexterity': 2, 'wisdom': 1},
            CharacterClass.PALADIN: {'strength': 1, 'wisdom': 1, 'charisma': 1}
        }
        
        if self.char_class in bonuses:
            for attr, bonus in bonuses[self.char_class].items():
                current_value = getattr(self, attr)
                setattr(self, attr, current_value + bonus)
    
    def _calculate_max_health(self) -> int:
        """Calculează viața maximă"""
        base = 20
        con_bonus = (self.constitution - 10) // 2
        level_bonus = (self.level - 1) * 5
        
        if self.char_class == CharacterClass.WARRIOR:
            base += 10
        elif self.char_class == CharacterClass.CLERIC:
            base += 5
        
        return base + con_bonus * 2 + level_bonus
    
    def _calculate_max_mana(self) -> int:
        """Calculează mana maximă"""
        base = 10
        int_bonus = (self.intelligence - 10) // 2
        wis_bonus = (self.wisdom - 10) // 2
        
        if self.char_class == CharacterClass.MAGE:
            base += 20
        elif self.char_class in [CharacterClass.CLERIC, CharacterClass.PALADIN]:
            base += 10
        
        return base + (int_bonus + wis_bonus) * 3
    
    def _calculate_attack_power(self) -> int:
        """Calculează puterea de atac"""
        if self.char_class in [CharacterClass.WARRIOR, CharacterClass.PALADIN]:
            primary = self.strength
        elif self.char_class in [CharacterClass.ROGUE, CharacterClass.RANGER]:
            primary = self.dexterity
        else:
            primary = self.intelligence
        
        return max(1, (primary - 10) // 2 + self.level)
    
    def _calculate_defense(self) -> int:
        """Calculează apărarea"""
        base = 10
        dex_bonus = (self.dexterity - 10) // 2
        
        if self.char_class in [CharacterClass.WARRIOR, CharacterClass.PALADIN]:
            base += 3
        elif self.char_class == CharacterClass.ROGUE:
            base += 2
        
        return base + dex_bonus
    
    def _generate_starting_equipment(self):
        """Generează echipamentul inițial bazat pe clasă"""
        equipment_sets = {
            CharacterClass.WARRIOR: [
                Equipment("Longsword", "weapon", attack_bonus=3, value=25),
                Equipment("Chainmail", "armor", defense_bonus=4, value=50),
                Equipment("Shield", "armor", defense_bonus=2, value=15)
            ],
            CharacterClass.MAGE: [
                Equipment("Oak Staff", "weapon", attack_bonus=1, magic_bonus=3, value=30),
                Equipment("Robe", "armor", defense_bonus=1, value=10),
                Equipment("Magic Amulet", "accessory", magic_bonus=2, value=40)
            ],
            CharacterClass.ROGUE: [
                Equipment("Dagger Pair", "weapon", attack_bonus=2, value=20),
                Equipment("Leather Armor", "armor", defense_bonus=2, value=25),
                Equipment("Lockpicks", "accessory", value=15)
            ]
        }
        
        default_set = [
            Equipment("Basic Weapon", "weapon", attack_bonus=1, value=10),
            Equipment("Basic Armor", "armor", defense_bonus=1, value=10)
        ]
        
        self.equipment = equipment_sets.get(self.char_class, default_set)
    
    def _generate_starting_skills(self):
        """Generează skill-urile inițiale"""
        skills_db = {
            CharacterClass.WARRIOR: [
                Skill("Power Strike", "A powerful melee attack", 1.5, 5),
                Skill("Shield Bash", "Stun the enemy with your shield", 1.2, 10, 3)
            ],
            CharacterClass.MAGE: [
                Skill("Fireball", "Launch a ball of fire", 2.0, 15),
                Skill("Magic Shield", "Create a protective barrier", 0, 10)
            ],
            CharacterClass.ROGUE: [
                Skill("Backstab", "Attack from behind", 2.5, 10),
                Skill("Stealth", "Become harder to detect", 0, 5)
            ]
        }
        
        self.skills = skills_db.get(self.char_class, [
            Skill("Basic Attack", "A simple attack", 1.0, 0)
        ])
    
    def gain_experience(self, exp: int):
        """Adaugă experiență și verifică level up"""
        self.experience += exp
        print(f"🎯 {self.name} gained {exp} XP!")
        
        while self.experience >= self.max_experience:
            self.level_up()
    
    def level_up(self):
        """Crește nivelul personajului"""
        self.level += 1
        self.experience -= self.max_experience
        self.max_experience = int(self.max_experience * 1.5)
        
        # Îmbunătățire atribut aleator
        attributes = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
        attr_to_improve = random.choice(attributes)
        current_value = getattr(self, attr_to_improve)
        setattr(self, attr_to_improve, current_value + 1)
        
        # Regenerare completă
        self.max_health = self._calculate_max_health()
        self.current_health = self.max_health
        self.max_mana = self._calculate_max_mana()
        self.current_mana = self.max_mana
        self.attack_power = self._calculate_attack_power()
        self.defense = self._calculate_defense()
        
        print(f"\n⭐ LEVEL UP! {self.name} is now level {self.level}!")
        print(f"  {attr_to_improve.capitalize()} increased to {getattr(self, attr_to_improve)}")
        print(f"  Health: {self.max_health} | Mana: {self.max_mana}")
    
    def attack(self, enemy: 'RPGCharacter', skill_name: str = None) -> int:
        """Atacă un inamic"""
        if skill_name:
            skill = next((s for s in self.skills if s.name == skill_name), None)
            if not skill:
                print(f"Skill '{skill_name}' not found!")
                return 0
            if skill.level_required > self.level:
                print(f"Skill requires level {skill.level_required}!")
                return 0
            if self.current_mana < skill.mana_cost:
                print("Not enough mana!")
                return 0
            
            self.current_mana -= skill.mana_cost
            damage = int(self.attack_power * skill.damage_multiplier)
            print(f"🔥 {self.name} uses {skill.name}!")
        else:
            damage = self.attack_power
        
        # Aplică reducerea apărării
        damage = max(1, damage - (enemy.defense // 3))
        enemy.take_damage(damage)
        
        return damage
    
    def take_damage(self, damage: int):
        """Primește damage"""
        self.current_health -= damage
        print(f"💥 {self.name} takes {damage} damage! Health: {self.current_health}/{self.max_health}")
        
        if self.current_health <= 0:
            print(f"☠️ {self.name} has been defeated!")
    
    def heal(self, amount: int):
        """Vindecă personajul"""
        self.current_health = min(self.max_health, self.current_health + amount)
        print(f"❤️ {self.name} heals {amount} health! Health: {self.current_health}/{self.max_health}")
    
    def rest(self):
        """Odihnă pentru a recupera health și mana"""
        heal_amount = self.max_health // 4
        mana_amount = self.max_mana // 3
        
        self.current_health = min(self.max_health, self.current_health + heal_amount)
        self.current_mana = min(self.max_mana, self.current_mana + mana_amount)
        
        print(f"💤 {self.name} rests and recovers!")
        print(f"  Health +{heal_amount}: {self.current_health}/{self.max_health}")
        print(f"  Mana +{mana_amount}: {self.current_mana}/{self.max_mana}")
    
    def display_character(self):
        """Afișează detalii despre personaj"""
        print("\n" + "="*60)
        print(f"CHARACTER SHEET: {self.name}")
        print("="*60)
        print(f"Class: {self.char_class.value} | Race: {self.race.value} | Level: {self.level}")
        print(f"XP: {self.experience}/{self.max_experience} | Gold: {self.gold}")
        print()
        print("ATTRIBUTES:")
        print(f"  STR: {self.strength:2} | DEX: {self.dexterity:2} | CON: {self.constitution:2}")
        print(f"  INT: {self.intelligence:2} | WIS: {self.wisdom:2} | CHA: {self.charisma:2}")
        print()
        print("STATS:")
        print(f"  Health: {self.current_health}/{self.max_health}")
        print(f"  Mana:   {self.current_mana}/{self.max_mana}")
        print(f"  Attack: {self.attack_power} | Defense: {self.defense}")
        print()
        
        if self.equipment:
            print("EQUIPMENT:")
            for item in self.equipment:
                bonuses = []
                if item.attack_bonus: bonuses.append(f"ATK+{item.attack_bonus}")
                if item.defense_bonus: bonuses.append(f"DEF+{item.defense_bonus}")
                if item.magic_bonus: bonuses.append(f"MAG+{item.magic_bonus}")
                
                bonus_str = f" ({', '.join(bonuses)})" if bonuses else ""
                print(f"  - {item.name}{bonus_str}")
        
        if self.skills:
            print("\nSKILLS:")
            for skill in self.skills:
                level_req = f" (Lvl {skill.level_required}+)" if skill.level_required > 1 else ""
                print(f"  - {skill.name}{level_req}: {skill.description}")
                print(f"    Damage: x{skill.damage_multiplier} | Cost: {skill.mana_cost} MP")
        
        print("="*60)
    
    def to_dict(self) -> dict:
        """Converteste personajul în dict pentru salvare"""
        return {
            'name': self.name,
            'char_class': self.char_class.value,
            'race': self.race.value,
            'level': self.level,
            'experience': self.experience,
            'max_experience': self.max_experience,
            'attributes': {
                'strength': self.strength,
                'dexterity': self.dexterity,
                'constitution': self.constitution,
                'intelligence': self.intelligence,
                'wisdom': self.wisdom,
                'charisma': self.charisma
            },
            'stats': {
                'max_health': self.max_health,
                'current_health': self.current_health,
                'max_mana': self.max_mana,
                'current_mana': self.current_mana,
                'attack_power': self.attack_power,
                'defense': self.defense
            },
            'gold': self.gold,
            'equipment': [asdict(eq) for eq in self.equipment],
            'skills': [asdict(skill) for skill in self.skills]
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'RPGCharacter':
        """Creează un personaj din dict"""
        char = cls(
            name=data['name'],
            char_class=CharacterClass(data['char_class']),
            race=Race(data['race'])
        )
        
        # Suprascrie valorile
        char.level = data['level']
        char.experience = data['experience']
        char.max_experience = data['max_experience']
        
        # Atribute
        for attr, value in data['attributes'].items():
            setattr(char, attr, value)
        
        # Statistici
        stats = data['stats']
        char.max_health = stats['max_health']
        char.current_health = stats['current_health']
        char.max_mana = stats['max_mana']
        char.current_mana = stats['current_mana']
        char.attack_power = stats['attack_power']
        char.defense = stats['defense']
        
        char.gold = data['gold']
        
        # Equipment și skills
        char.equipment = [Equipment(**eq) for eq in data['equipment']]
        char.skills = [Skill(**skill) for skill in data['skills']]
        
        return char

class RPGGame:
    def __init__(self):
        self.characters = []
        self.save_file = "rpg_characters.json"
        self.load_characters()
    
    def create_character(self):
        """Creează un personaj nou"""
        print("\n" + "="*50)
        print("CREATE NEW CHARACTER")
        print("="*50)
        
        name = input("Character name: ")
        
        print("\nAvailable races:")
        for i, race in enumerate(Race, 1):
            print(f"{i}. {race.value}")
        
        race_choice = int(input("Choose race: ")) - 1
        race = list(Race)[race_choice]
        
        print("\nAvailable classes:")
        for i, char_class in enumerate(CharacterClass, 1):
            print(f"{i}. {char_class.value}")
        
        class_choice = int(input("Choose class: ")) - 1
        char_class = list(CharacterClass)[class_choice]
        
        # Creează personajul
        character = RPGCharacter(name, char_class, race)
        self.characters.append(character)
        
        print(f"\n✅ Character '{name}' created successfully!")
        character.display_character()
        
        self.save_characters()
        return character
    
    def save_characters(self):
        """Salvează toate personajele"""
        data = [char.to_dict() for char in self.characters]
        with open(self.save_file, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"💾 Saved {len(self.characters)} characters to {self.save_file}")
    
    def load_characters(self):
        """Încarcă personajele salvate"""
        try:
            with open(self.save_file, 'r') as f:
                data = json.load(f)
                self.characters = [RPGCharacter.from_dict(char_data) for char_data in data]
            print(f"📂 Loaded {len(self.characters)} characters from {self.save_file}")
        except FileNotFoundError:
            self.characters = []
            print("No save file found. Starting with empty character list.")
    
    def battle_simulation(self, char1: RPGCharacter, char2: RPGCharacter):
        """Simulează o bătălie între două personaje"""
        print("\n" + "="*60)
        print(f"BATTLE: {char1.name} vs {char2.name}")
        print("="*60)
        
        round_num = 1
        while char1.current_health > 0 and char2.current_health > 0:
            print(f"\nROUND {round_num}")
            print("-"*40)
            
            # Atacă char1
            if char1.skills and random.random() > 0.7:  # 30% șansă să folosească skill
                skill = random.choice(char1.skills)
                damage = char1.attack(char2, skill.name)
            else:
                damage = char1.attack(char2)
            
            if char2.current_health <= 0:
                winner = char1
                break
            
            # Atacă char2
            if char2.skills and random.random() > 0.7:
                skill = random.choice(char2.skills)
                damage = char2.attack(char1, skill.name)
            else:
                damage = char2.attack(char1)
            
            if char1.current_health <= 0:
                winner = char2
                break
            
            round_num += 1
            if round_num > 20:  # Limită pentru bătălii prea lungi
                print("\n⚠️ Battle ended in a draw!")
                return None
        
        # Exp pentru câștigător
        exp_reward = winner.level * 25
        gold_reward = random.randint(10, 50)
        
        winner.gain_experience(exp_reward)
        winner.gold += gold_reward
        
        print(f"\n🏆 VICTORY! {winner.name} wins the battle!")
        print(f"   Reward: {exp_reward} XP and {gold_reward} gold")
        
        # Resetează health-ul pentru ambele personaje
        char1.current_health = char1.max_health // 2
        char2.current_health = char2.max_health // 2
        
        return winner
    
    def main_menu(self):
        """Meniu principal"""
        while True:
            print("\n" + "="*50)
            print("🎮 RPG CHARACTER GENERATOR")
            print("="*50)
            print("1. Create new character")
            print("2. View all characters")
            print("3. View character details")
            print("4. Simulate battle")
            print("5. Rest character")
            print("6. Save characters")
            print("7. Exit")
            
            choice = input("\nChoose option: ")
            
            if choice == '1':
                self.create_character()
            
            elif choice == '2':
                if not self.characters:
                    print("No characters created yet!")
                else:
                    print(f"\n📋 CHARACTERS ({len(self.characters)} total):")
                    for i, char in enumerate(self.characters, 1):
                        print(f"{i}. {char.name} - {char.char_class.value} {char.race.value} (Lvl {char.level})")
            
            elif choice == '3':
                if not self.characters:
                    print("No characters created yet!")
                else:
                    print("\nSelect character to view:")
                    for i, char in enumerate(self.characters, 1):
                        print(f"{i}. {char.name}")
                    
                    char_idx = int(input("Character number: ")) - 1
                    if 0 <= char_idx < len(self.characters):
                        self.characters[char_idx].display_character()
            
            elif choice == '4':
                if len(self.characters) < 2:
                    print("Need at least 2 characters for battle!")
                else:
                    print("\nSelect first character:")
                    for i, char in enumerate(self.characters, 1):
                        print(f"{i}. {char.name} (Lvl {char.level})")
                    
                    char1_idx = int(input("Character 1: ")) - 1
                    
                    print("\nSelect second character:")
                    for i, char in enumerate(self.characters, 1):
                        if i-1 != char1_idx:
                            print(f"{i}. {char.name} (Lvl {char.level})")
                    
                    char2_idx = int(input("Character 2: ")) - 1
                    
                    if (0 <= char1_idx < len(self.characters) and 
                        0 <= char2_idx < len(self.characters) and 
                        char1_idx != char2_idx):
                        
                        self.battle_simulation(
                            self.characters[char1_idx],
                            self.characters[char2_idx]
                        )
                        self.save_characters()
            
            elif choice == '5':
                if not self.characters:
                    print("No characters created yet!")
                else:
                    print("\nSelect character to rest:")
                    for i, char in enumerate(self.characters, 1):
                        print(f"{i}. {char.name}")
                    
                    char_idx = int(input("Character number: ")) - 1
                    if 0 <= char_idx < len(self.characters):
                        self.characters[char_idx].rest()
                        self.save_characters()
            
            elif choice == '6':
                self.save_characters()
                print("Characters saved successfully!")
            
            elif choice == '7':
                print("Goodbye! May your adventures continue!")
                break

if __name__ == "__main__":
    game = RPGGame()
    game.main_menu()