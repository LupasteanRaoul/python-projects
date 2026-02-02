# The Obsidian Chronicles - Design Document

## Overview
A browser-based RPG game with turn-based combat, character progression, and multiplayer features.

## Core Features

### Character System
- 3 Classes: Warrior, Mage, Rogue
- Stats: Health, Mana, Stamina, Strength, Intelligence, Agility
- Level progression with stat increases
- Skill unlocking based on level

### Battle System
- Turn-based combat
- Actions: Attack, Skills, Defend, Items
- Enemy AI with varying difficulty
- Experience and gold rewards

### Inventory System
- Equipment slots: Weapon, Armor, Accessory
- Consumable items: Potions
- Drag-and-drop interface
- Item rarity system

### Quest System
- Kill objectives
- Multiple rewards (EXP, Gold, Items)
- Progress tracking

### Multiplayer
- PvP Arena (real-time WebSocket)
- Co-op Mode (planned)
- Global Chat
- Leaderboards

## Technical Architecture

### Frontend
- Pure HTML/CSS/JS (no frameworks needed)
- LocalStorage for offline play
- WebSocket for multiplayer

### Backend
- FastAPI Python server
- JWT authentication
- File-based or MongoDB storage
- WebSocket for real-time features

## Deployment Options

### Frontend Only (GitHub Pages)
- Single player mode
- LocalStorage persistence
- No server needed

### Full Stack (Railway/Render)
- Multiplayer features
- Persistent storage
- Real-time communication
