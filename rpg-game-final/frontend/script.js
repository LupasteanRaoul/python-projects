// ============== CONFIGURATION ==============
const CONFIG = {
    // Change this to your backend URL when deployed
    API_URL: 'https://your-backend.railway.app/api',
    WS_URL: 'wss://your-backend.railway.app/ws',
    // For local development:
    // API_URL: 'http://localhost:8001/api',
    // WS_URL: 'ws://localhost:8001/ws',
    USE_LOCAL_STORAGE: true // Set to false when using real backend
};

// ============== TRANSLATIONS ==============
const TRANSLATIONS = {
    ro: {
        login: 'Autentificare',
        register: 'Înregistrare',
        noAccount: 'Nu ai cont?',
        hasAccount: 'Ai deja cont?',
        createChar: 'Creează Personajul',
        selectClass: 'Alege Clasa',
        warriorDesc: 'Putere și rezistență',
        mageDesc: 'Magie devastatoare',
        rogueDesc: 'Viteză și precizie',
        dashboard: 'Dashboard',
        battle: 'Bătălie',
        inventory: 'Inventar',
        quests: 'Quest-uri',
        leaderboard: 'Clasament',
        welcome: 'Bine ai venit, Aventurier!',
        welcomeDesc: 'Explorează lumea și înfruntă dușmanii!',
        battleStats: 'Statistici Bătălie',
        wins: 'Victorii',
        losses: 'Înfrângeri',
        skills: 'Abilități',
        achievements: 'Realizări',
        selectEnemy: 'Alege Inamicul',
        attack: 'Atac',
        defend: 'Apărare',
        items: 'Obiecte',
        flee: 'Fugi',
        equipment: 'Echipament',
        weapon: 'Armă',
        armor: 'Armură',
        accessory: 'Accesoriu',
        shop: 'Magazin',
        crafting: 'Crafting',
        activeQuests: 'Quest-uri Active',
        availableQuests: 'Quest-uri Disponibile',
        pvpDesc: 'Luptă împotriva altor jucători!',
        coopDesc: 'Colaborează cu alți jucători!',
        findMatch: 'Caută Meci',
        findTeam: 'Caută Echipă',
        globalChat: 'Chat Global',
        topPlayers: 'Top Jucători',
        rest: 'Odihnă (10g)',
        victory: 'Victorie!',
        defeat: 'Înfrângere!',
        levelUp: 'LEVEL UP!',
        newSkill: 'Abilitate nouă deblocată!',
        questComplete: 'Quest completat!',
        notEnoughGold: 'Nu ai destul aur!',
        itemBought: 'Obiect cumpărat!',
        rested: 'Te-ai odihnit complet!'
    },
    en: {
        login: 'Login',
        register: 'Register',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        createChar: 'Create Character',
        selectClass: 'Select Class',
        warriorDesc: 'Power and resilience',
        mageDesc: 'Devastating magic',
        rogueDesc: 'Speed and precision',
        dashboard: 'Dashboard',
        battle: 'Battle',
        inventory: 'Inventory',
        quests: 'Quests',
        leaderboard: 'Leaderboard',
        welcome: 'Welcome, Adventurer!',
        welcomeDesc: 'Explore the world and defeat enemies!',
        battleStats: 'Battle Stats',
        wins: 'Wins',
        losses: 'Losses',
        skills: 'Skills',
        achievements: 'Achievements',
        selectEnemy: 'Select Enemy',
        attack: 'Attack',
        defend: 'Defend',
        items: 'Items',
        flee: 'Flee',
        equipment: 'Equipment',
        weapon: 'Weapon',
        armor: 'Armor',
        accessory: 'Accessory',
        shop: 'Shop',
        crafting: 'Crafting',
        activeQuests: 'Active Quests',
        availableQuests: 'Available Quests',
        pvpDesc: 'Fight against other players!',
        coopDesc: 'Cooperate with other players!',
        findMatch: 'Find Match',
        findTeam: 'Find Team',
        globalChat: 'Global Chat',
        topPlayers: 'Top Players',
        rest: 'Rest (10g)',
        victory: 'Victory!',
        defeat: 'Defeat!',
        levelUp: 'LEVEL UP!',
        newSkill: 'New skill unlocked!',
        questComplete: 'Quest complete!',
        notEnoughGold: 'Not enough gold!',
        itemBought: 'Item bought!',
        rested: 'Fully rested!'
    }
};

// ============== GAME DATA ==============
const CLASS_BASE_STATS = {
    warrior: { health: 150, mana: 30, stamina: 100, strength: 15, intelligence: 5, agility: 8 },
    mage: { health: 80, mana: 150, stamina: 50, strength: 5, intelligence: 18, agility: 7 },
    rogue: { health: 100, mana: 60, stamina: 120, strength: 10, intelligence: 8, agility: 15 }
};

const CLASS_SKILLS = {
    warrior: [
        { id: 'slash', name: 'Slash', damage: 25, mana_cost: 0, stamina_cost: 15, cooldown: 0, level_req: 1, description: 'A powerful sword strike', icon: 'fa-solid fa-sword' },
        { id: 'shield_bash', name: 'Shield Bash', damage: 15, mana_cost: 0, stamina_cost: 20, cooldown: 2, level_req: 3, effect: 'stun', description: 'Bash with shield', icon: 'fa-solid fa-shield' },
        { id: 'whirlwind', name: 'Whirlwind', damage: 40, mana_cost: 10, stamina_cost: 30, cooldown: 3, level_req: 5, aoe: true, description: 'Spin attack', icon: 'fa-solid fa-hurricane' },
        { id: 'berserker_rage', name: 'Berserker Rage', damage: 0, mana_cost: 0, stamina_cost: 50, cooldown: 5, level_req: 8, buff: 'attack_up', description: 'Double damage', icon: 'fa-solid fa-fire' }
    ],
    mage: [
        { id: 'fireball', name: 'Fireball', damage: 35, mana_cost: 25, stamina_cost: 0, cooldown: 0, level_req: 1, description: 'Fire ball', icon: 'fa-solid fa-fire' },
        { id: 'ice_shard', name: 'Ice Shard', damage: 20, mana_cost: 15, stamina_cost: 0, cooldown: 1, level_req: 3, effect: 'slow', description: 'Ice projectile', icon: 'fa-solid fa-icicles' },
        { id: 'lightning_bolt', name: 'Lightning Bolt', damage: 50, mana_cost: 40, stamina_cost: 0, cooldown: 2, level_req: 5, description: 'Lightning strike', icon: 'fa-solid fa-bolt' },
        { id: 'meteor', name: 'Meteor', damage: 80, mana_cost: 70, stamina_cost: 0, cooldown: 4, level_req: 10, aoe: true, description: 'Meteor from sky', icon: 'fa-solid fa-meteor' }
    ],
    rogue: [
        { id: 'backstab', name: 'Backstab', damage: 30, mana_cost: 0, stamina_cost: 20, cooldown: 0, level_req: 1, description: 'Strike from shadows', icon: 'fa-solid fa-knife' },
        { id: 'poison_blade', name: 'Poison Blade', damage: 15, mana_cost: 10, stamina_cost: 15, cooldown: 2, level_req: 3, effect: 'poison', description: 'Apply poison', icon: 'fa-solid fa-skull-crossbones' },
        { id: 'shadow_step', name: 'Shadow Step', damage: 25, mana_cost: 20, stamina_cost: 25, cooldown: 2, level_req: 5, effect: 'dodge', description: 'Teleport behind', icon: 'fa-solid fa-ghost' },
        { id: 'assassinate', name: 'Assassinate', damage: 100, mana_cost: 30, stamina_cost: 40, cooldown: 5, level_req: 10, description: 'Lethal strike', icon: 'fa-solid fa-crosshairs' }
    ]
};

const ENEMIES = [
    { id: 'goblin', name: 'Goblin', health: 50, damage: 8, defense: 2, exp: 20, gold: 10, level: 1, icon: 'fa-solid fa-person-walking' },
    { id: 'skeleton', name: 'Skeleton Warrior', health: 80, damage: 12, defense: 5, exp: 35, gold: 20, level: 3, icon: 'fa-solid fa-skull' },
    { id: 'orc', name: 'Orc Brute', health: 120, damage: 18, defense: 8, exp: 60, gold: 40, level: 5, icon: 'fa-solid fa-fist-raised' },
    { id: 'dark_mage', name: 'Dark Mage', health: 70, damage: 25, defense: 3, exp: 80, gold: 50, level: 7, icon: 'fa-solid fa-hat-wizard' },
    { id: 'dragon', name: 'Ancient Dragon', health: 500, damage: 50, defense: 20, exp: 500, gold: 300, level: 15, icon: 'fa-solid fa-dragon' }
];

const ITEMS = [
    { id: 'health_potion', name: 'Health Potion', item_type: 'consumable', rarity: 'common', stats: { heal: 50 }, description: 'Restores 50 HP', icon: 'fa-solid fa-flask', price: 25 },
    { id: 'mana_potion', name: 'Mana Potion', item_type: 'consumable', rarity: 'common', stats: { mana: 40 }, description: 'Restores 40 MP', icon: 'fa-solid fa-flask-vial', price: 30 },
    { id: 'stamina_potion', name: 'Stamina Potion', item_type: 'consumable', rarity: 'common', stats: { stamina: 50 }, description: 'Restores 50 Stamina', icon: 'fa-solid fa-battery-full', price: 25 },
    { id: 'iron_sword', name: 'Iron Sword', item_type: 'weapon', rarity: 'common', stats: { strength: 5 }, description: 'A sturdy iron blade', icon: 'fa-solid fa-sword', price: 100 },
    { id: 'steel_sword', name: 'Steel Sword', item_type: 'weapon', rarity: 'uncommon', stats: { strength: 10 }, description: 'Forged from fine steel', icon: 'fa-solid fa-sword', price: 250 },
    { id: 'obsidian_blade', name: 'Obsidian Blade', item_type: 'weapon', rarity: 'rare', stats: { strength: 20, agility: 5 }, description: 'Dark blade of power', icon: 'fa-solid fa-khanda', price: 800 },
    { id: 'leather_armor', name: 'Leather Armor', item_type: 'armor', rarity: 'common', stats: { health: 20 }, description: 'Basic protection', icon: 'fa-solid fa-vest', price: 80 },
    { id: 'chainmail', name: 'Chainmail', item_type: 'armor', rarity: 'uncommon', stats: { health: 40 }, description: 'Linked metal rings', icon: 'fa-solid fa-shield-halved', price: 200 },
    { id: 'plate_armor', name: 'Plate Armor', item_type: 'armor', rarity: 'rare', stats: { health: 80, strength: 5 }, description: 'Heavy plate protection', icon: 'fa-solid fa-shield', price: 600 },
    { id: 'magic_staff', name: 'Magic Staff', item_type: 'weapon', rarity: 'uncommon', stats: { intelligence: 12 }, description: 'Channel arcane energy', icon: 'fa-solid fa-wand-sparkles', price: 300 },
    { id: 'ring_power', name: 'Ring of Power', item_type: 'accessory', rarity: 'rare', stats: { strength: 5, intelligence: 5, agility: 5 }, description: 'Enhances all attributes', icon: 'fa-solid fa-ring', price: 500 }
];

const QUESTS = [
    { id: 'first_blood', name: 'First Blood', description: 'Defeat your first enemy', objectives: [{ type: 'kill', target: 'any', count: 1, current: 0 }], rewards: { exp: 50, gold: 25 }, level_req: 1 },
    { id: 'goblin_slayer', name: 'Goblin Slayer', description: 'Eliminate 5 goblins', objectives: [{ type: 'kill', target: 'goblin', count: 5, current: 0 }], rewards: { exp: 150, gold: 75, item: 'iron_sword' }, level_req: 1 },
    { id: 'undead_threat', name: 'Undead Threat', description: 'Destroy 10 skeleton warriors', objectives: [{ type: 'kill', target: 'skeleton', count: 10, current: 0 }], rewards: { exp: 300, gold: 150 }, level_req: 3 },
    { id: 'dragon_hunter', name: 'Dragon Hunter', description: 'Slay the ancient dragon', objectives: [{ type: 'kill', target: 'dragon', count: 1, current: 0 }], rewards: { exp: 1000, gold: 500, item: 'obsidian_blade' }, level_req: 10 }
];

const ACHIEVEMENTS = [
    { id: 'first_kill', name: 'First Kill', description: 'Defeat your first enemy', icon: 'fa-solid fa-skull' },
    { id: 'level_5', name: 'Apprentice', description: 'Reach level 5', icon: 'fa-solid fa-star' },
    { id: 'level_10', name: 'Veteran', description: 'Reach level 10', icon: 'fa-solid fa-award' },
    { id: 'dragon_slayer', name: 'Dragon Slayer', description: 'Defeat the Ancient Dragon', icon: 'fa-solid fa-dragon' },
    { id: 'rich', name: 'Fortune Seeker', description: 'Accumulate 1000 gold', icon: 'fa-solid fa-coins' },
    { id: 'pvp_winner', name: 'PvP Champion', description: 'Win your first PvP battle', icon: 'fa-solid fa-trophy' }
];

const CRAFTING_RECIPES = [
    { id: 'steel_sword_recipe', name: 'Steel Sword', materials: [{ item: 'iron_sword', count: 1 }, { item: 'gold', count: 100 }], result: 'steel_sword', icon: 'fa-solid fa-sword' },
    { id: 'health_potion_recipe', name: 'Health Potion', materials: [{ item: 'gold', count: 15 }], result: 'health_potion', icon: 'fa-solid fa-flask' },
    { id: 'mana_potion_recipe', name: 'Mana Potion', materials: [{ item: 'gold', count: 20 }], result: 'mana_potion', icon: 'fa-solid fa-flask-vial' }
];

// ============== STATE ==============
let currentLang = 'ro';
let currentUser = null;
let currentCharacter = null;
let currentBattle = null;
let selectedClass = null;
let websocket = null;
let isInMatchmaking = false;

// ============== INITIALIZATION ==============
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Hide loading screen
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    // Setup language
    setupLanguage();
    
    // Check for saved session
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedChar = localStorage.getItem('character');
    
    if (savedToken && savedUser) {
        currentUser = JSON.parse(savedUser);
        if (savedChar) {
            currentCharacter = JSON.parse(savedChar);
            showScreen('game');
            updateCharacterUI();
            loadGameData();
            connectWebSocket();
        } else {
            showScreen('character');
        }
    } else {
        showScreen('auth');
    }
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Chat input enter key
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChat();
        });
    }
    
    // Tooltips
    setupTooltips();
}

// ============== LANGUAGE ==============
function setupLanguage() {
    const savedLang = localStorage.getItem('language') || 'ro';
    setLanguage(savedLang);
    
    // Setup language buttons
    document.querySelectorAll('.lang-btn, .lang-btn-mini').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update active buttons
    document.querySelectorAll('.lang-btn, .lang-btn-mini').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update text content
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey;
        if (TRANSLATIONS[lang][key]) {
            el.textContent = TRANSLATIONS[lang][key];
        }
    });
}

function t(key) {
    return TRANSLATIONS[currentLang][key] || key;
}

// ============== SCREENS ==============
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(`${screen}-screen`).classList.remove('hidden');
}

function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showRegister() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

// ============== AUTH ==============
async function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        showNotification('error', 'Error', 'Please fill all fields');
        return;
    }
    
    if (CONFIG.USE_LOCAL_STORAGE) {
        // Local storage mode
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const user = users[username];
        
        if (!user || user.password !== password) {
            showNotification('error', 'Error', 'Invalid credentials');
            return;
        }
        
        currentUser = { id: user.id, username: user.username };
        localStorage.setItem('token', 'local-token-' + user.id);
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        // Check for character
        const chars = JSON.parse(localStorage.getItem('characters') || '{}');
        if (chars[user.id]) {
            currentCharacter = chars[user.id];
            localStorage.setItem('character', JSON.stringify(currentCharacter));
            showScreen('game');
            updateCharacterUI();
            loadGameData();
            connectWebSocket();
        } else {
            showScreen('character');
        }
        
        showNotification('success', 'Success', `Welcome back, ${username}!`);
    } else {
        // API mode
        try {
            const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: username, password })
            });
            
            if (!response.ok) throw new Error('Invalid credentials');
            
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            
            // Load character
            await loadCharacter();
        } catch (error) {
            showNotification('error', 'Error', error.message);
        }
    }
}

async function register() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    
    if (!username || !email || !password) {
        showNotification('error', 'Error', 'Please fill all fields');
        return;
    }
    
    if (CONFIG.USE_LOCAL_STORAGE) {
        // Local storage mode
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[username]) {
            showNotification('error', 'Error', 'Username already exists');
            return;
        }
        
        const userId = 'user-' + Date.now();
        users[username] = {
            id: userId,
            username,
            email,
            password,
            created_at: new Date().toISOString()
        };
        
        localStorage.setItem('users', JSON.stringify(users));
        
        currentUser = { id: userId, username };
        localStorage.setItem('token', 'local-token-' + userId);
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        showScreen('character');
        showNotification('success', 'Success', 'Account created!');
    } else {
        // API mode
        try {
            const response = await fetch(`${CONFIG.API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Registration failed');
            }
            
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            
            showScreen('character');
            showNotification('success', 'Success', 'Account created!');
        } catch (error) {
            showNotification('error', 'Error', error.message);
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('character');
    currentUser = null;
    currentCharacter = null;
    if (websocket) websocket.close();
    showScreen('auth');
    showNotification('info', 'Logged out', 'See you next time!');
}

// ============== CHARACTER ==============
function selectClass(className) {
    selectedClass = className;
    document.querySelectorAll('.class-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.class === className);
    });
}

async function createCharacter() {
    const name = document.getElementById('char-name').value.trim();
    
    if (!name) {
        showNotification('error', 'Error', 'Enter character name');
        return;
    }
    
    if (!selectedClass) {
        showNotification('error', 'Error', 'Select a class');
        return;
    }
    
    const baseStats = CLASS_BASE_STATS[selectedClass];
    const skills = CLASS_SKILLS[selectedClass].filter(s => s.level_req <= 1);
    
    currentCharacter = {
        id: 'char-' + Date.now(),
        user_id: currentUser.id,
        name,
        character_class: selectedClass,
        level: 1,
        experience: 0,
        health: baseStats.health,
        max_health: baseStats.health,
        mana: baseStats.mana,
        max_mana: baseStats.mana,
        stamina: baseStats.stamina,
        max_stamina: baseStats.stamina,
        strength: baseStats.strength,
        intelligence: baseStats.intelligence,
        agility: baseStats.agility,
        gold: 100,
        inventory: [
            { item_id: 'health_potion', quantity: 3 },
            { item_id: 'mana_potion', quantity: 2 }
        ],
        equipment: { weapon: null, armor: null, accessory: null },
        skills: skills,
        quests: [{ ...QUESTS[0], objectives: QUESTS[0].objectives.map(o => ({ ...o })) }],
        achievements: [],
        battle_stats: { wins: 0, losses: 0, pvp_wins: 0, pvp_losses: 0 },
        created_at: new Date().toISOString()
    };
    
    if (CONFIG.USE_LOCAL_STORAGE) {
        const chars = JSON.parse(localStorage.getItem('characters') || '{}');
        chars[currentUser.id] = currentCharacter;
        localStorage.setItem('characters', JSON.stringify(chars));
        localStorage.setItem('character', JSON.stringify(currentCharacter));
    } else {
        // API call
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${CONFIG.API_URL}/characters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, character_class: selectedClass })
            });
            
            if (!response.ok) throw new Error('Failed to create character');
            currentCharacter = await response.json();
            localStorage.setItem('character', JSON.stringify(currentCharacter));
        } catch (error) {
            showNotification('error', 'Error', error.message);
            return;
        }
    }
    
    showScreen('game');
    updateCharacterUI();
    loadGameData();
    connectWebSocket();
    showNotification('success', 'Success', `${name} the ${selectedClass} is ready!`);
}

async function loadCharacter() {
    if (CONFIG.USE_LOCAL_STORAGE) {
        const chars = JSON.parse(localStorage.getItem('characters') || '{}');
        if (chars[currentUser.id]) {
            currentCharacter = chars[currentUser.id];
            localStorage.setItem('character', JSON.stringify(currentCharacter));
            showScreen('game');
            updateCharacterUI();
            loadGameData();
            connectWebSocket();
        } else {
            showScreen('character');
        }
    } else {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${CONFIG.API_URL}/characters/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.status === 404) {
                showScreen('character');
                return;
            }
            
            if (!response.ok) throw new Error('Failed to load character');
            
            currentCharacter = await response.json();
            localStorage.setItem('character', JSON.stringify(currentCharacter));
            showScreen('game');
            updateCharacterUI();
            loadGameData();
            connectWebSocket();
        } catch (error) {
            showNotification('error', 'Error', error.message);
        }
    }
}

function saveCharacter() {
    if (CONFIG.USE_LOCAL_STORAGE) {
        const chars = JSON.parse(localStorage.getItem('characters') || '{}');
        chars[currentUser.id] = currentCharacter;
        localStorage.setItem('characters', JSON.stringify(chars));
        localStorage.setItem('character', JSON.stringify(currentCharacter));
    }
}

// ============== UI UPDATES ==============
function updateCharacterUI() {
    if (!currentCharacter) return;
    
    // Name and level
    document.getElementById('char-display-name').textContent = currentCharacter.name;
    document.getElementById('char-level').textContent = currentCharacter.level;
    
    // Class icon
    const classIcons = {
        warrior: 'fa-sword',
        mage: 'fa-hat-wizard',
        rogue: 'fa-user-ninja'
    };
    document.getElementById('char-class-icon').innerHTML = `<i class="fas ${classIcons[currentCharacter.character_class]}"></i>`;
    
    // Health bar
    const healthPercent = (currentCharacter.health / currentCharacter.max_health) * 100;
    document.getElementById('health-bar').style.width = `${healthPercent}%`;
    document.getElementById('health-text').textContent = `${currentCharacter.health}/${currentCharacter.max_health}`;
    
    // Mana bar
    const manaPercent = (currentCharacter.mana / currentCharacter.max_mana) * 100;
    document.getElementById('mana-bar').style.width = `${manaPercent}%`;
    document.getElementById('mana-text').textContent = `${currentCharacter.mana}/${currentCharacter.max_mana}`;
    
    // Stamina bar
    const staminaPercent = (currentCharacter.stamina / currentCharacter.max_stamina) * 100;
    document.getElementById('stamina-bar').style.width = `${staminaPercent}%`;
    document.getElementById('stamina-text').textContent = `${currentCharacter.stamina}/${currentCharacter.max_stamina}`;
    
    // Experience bar
    const expNeeded = currentCharacter.level * 100;
    const expPercent = (currentCharacter.experience / expNeeded) * 100;
    document.getElementById('exp-bar').style.width = `${expPercent}%`;
    document.getElementById('exp-text').textContent = `${currentCharacter.experience}/${expNeeded}`;
    
    // Stats
    document.getElementById('stat-str').textContent = currentCharacter.strength;
    document.getElementById('stat-int').textContent = currentCharacter.intelligence;
    document.getElementById('stat-agi').textContent = currentCharacter.agility;
    document.getElementById('stat-gold').textContent = currentCharacter.gold;
    
    // Battle stats
    document.getElementById('wins-count').textContent = currentCharacter.battle_stats.wins;
    document.getElementById('losses-count').textContent = currentCharacter.battle_stats.losses;
    document.getElementById('pvp-wins-count').textContent = currentCharacter.battle_stats.pvp_wins;
}

function loadGameData() {
    loadSkillsPreview();
    loadAchievements();
    loadEnemies();
    loadInventory();
    loadQuests();
    loadLeaderboard();
}

function loadSkillsPreview() {
    const skillsList = document.getElementById('skills-list');
    const skills = currentCharacter.skills || [];
    
    skillsList.innerHTML = skills.map(skill => `
        <div class="skill-item" data-tooltip="${skill.description}">
            <div class="skill-icon"><i class="${skill.icon || 'fas fa-star'}"></i></div>
            <div class="skill-info">
                <h4>${skill.name}</h4>
                <p>DMG: ${skill.damage} | MP: ${skill.mana_cost} | ST: ${skill.stamina_cost}</p>
            </div>
        </div>
    `).join('');
}

function loadAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    const unlockedIds = currentCharacter.achievements || [];
    
    achievementsList.innerHTML = ACHIEVEMENTS.map(ach => `
        <div class="achievement-item ${unlockedIds.includes(ach.id) ? 'unlocked' : ''}">
            <i class="${ach.icon}"></i>
            <p>${ach.name}</p>
        </div>
    `).join('');
}

// ============== TABS ==============
function showTab(tabName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// ============== BATTLE SYSTEM ==============
function loadEnemies() {
    const enemiesList = document.getElementById('enemies-list');
    const availableEnemies = ENEMIES.filter(e => e.level <= currentCharacter.level + 5);
    
    enemiesList.innerHTML = availableEnemies.map(enemy => `
        <div class="enemy-card" onclick="startBattle('${enemy.id}')" data-testid="enemy-${enemy.id}">
            <i class="${enemy.icon}"></i>
            <h4>${enemy.name}</h4>
            <span class="enemy-level">Lv. ${enemy.level}</span>
            <div class="enemy-stats">
                <span><i class="fas fa-heart"></i> ${enemy.health}</span>
                <span><i class="fas fa-swords"></i> ${enemy.damage}</span>
            </div>
        </div>
    `).join('');
}

function startBattle(enemyId) {
    const enemy = ENEMIES.find(e => e.id === enemyId);
    if (!enemy) return;
    
    // Calculate equipped bonuses
    let equipStr = 0, equipInt = 0;
    Object.values(currentCharacter.equipment || {}).forEach(itemId => {
        if (itemId) {
            const item = ITEMS.find(i => i.id === itemId);
            if (item && item.stats) {
                equipStr += item.stats.strength || 0;
                equipInt += item.stats.intelligence || 0;
            }
        }
    });
    
    currentBattle = {
        id: 'battle-' + Date.now(),
        type: 'pve',
        player: {
            name: currentCharacter.name,
            health: currentCharacter.health,
            max_health: currentCharacter.max_health,
            mana: currentCharacter.mana,
            max_mana: currentCharacter.max_mana,
            stamina: currentCharacter.stamina,
            max_stamina: currentCharacter.max_stamina,
            strength: currentCharacter.strength + equipStr,
            intelligence: currentCharacter.intelligence + equipInt,
            skills: currentCharacter.skills
        },
        enemy: {
            ...enemy,
            current_health: enemy.health
        },
        turn: 1,
        status: 'active',
        log: [`Battle started against ${enemy.name}!`]
    };
    
    document.getElementById('battle-select').classList.add('hidden');
    document.getElementById('battle-arena').classList.remove('hidden');
    updateBattleUI();
}

function updateBattleUI() {
    if (!currentBattle) return;
    
    // Player
    document.getElementById('battle-player-name').textContent = currentBattle.player.name;
    const playerHpPercent = (currentBattle.player.health / currentBattle.player.max_health) * 100;
    document.getElementById('battle-player-hp').style.width = `${playerHpPercent}%`;
    document.getElementById('battle-player-hp-text').textContent = `${currentBattle.player.health}/${currentBattle.player.max_health}`;
    
    // Enemy
    document.getElementById('battle-enemy-name').textContent = currentBattle.enemy.name;
    document.getElementById('battle-enemy-icon').className = currentBattle.enemy.icon;
    const enemyHpPercent = (currentBattle.enemy.current_health / currentBattle.enemy.health) * 100;
    document.getElementById('battle-enemy-hp').style.width = `${enemyHpPercent}%`;
    document.getElementById('battle-enemy-hp-text').textContent = `${currentBattle.enemy.current_health}/${currentBattle.enemy.health}`;
    
    // Battle log
    const logContainer = document.getElementById('battle-log');
    logContainer.innerHTML = currentBattle.log.map(msg => {
        let className = '';
        if (msg.includes('damage')) className = 'damage';
        if (msg.includes('Victory')) className = 'victory';
        if (msg.includes('defeated')) className = 'defeat';
        if (msg.includes('restores')) className = 'heal';
        return `<p class="${className}">${msg}</p>`;
    }).join('');
    logContainer.scrollTop = logContainer.scrollHeight;
    
    // Update skills menu
    updateSkillsMenu();
    updateItemsMenu();
}

function updateSkillsMenu() {
    const skillsMenu = document.getElementById('skills-menu');
    const skills = currentBattle.player.skills || [];
    
    skillsMenu.innerHTML = skills.map(skill => `
        <div class="menu-item" onclick="battleAction('skill', '${skill.id}')">
            <i class="${skill.icon || 'fas fa-star'}"></i>
            <span>${skill.name}</span>
            <span class="cost">MP: ${skill.mana_cost} ST: ${skill.stamina_cost}</span>
        </div>
    `).join('');
}

function updateItemsMenu() {
    const itemsMenu = document.getElementById('items-menu');
    const consumables = (currentCharacter.inventory || [])
        .filter(inv => {
            const item = ITEMS.find(i => i.id === inv.item_id);
            return item && item.item_type === 'consumable';
        });
    
    itemsMenu.innerHTML = consumables.map(inv => {
        const item = ITEMS.find(i => i.id === inv.item_id);
        return `
            <div class="menu-item" onclick="battleAction('item', '${inv.item_id}')">
                <i class="${item.icon}"></i>
                <span>${item.name}</span>
                <span class="cost">x${inv.quantity}</span>
            </div>
        `;
    }).join('') || '<div class="menu-item">No items</div>';
}

function toggleSkillsMenu() {
    document.getElementById('skills-menu').classList.toggle('hidden');
    document.getElementById('items-menu').classList.add('hidden');
}

function toggleItemsMenu() {
    document.getElementById('items-menu').classList.toggle('hidden');
    document.getElementById('skills-menu').classList.add('hidden');
}

function battleAction(actionType, actionId = null) {
    if (!currentBattle || currentBattle.status !== 'active') return;
    
    // Hide menus
    document.getElementById('skills-menu').classList.add('hidden');
    document.getElementById('items-menu').classList.add('hidden');
    
    let damage = 0;
    let logMsg = '';
    
    if (actionType === 'attack') {
        damage = currentBattle.player.strength + Math.floor(Math.random() * 11) + 5;
        damage = Math.max(1, damage - (currentBattle.enemy.defense || 0));
        currentBattle.enemy.current_health -= damage;
        currentBattle.player.stamina = Math.max(0, currentBattle.player.stamina - 10);
        logMsg = `${currentBattle.player.name} attacks for ${damage} damage!`;
        showDamageNumber(damage, 'damage', 'enemy');
        
    } else if (actionType === 'skill') {
        const skill = currentBattle.player.skills.find(s => s.id === actionId);
        if (!skill) return;
        
        if (currentBattle.player.mana < skill.mana_cost) {
            showNotification('warning', 'Warning', 'Not enough mana!');
            return;
        }
        if (currentBattle.player.stamina < skill.stamina_cost) {
            showNotification('warning', 'Warning', 'Not enough stamina!');
            return;
        }
        
        damage = skill.damage + Math.floor(currentBattle.player.intelligence / 2) + Math.floor(Math.random() * 11);
        damage = Math.max(1, damage - Math.floor((currentBattle.enemy.defense || 0) / 2));
        currentBattle.enemy.current_health -= damage;
        currentBattle.player.mana -= skill.mana_cost;
        currentBattle.player.stamina -= skill.stamina_cost;
        logMsg = `${currentBattle.player.name} uses ${skill.name} for ${damage} damage!`;
        showDamageNumber(damage, 'damage', 'enemy');
        
    } else if (actionType === 'defend') {
        currentBattle.player.defending = true;
        currentBattle.player.stamina = Math.min(currentBattle.player.max_stamina, currentBattle.player.stamina + 20);
        logMsg = `${currentBattle.player.name} takes a defensive stance!`;
        
    } else if (actionType === 'item') {
        const invItem = currentCharacter.inventory.find(i => i.item_id === actionId);
        const item = ITEMS.find(i => i.id === actionId);
        if (!invItem || !item) return;
        
        if (item.stats.heal) {
            const heal = item.stats.heal;
            currentBattle.player.health = Math.min(currentBattle.player.max_health, currentBattle.player.health + heal);
            logMsg = `${currentBattle.player.name} uses ${item.name} and restores ${heal} HP!`;
            showDamageNumber(heal, 'heal', 'player');
        }
        if (item.stats.mana) {
            const mana = item.stats.mana;
            currentBattle.player.mana = Math.min(currentBattle.player.max_mana, currentBattle.player.mana + mana);
            logMsg = `${currentBattle.player.name} uses ${item.name} and restores ${mana} MP!`;
        }
        
        // Remove item from inventory
        if (invItem.quantity > 1) {
            invItem.quantity--;
        } else {
            currentCharacter.inventory = currentCharacter.inventory.filter(i => i.item_id !== actionId);
        }
        saveCharacter();
    }
    
    currentBattle.log.push(logMsg);
    
    // Check if enemy defeated
    if (currentBattle.enemy.current_health <= 0) {
        handleVictory();
    } else {
        // Enemy turn
        enemyTurn();
    }
    
    updateBattleUI();
}

function enemyTurn() {
    let enemyDamage = currentBattle.enemy.damage + Math.floor(Math.random() * 9) - 3;
    
    if (currentBattle.player.defending) {
        enemyDamage = Math.floor(enemyDamage / 2);
        currentBattle.player.defending = false;
    }
    
    currentBattle.player.health -= enemyDamage;
    currentBattle.log.push(`${currentBattle.enemy.name} attacks for ${enemyDamage} damage!`);
    showDamageNumber(enemyDamage, 'damage', 'player');
    
    if (currentBattle.player.health <= 0) {
        handleDefeat();
    }
    
    currentBattle.turn++;
}

function handleVictory() {
    currentBattle.status = 'victory';
    const expGained = currentBattle.enemy.exp;
    const goldGained = currentBattle.enemy.gold;
    
    currentBattle.log.push(`Victory! Gained ${expGained} EXP and ${goldGained} gold!`);
    
    // Update character
    currentCharacter.experience += expGained;
    currentCharacter.gold += goldGained;
    currentCharacter.health = currentBattle.player.health;
    currentCharacter.mana = currentBattle.player.mana;
    currentCharacter.stamina = currentBattle.player.stamina;
    currentCharacter.battle_stats.wins++;
    
    // Check level up
    const expNeeded = currentCharacter.level * 100;
    while (currentCharacter.experience >= expNeeded) {
        currentCharacter.experience -= expNeeded;
        levelUp();
    }
    
    // Update quests
    updateQuestProgress(currentBattle.enemy.id);
    
    // Check achievements
    if (!currentCharacter.achievements.includes('first_kill')) {
        currentCharacter.achievements.push('first_kill');
        showNotification('success', 'Achievement!', 'First Kill unlocked!');
    }
    
    if (currentCharacter.gold >= 1000 && !currentCharacter.achievements.includes('rich')) {
        currentCharacter.achievements.push('rich');
        showNotification('success', 'Achievement!', 'Fortune Seeker unlocked!');
    }
    
    if (currentBattle.enemy.id === 'dragon' && !currentCharacter.achievements.includes('dragon_slayer')) {
        currentCharacter.achievements.push('dragon_slayer');
        showNotification('success', 'Achievement!', 'Dragon Slayer unlocked!');
    }
    
    saveCharacter();
    updateCharacterUI();
    
    showNotification('success', t('victory'), `+${expGained} EXP, +${goldGained} Gold`);
    
    setTimeout(() => {
        document.getElementById('battle-arena').classList.add('hidden');
        document.getElementById('battle-select').classList.remove('hidden');
        currentBattle = null;
        loadEnemies();
        loadQuests();
        loadAchievements();
    }, 2000);
}

function handleDefeat() {
    currentBattle.status = 'defeat';
    currentBattle.log.push('You have been defeated!');
    
    currentCharacter.health = Math.floor(currentCharacter.max_health / 2);
    currentCharacter.mana = currentCharacter.max_mana;
    currentCharacter.stamina = currentCharacter.max_stamina;
    currentCharacter.battle_stats.losses++;
    
    saveCharacter();
    updateCharacterUI();
    
    showNotification('error', t('defeat'), 'You wake up at the inn...');
    
    setTimeout(() => {
        document.getElementById('battle-arena').classList.add('hidden');
        document.getElementById('battle-select').classList.remove('hidden');
        currentBattle = null;
    }, 2000);
}

function levelUp() {
    currentCharacter.level++;
    const baseStats = CLASS_BASE_STATS[currentCharacter.character_class];
    
    currentCharacter.max_health = baseStats.health + (currentCharacter.level - 1) * 10;
    currentCharacter.max_mana = baseStats.mana + (currentCharacter.level - 1) * 5;
    currentCharacter.max_stamina = baseStats.stamina + (currentCharacter.level - 1) * 5;
    currentCharacter.strength = baseStats.strength + (currentCharacter.level - 1) * 2;
    currentCharacter.intelligence = baseStats.intelligence + (currentCharacter.level - 1) * 2;
    currentCharacter.agility = baseStats.agility + (currentCharacter.level - 1) * 2;
    
    // Full restore on level up
    currentCharacter.health = currentCharacter.max_health;
    currentCharacter.mana = currentCharacter.max_mana;
    currentCharacter.stamina = currentCharacter.max_stamina;
    
    // Check for new skills
    const allSkills = CLASS_SKILLS[currentCharacter.character_class];
    const newSkills = allSkills.filter(s => 
        s.level_req <= currentCharacter.level && 
        !currentCharacter.skills.find(cs => cs.id === s.id)
    );
    
    if (newSkills.length > 0) {
        currentCharacter.skills.push(...newSkills);
        showNotification('success', t('newSkill'), newSkills.map(s => s.name).join(', '));
    }
    
    // Check level achievements
    if (currentCharacter.level >= 5 && !currentCharacter.achievements.includes('level_5')) {
        currentCharacter.achievements.push('level_5');
        showNotification('success', 'Achievement!', 'Apprentice unlocked!');
    }
    if (currentCharacter.level >= 10 && !currentCharacter.achievements.includes('level_10')) {
        currentCharacter.achievements.push('level_10');
        showNotification('success', 'Achievement!', 'Veteran unlocked!');
    }
    
    showNotification('success', t('levelUp'), `Now level ${currentCharacter.level}!`);
}

function fleeBattle() {
    if (!currentBattle) return;
    
    currentBattle.log.push('You fled from battle!');
    showNotification('warning', 'Fled', 'You escaped!');
    
    document.getElementById('battle-arena').classList.add('hidden');
    document.getElementById('battle-select').classList.remove('hidden');
    currentBattle = null;
}

function showDamageNumber(amount, type, target) {
    const container = document.getElementById('damage-numbers');
    const element = document.createElement('div');
    element.className = `damage-number ${type}`;
    element.textContent = type === 'heal' ? `+${amount}` : `-${amount}`;
    
    // Position based on target
    const targetEl = target === 'enemy' 
        ? document.querySelector('.enemy-portrait')
        : document.querySelector('.player-portrait');
    
    if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        element.style.left = `${rect.left + rect.width / 2}px`;
        element.style.top = `${rect.top}px`;
    }
    
    container.appendChild(element);
    
    setTimeout(() => element.remove(), 1000);
}

// ============== INVENTORY ==============
function loadInventory() {
    const inventoryGrid = document.getElementById('inventory-grid');
    const inventory = currentCharacter.inventory || [];
    
    inventoryGrid.innerHTML = inventory.map(inv => {
        const item = ITEMS.find(i => i.id === inv.item_id);
        if (!item) return '';
        
        return `
            <div class="inventory-item rarity-${item.rarity}" 
                 draggable="true" 
                 ondragstart="dragStart(event, '${inv.item_id}')"
                 onclick="showItemDetails('${inv.item_id}')"
                 data-tooltip="${item.name}: ${item.description}"
                 data-testid="item-${inv.item_id}">
                <i class="${item.icon}"></i>
                <span class="quantity">${inv.quantity}</span>
            </div>
        `;
    }).join('');
    
    // Update equipment slots
    ['weapon', 'armor', 'accessory'].forEach(slot => {
        const equippedId = currentCharacter.equipment[slot];
        const slotEl = document.getElementById(`equipped-${slot}`);
        
        if (equippedId) {
            const item = ITEMS.find(i => i.id === equippedId);
            slotEl.innerHTML = `
                <i class="${item.icon}"></i>
                <span>${item.name}</span>
                <button onclick="unequipItem('${slot}')" class="btn-unequip">×</button>
            `;
        } else {
            slotEl.innerHTML = '';
        }
    });
}

function dragStart(event, itemId) {
    event.dataTransfer.setData('text/plain', itemId);
}

function allowDrop(event) {
    event.preventDefault();
}

function dropEquip(event, slot) {
    event.preventDefault();
    const itemId = event.dataTransfer.getData('text/plain');
    equipItem(itemId, slot);
}

function equipItem(itemId, slot) {
    const item = ITEMS.find(i => i.id === itemId);
    if (!item) return;
    
    // Check if item type matches slot
    const slotTypes = { weapon: 'weapon', armor: 'armor', accessory: 'accessory' };
    if (item.item_type !== slotTypes[slot]) {
        showNotification('error', 'Error', 'Wrong slot for this item');
        return;
    }
    
    // Check inventory
    const invItem = currentCharacter.inventory.find(i => i.item_id === itemId);
    if (!invItem) return;
    
    // Unequip current item if any
    const currentEquipped = currentCharacter.equipment[slot];
    if (currentEquipped) {
        const existing = currentCharacter.inventory.find(i => i.item_id === currentEquipped);
        if (existing) {
            existing.quantity++;
        } else {
            currentCharacter.inventory.push({ item_id: currentEquipped, quantity: 1 });
        }
    }
    
    // Equip new item
    currentCharacter.equipment[slot] = itemId;
    
    // Remove from inventory
    if (invItem.quantity > 1) {
        invItem.quantity--;
    } else {
        currentCharacter.inventory = currentCharacter.inventory.filter(i => i.item_id !== itemId);
    }
    
    saveCharacter();
    loadInventory();
    updateCharacterUI();
    showNotification('success', 'Equipped', `${item.name} equipped!`);
}

function unequipItem(slot) {
    const equippedId = currentCharacter.equipment[slot];
    if (!equippedId) return;
    
    // Add back to inventory
    const existing = currentCharacter.inventory.find(i => i.item_id === equippedId);
    if (existing) {
        existing.quantity++;
    } else {
        currentCharacter.inventory.push({ item_id: equippedId, quantity: 1 });
    }
    
    currentCharacter.equipment[slot] = null;
    
    saveCharacter();
    loadInventory();
    updateCharacterUI();
}

function showItemDetails(itemId) {
    const item = ITEMS.find(i => i.id === itemId);
    if (!item) return;
    
    let statsHtml = '';
    if (item.stats) {
        statsHtml = Object.entries(item.stats)
            .map(([stat, val]) => `<span>+${val} ${stat}</span>`)
            .join('');
    }
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="item-details">
            <div style="text-align: center; margin-bottom: 1rem;">
                <i class="${item.icon}" style="font-size: 3rem; color: var(--primary);"></i>
            </div>
            <h2 style="text-align: center; margin-bottom: 0.5rem;">${item.name}</h2>
            <p style="text-align: center; color: var(--rarity-${item.rarity}); text-transform: capitalize;">${item.rarity}</p>
            <p style="text-align: center; margin: 1rem 0;">${item.description}</p>
            ${statsHtml ? `<div class="tooltip stats" style="text-align: center;">${statsHtml}</div>` : ''}
            <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 1.5rem;">
                ${item.item_type !== 'consumable' ? `
                    <button class="btn btn-primary" onclick="equipItem('${itemId}', '${item.item_type}'); closeModal();">Equip</button>
                ` : `
                    <button class="btn btn-primary" onclick="useItem('${itemId}'); closeModal();">Use</button>
                `}
            </div>
        </div>
    `;
    
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function useItem(itemId) {
    const item = ITEMS.find(i => i.id === itemId);
    const invItem = currentCharacter.inventory.find(i => i.item_id === itemId);
    if (!item || !invItem || item.item_type !== 'consumable') return;
    
    if (item.stats.heal) {
        currentCharacter.health = Math.min(currentCharacter.max_health, currentCharacter.health + item.stats.heal);
    }
    if (item.stats.mana) {
        currentCharacter.mana = Math.min(currentCharacter.max_mana, currentCharacter.mana + item.stats.mana);
    }
    if (item.stats.stamina) {
        currentCharacter.stamina = Math.min(currentCharacter.max_stamina, currentCharacter.stamina + item.stats.stamina);
    }
    
    if (invItem.quantity > 1) {
        invItem.quantity--;
    } else {
        currentCharacter.inventory = currentCharacter.inventory.filter(i => i.item_id !== itemId);
    }
    
    saveCharacter();
    loadInventory();
    updateCharacterUI();
    showNotification('success', 'Used', `${item.name} used!`);
}

// ============== SHOP ==============
function openShop() {
    const modalBody = document.getElementById('modal-body');
    
    const shopItems = ITEMS.filter(i => i.price);
    
    modalBody.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 1rem;"><i class="fas fa-store"></i> Shop</h2>
        <p style="text-align: center; color: var(--gold); margin-bottom: 1.5rem;">
            <i class="fas fa-coins"></i> Your Gold: ${currentCharacter.gold}
        </p>
        <div class="shop-grid">
            ${shopItems.map(item => `
                <div class="shop-item rarity-${item.rarity}" onclick="buyItem('${item.id}')" data-testid="shop-${item.id}">
                    <i class="${item.icon}"></i>
                    <h4>${item.name}</h4>
                    <p class="price"><i class="fas fa-coins"></i> ${item.price}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function buyItem(itemId) {
    const item = ITEMS.find(i => i.id === itemId);
    if (!item || !item.price) return;
    
    if (currentCharacter.gold < item.price) {
        showNotification('error', 'Error', t('notEnoughGold'));
        return;
    }
    
    currentCharacter.gold -= item.price;
    
    const existing = currentCharacter.inventory.find(i => i.item_id === itemId);
    if (existing) {
        existing.quantity++;
    } else {
        currentCharacter.inventory.push({ item_id: itemId, quantity: 1 });
    }
    
    saveCharacter();
    updateCharacterUI();
    loadInventory();
    openShop(); // Refresh shop modal
    showNotification('success', 'Purchased', `${item.name} ${t('itemBought')}`);
}

// ============== CRAFTING ==============
function openCrafting() {
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 1rem;"><i class="fas fa-hammer"></i> Crafting</h2>
        <p style="text-align: center; color: var(--gold); margin-bottom: 1.5rem;">
            <i class="fas fa-coins"></i> Your Gold: ${currentCharacter.gold}
        </p>
        <div class="shop-grid">
            ${CRAFTING_RECIPES.map(recipe => {
                const canCraft = checkCanCraft(recipe);
                return `
                    <div class="shop-item ${canCraft ? '' : 'disabled'}" 
                         onclick="${canCraft ? `craftItem('${recipe.id}')` : ''}"
                         style="${canCraft ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
                        <i class="${recipe.icon}"></i>
                        <h4>${recipe.name}</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">
                            ${recipe.materials.map(m => `${m.item === 'gold' ? m.count + 'g' : m.count + 'x ' + m.item}`).join(', ')}
                        </p>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function checkCanCraft(recipe) {
    for (const mat of recipe.materials) {
        if (mat.item === 'gold') {
            if (currentCharacter.gold < mat.count) return false;
        } else {
            const invItem = currentCharacter.inventory.find(i => i.item_id === mat.item);
            if (!invItem || invItem.quantity < mat.count) return false;
        }
    }
    return true;
}

function craftItem(recipeId) {
    const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
    if (!recipe || !checkCanCraft(recipe)) return;
    
    // Remove materials
    for (const mat of recipe.materials) {
        if (mat.item === 'gold') {
            currentCharacter.gold -= mat.count;
        } else {
            const invItem = currentCharacter.inventory.find(i => i.item_id === mat.item);
            invItem.quantity -= mat.count;
            if (invItem.quantity <= 0) {
                currentCharacter.inventory = currentCharacter.inventory.filter(i => i.item_id !== mat.item);
            }
        }
    }
    
    // Add crafted item
    const existing = currentCharacter.inventory.find(i => i.item_id === recipe.result);
    if (existing) {
        existing.quantity++;
    } else {
        currentCharacter.inventory.push({ item_id: recipe.result, quantity: 1 });
    }
    
    saveCharacter();
    updateCharacterUI();
    loadInventory();
    openCrafting(); // Refresh
    
    const resultItem = ITEMS.find(i => i.id === recipe.result);
    showNotification('success', 'Crafted!', `${resultItem.name} created!`);
}

// ============== QUESTS ==============
function loadQuests() {
    // Active quests
    const activeList = document.getElementById('active-quests-list');
    const activeQuests = currentCharacter.quests || [];
    
    activeList.innerHTML = activeQuests.map(quest => {
        const objective = quest.objectives[0];
        const progress = (objective.current / objective.count) * 100;
        const isComplete = objective.current >= objective.count;
        
        return `
            <div class="quest-item">
                <h4>
                    ${quest.name}
                    ${isComplete ? '<span style="color: var(--accent);">✓</span>' : ''}
                </h4>
                <p>${quest.description}</p>
                <div class="quest-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span>${objective.current}/${objective.count}</span>
                </div>
                <div class="quest-rewards">
                    <span class="exp"><i class="fas fa-star"></i> ${quest.rewards.exp} EXP</span>
                    <span class="gold"><i class="fas fa-coins"></i> ${quest.rewards.gold}</span>
                    ${quest.rewards.item ? `<span><i class="fas fa-gift"></i> ${quest.rewards.item}</span>` : ''}
                </div>
                ${isComplete ? `
                    <div class="quest-actions">
                        <button class="btn btn-primary" onclick="completeQuest('${quest.id}')">Complete</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('') || '<p style="color: var(--text-muted);">No active quests</p>';
    
    // Available quests
    const availableList = document.getElementById('available-quests-list');
    const activeIds = activeQuests.map(q => q.id);
    const available = QUESTS.filter(q => 
        !activeIds.includes(q.id) && 
        q.level_req <= currentCharacter.level
    );
    
    availableList.innerHTML = available.map(quest => `
        <div class="quest-item">
            <h4>${quest.name}</h4>
            <p>${quest.description}</p>
            <div class="quest-rewards">
                <span class="exp"><i class="fas fa-star"></i> ${quest.rewards.exp} EXP</span>
                <span class="gold"><i class="fas fa-coins"></i> ${quest.rewards.gold}</span>
                ${quest.rewards.item ? `<span><i class="fas fa-gift"></i> ${quest.rewards.item}</span>` : ''}
            </div>
            <div class="quest-actions">
                <button class="btn btn-secondary" onclick="acceptQuest('${quest.id}')">Accept</button>
            </div>
        </div>
    `).join('') || '<p style="color: var(--text-muted);">No available quests</p>';
}

function acceptQuest(questId) {
    const quest = QUESTS.find(q => q.id === questId);
    if (!quest) return;
    
    if (currentCharacter.quests.find(q => q.id === questId)) {
        showNotification('warning', 'Warning', 'Quest already active');
        return;
    }
    
    const questCopy = {
        ...quest,
        objectives: quest.objectives.map(o => ({ ...o, current: 0 })),
        status: 'active'
    };
    
    currentCharacter.quests.push(questCopy);
    saveCharacter();
    loadQuests();
    showNotification('success', 'Quest Accepted', quest.name);
}

function completeQuest(questId) {
    const questIndex = currentCharacter.quests.findIndex(q => q.id === questId);
    if (questIndex === -1) return;
    
    const quest = currentCharacter.quests[questIndex];
    
    // Check if complete
    const objective = quest.objectives[0];
    if (objective.current < objective.count) {
        showNotification('error', 'Error', 'Quest not complete');
        return;
    }
    
    // Give rewards
    currentCharacter.experience += quest.rewards.exp;
    currentCharacter.gold += quest.rewards.gold;
    
    if (quest.rewards.item) {
        const existing = currentCharacter.inventory.find(i => i.item_id === quest.rewards.item);
        if (existing) {
            existing.quantity++;
        } else {
            currentCharacter.inventory.push({ item_id: quest.rewards.item, quantity: 1 });
        }
    }
    
    // Remove quest
    currentCharacter.quests.splice(questIndex, 1);
    
    // Check level up
    const expNeeded = currentCharacter.level * 100;
    while (currentCharacter.experience >= expNeeded) {
        currentCharacter.experience -= expNeeded;
        levelUp();
    }
    
    saveCharacter();
    updateCharacterUI();
    loadQuests();
    loadInventory();
    
    showNotification('success', t('questComplete'), `+${quest.rewards.exp} EXP, +${quest.rewards.gold} Gold`);
}

function updateQuestProgress(enemyId) {
    let updated = false;
    
    currentCharacter.quests.forEach(quest => {
        quest.objectives.forEach(obj => {
            if (obj.type === 'kill') {
                if (obj.target === 'any' || obj.target === enemyId) {
                    if (obj.current < obj.count) {
                        obj.current++;
                        updated = true;
                    }
                }
            }
        });
    });
    
    if (updated) {
        saveCharacter();
    }
}

// ============== REST ==============
function restCharacter() {
    if (currentCharacter.gold < 10) {
        showNotification('error', 'Error', t('notEnoughGold'));
        return;
    }
    
    currentCharacter.gold -= 10;
    currentCharacter.health = currentCharacter.max_health;
    currentCharacter.mana = currentCharacter.max_mana;
    currentCharacter.stamina = currentCharacter.max_stamina;
    
    saveCharacter();
    updateCharacterUI();
    showNotification('success', 'Rested', t('rested'));
}

// ============== LEADERBOARD ==============
function loadLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    
    if (CONFIG.USE_LOCAL_STORAGE) {
        // Get all characters from local storage
        const chars = JSON.parse(localStorage.getItem('characters') || '{}');
        const charArray = Object.values(chars).sort((a, b) => b.level - a.level);
        
        leaderboardList.innerHTML = charArray.slice(0, 20).map((char, index) => `
            <div class="leaderboard-item">
                <span class="leaderboard-rank">#${index + 1}</span>
                <div class="leaderboard-info">
                    <h4>${char.name}</h4>
                    <span>${char.character_class}</span>
                </div>
                <span class="leaderboard-level">Lv. ${char.level}</span>
                <div class="leaderboard-stats">
                    <span><i class="fas fa-trophy"></i> ${char.battle_stats?.wins || 0}</span>
                    <span><i class="fas fa-swords"></i> ${char.battle_stats?.pvp_wins || 0}</span>
                </div>
            </div>
        `).join('') || '<p style="text-align: center; color: var(--text-muted);">No players yet</p>';
    }
}

// ============== PVP & WEBSOCKET ==============
function connectWebSocket() {
    if (CONFIG.USE_LOCAL_STORAGE) {
        // Simulate WebSocket for local mode
        console.log('WebSocket simulation active (local mode)');
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        websocket = new WebSocket(`${CONFIG.WS_URL}/${token}`);
        
        websocket.onopen = () => {
            console.log('WebSocket connected');
            websocket.send(JSON.stringify({ action: 'get_chat_history' }));
        };
        
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
        };
        
        websocket.onclose = () => {
            console.log('WebSocket disconnected');
            setTimeout(connectWebSocket, 5000);
        };
        
        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    } catch (error) {
        console.error('Failed to connect WebSocket:', error);
    }
}

function handleWebSocketMessage(data) {
    switch (data.type) {
        case 'matchmaking':
            if (data.status === 'searching') {
                document.getElementById('matchmaking-btn').textContent = 'Searching...';
            } else if (data.status === 'left') {
                document.getElementById('matchmaking-btn').textContent = t('findMatch');
                isInMatchmaking = false;
            }
            break;
            
        case 'battle_start':
            isInMatchmaking = false;
            showNotification('success', 'Match Found!', 'PvP battle starting!');
            // Handle PvP battle
            break;
            
        case 'chat':
            addChatMessage(data.sender, data.message);
            break;
            
        case 'chat_history':
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.innerHTML = '';
            data.messages.forEach(msg => addChatMessage(msg.sender, msg.message));
            break;
    }
}

function joinMatchmaking() {
    if (CONFIG.USE_LOCAL_STORAGE) {
        showNotification('info', 'PvP', 'PvP requires online mode. Connect to server for multiplayer!');
        return;
    }
    
    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
        showNotification('error', 'Error', 'Not connected to server');
        return;
    }
    
    if (isInMatchmaking) {
        websocket.send(JSON.stringify({ action: 'leave_matchmaking' }));
        isInMatchmaking = false;
    } else {
        websocket.send(JSON.stringify({ action: 'join_matchmaking' }));
        isInMatchmaking = true;
    }
}

function joinCoop() {
    showNotification('info', 'Co-op', 'Co-op mode coming soon!');
}

function sendChat() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    if (CONFIG.USE_LOCAL_STORAGE) {
        // Local chat simulation
        addChatMessage(currentCharacter.name, message);
        input.value = '';
        return;
    }
    
    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
        showNotification('error', 'Error', 'Not connected to server');
        return;
    }
    
    websocket.send(JSON.stringify({
        action: 'chat',
        message: message
    }));
    
    input.value = '';
}

function addChatMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-message';
    msgEl.innerHTML = `<span class="sender">${sender}:</span><span class="text">${message}</span>`;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ============== MODALS ==============
function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

// Close modal on overlay click
document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
});

// ============== NOTIFICATIONS ==============
function showNotification(type, title, message) {
    const container = document.getElementById('notifications');
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============== TOOLTIPS ==============
function setupTooltips() {
    const tooltip = document.getElementById('tooltip');
    
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (target) {
            tooltip.textContent = target.dataset.tooltip;
            tooltip.classList.remove('hidden');
            
            const rect = target.getBoundingClientRect();
            tooltip.style.left = `${rect.left}px`;
            tooltip.style.top = `${rect.bottom + 10}px`;
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('[data-tooltip]')) {
            tooltip.classList.add('hidden');
        }
    });
}

// ============== EXPORT FOR GITHUB PAGES ==============
// This game works entirely in the browser using localStorage
// For multiplayer features, deploy the backend to Railway/Render/Fly.io
// and update CONFIG.API_URL and CONFIG.WS_URL
