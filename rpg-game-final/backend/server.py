"""The Obsidian Chronicles - RPG Game Backend
FastAPI server for multiplayer features, authentication, and game data persistence.

For GitHub hosting:
1. Deploy this backend to Railway/Render/Fly.io (all free tier)
2. Update frontend/script.js CONFIG.API_URL and CONFIG.WS_URL
3. Frontend can be hosted on GitHub Pages (free)
"""

from fastapi import FastAPI, APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import uuid
from datetime import datetime, timezone
import jwt
import bcrypt
import random
import json

# ============== CONFIGURATION ==============
# For local development, use a JSON file as database
# For production, use MongoDB (set MONGO_URL environment variable)

JWT_SECRET = os.environ.get('JWT_SECRET', 'obsidian-chronicles-secret-key-2024')
JWT_ALGORITHM = "HS256"
DATA_FILE = "game_data.json"

# ============== SIMPLE FILE-BASED DATABASE ==============
# This works without MongoDB for simple deployment

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {'users': {}, 'characters': {}, 'battles': {}}

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# ============== APP SETUP ==============
app = FastAPI(title="The Obsidian Chronicles API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# CORS - Allow all origins for GitHub Pages
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============== MODELS ==============
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class CharacterCreate(BaseModel):
    name: str
    character_class: str

class BattleAction(BaseModel):
    action_type: str
    target_id: Optional[str] = None
    skill_id: Optional[str] = None
    item_id: Optional[str] = None

# ============== AUTH HELPERS ==============
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str, username: str) -> str:
    payload = {
        "user_id": user_id,
        "username": username,
        "exp": datetime.now(timezone.utc).timestamp() + 86400 * 7
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============== GAME DATA ==============
CLASS_BASE_STATS = {
    "warrior": {"health": 150, "mana": 30, "stamina": 100, "strength": 15, "intelligence": 5, "agility": 8},
    "mage": {"health": 80, "mana": 150, "stamina": 50, "strength": 5, "intelligence": 18, "agility": 7},
    "rogue": {"health": 100, "mana": 60, "stamina": 120, "strength": 10, "intelligence": 8, "agility": 15}
}

CLASS_SKILLS = {
    "warrior": [
        {"id": "slash", "name": "Slash", "damage": 25, "mana_cost": 0, "stamina_cost": 15, "cooldown": 0, "level_req": 1},
        {"id": "shield_bash", "name": "Shield Bash", "damage": 15, "mana_cost": 0, "stamina_cost": 20, "cooldown": 2, "level_req": 3},
        {"id": "whirlwind", "name": "Whirlwind", "damage": 40, "mana_cost": 10, "stamina_cost": 30, "cooldown": 3, "level_req": 5},
    ],
    "mage": [
        {"id": "fireball", "name": "Fireball", "damage": 35, "mana_cost": 25, "stamina_cost": 0, "cooldown": 0, "level_req": 1},
        {"id": "ice_shard", "name": "Ice Shard", "damage": 20, "mana_cost": 15, "stamina_cost": 0, "cooldown": 1, "level_req": 3},
        {"id": "lightning_bolt", "name": "Lightning Bolt", "damage": 50, "mana_cost": 40, "stamina_cost": 0, "cooldown": 2, "level_req": 5},
    ],
    "rogue": [
        {"id": "backstab", "name": "Backstab", "damage": 30, "mana_cost": 0, "stamina_cost": 20, "cooldown": 0, "level_req": 1},
        {"id": "poison_blade", "name": "Poison Blade", "damage": 15, "mana_cost": 10, "stamina_cost": 15, "cooldown": 2, "level_req": 3},
        {"id": "shadow_step", "name": "Shadow Step", "damage": 25, "mana_cost": 20, "stamina_cost": 25, "cooldown": 2, "level_req": 5},
    ]
}

ENEMIES = [
    {"id": "goblin", "name": "Goblin", "health": 50, "damage": 8, "defense": 2, "exp": 20, "gold": 10, "level": 1},
    {"id": "skeleton", "name": "Skeleton", "health": 80, "damage": 12, "defense": 5, "exp": 35, "gold": 20, "level": 3},
    {"id": "orc", "name": "Orc Brute", "health": 120, "damage": 18, "defense": 8, "exp": 60, "gold": 40, "level": 5},
    {"id": "dragon", "name": "Dragon", "health": 500, "damage": 50, "defense": 20, "exp": 500, "gold": 300, "level": 15},
]

# ============== AUTH ROUTES ==============
@api_router.get("/")
def root():
    return {"message": "The Obsidian Chronicles API", "status": "online"}

@api_router.post("/auth/register")
def register(user: UserCreate):
    data = load_data()
    
    # Check if user exists
    for u in data['users'].values():
        if u['email'] == user.email or u['username'] == user.username:
            raise HTTPException(status_code=400, detail="User already exists")
    
    user_id = str(uuid.uuid4())
    data['users'][user_id] = {
        "id": user_id,
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    save_data(data)
    
    token = create_token(user_id, user.username)
    return {"token": token, "user": {"id": user_id, "username": user.username, "email": user.email}}

@api_router.post("/auth/login")
def login(user: UserLogin):
    data = load_data()
    
    db_user = None
    for u in data['users'].values():
        if u['email'] == user.email:
            db_user = u
            break
    
    if not db_user or not verify_password(user.password, db_user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(db_user['id'], db_user['username'])
    return {"token": token, "user": {"id": db_user['id'], "username": db_user['username'], "email": db_user['email']}}

@api_router.get("/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    data = load_data()
    user = data['users'].get(current_user['user_id'])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user['id'], "username": user['username'], "email": user['email']}

# ============== CHARACTER ROUTES ==============
@api_router.post("/characters")
def create_character(char: CharacterCreate, current_user: dict = Depends(get_current_user)):
    if char.character_class not in CLASS_BASE_STATS:
        raise HTTPException(status_code=400, detail="Invalid class")
    
    data = load_data()
    
    # Check if character exists
    for c in data['characters'].values():
        if c['user_id'] == current_user['user_id']:
            raise HTTPException(status_code=400, detail="Character already exists")
    
    stats = CLASS_BASE_STATS[char.character_class]
    skills = [s.copy() for s in CLASS_SKILLS[char.character_class] if s['level_req'] <= 1]
    
    char_id = str(uuid.uuid4())
    character = {
        "id": char_id,
        "user_id": current_user['user_id'],
        "name": char.name,
        "character_class": char.character_class,
        "level": 1,
        "experience": 0,
        "health": stats['health'],
        "max_health": stats['health'],
        "mana": stats['mana'],
        "max_mana": stats['mana'],
        "stamina": stats['stamina'],
        "max_stamina": stats['stamina'],
        "strength": stats['strength'],
        "intelligence": stats['intelligence'],
        "agility": stats['agility'],
        "gold": 100,
        "inventory": [
            {"item_id": "health_potion", "quantity": 3},
            {"item_id": "mana_potion", "quantity": 2}
        ],
        "equipment": {"weapon": None, "armor": None, "accessory": None},
        "skills": skills,
        "quests": [],
        "achievements": [],
        "battle_stats": {"wins": 0, "losses": 0, "pvp_wins": 0, "pvp_losses": 0},
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    data['characters'][char_id] = character
    save_data(data)
    
    return character

@api_router.get("/characters/me")
def get_my_character(current_user: dict = Depends(get_current_user)):
    data = load_data()
    
    for c in data['characters'].values():
        if c['user_id'] == current_user['user_id']:
            return c
    
    raise HTTPException(status_code=404, detail="No character found")

# ============== LEADERBOARD ==============
@api_router.get("/leaderboard")
def get_leaderboard():
    data = load_data()
    characters = sorted(
        [{
            "name": c['name'],
            "level": c['level'],
            "character_class": c['character_class'],
            "battle_stats": c['battle_stats']
        } for c in data['characters'].values()],
        key=lambda x: x['level'],
        reverse=True
    )[:20]
    return characters

# ============== WEBSOCKET FOR MULTIPLAYER ==============
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.matchmaking_queue: List[Dict] = []
        self.chat_messages: List[Dict] = []

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        self.active_connections.pop(user_id, None)
        self.matchmaking_queue = [p for p in self.matchmaking_queue if p['user_id'] != user_id]

    async def send_personal(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_json(message)
            except:
                pass

    async def broadcast(self, message: dict):
        for user_id in self.active_connections:
            await self.send_personal(message, user_id)

manager = ConnectionManager()

@app.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload['user_id']
    except:
        await websocket.close(code=4001)
        return
    
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            data = await websocket.receive_json()
            action = data.get('action')
            
            if action == 'chat':
                message = data.get('message', '')[:200]
                db = load_data()
                char = None
                for c in db['characters'].values():
                    if c['user_id'] == user_id:
                        char = c
                        break
                
                if char:
                    chat_msg = {
                        "sender": char['name'],
                        "message": message,
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    }
                    manager.chat_messages.append(chat_msg)
                    manager.chat_messages = manager.chat_messages[-50:]
                    
                    await manager.broadcast({
                        "type": "chat",
                        "sender": char['name'],
                        "message": message
                    })
            
            elif action == 'get_chat_history':
                await manager.send_personal({
                    "type": "chat_history",
                    "messages": manager.chat_messages[-20:]
                }, user_id)
            
            elif action == 'join_matchmaking':
                await manager.send_personal({"type": "matchmaking", "status": "searching"}, user_id)
            
            elif action == 'leave_matchmaking':
                await manager.send_personal({"type": "matchmaking", "status": "left"}, user_id)
    
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(user_id)

# Include router
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
