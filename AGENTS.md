# AGENTS.md

## 1. Project Overview

Project name: Xe Bánh Mì Nhỏ

Xe Bánh Mì Nhỏ is a mobile-first Vietnamese street food simulation web game.

The player manages a small bánh mì street cart, prepares ingredients, receives customer orders, makes bánh mì, serves customers, earns money, manages inventory, and gradually develops the shop.

The game is designed to run in a web browser and later support installation as a Progressive Web App (PWA).

---

## 2. Technology Stack

The MVP uses:

* HTML5
* CSS3
* JavaScript
* Vite
* LocalStorage
* PWA
* Git
* GitHub

Development environment:

* Visual Studio Code
* Node.js
* npm

Do not introduce React, Vue, Angular, TypeScript, a backend, or a database unless explicitly requested.

---

## 3. MVP Scope

The MVP does not use:

* Backend server
* Database
* User accounts
* Online multiplayer
* Cloud save
* External APIs
* Authentication
* Payment systems

Game data is stored locally using LocalStorage.

---

## 4. Core Game Flow

The main game flow is:

MAIN_MENU
↓
SHOP_NAMING
↓
INITIAL_SHOPPING
↓
PREPARATION
↓
START_DAY
↓
GAMEPLAY
↓
ORDER
↓
MAKE_BREAD
↓
SERVING_RESULT
↓
DAY_SUMMARY
↓
PREPARATION

The player should be able to stop at the Preparation screen after a day ends.

The game must not automatically start the next day.

The Preparation screen contains a clear "BẮT ĐẦU NGÀY X" button.

---

## 5. Game Screens

The main screens are:

* Main Menu
* Shop Naming
* Initial Shopping
* Preparation
* Gameplay
* Order
* Make Bread
* Serving Result
* Day Summary
* Settings

Keep major game functions separated into independent screens or screen states.

Do not put the entire game UI into one large screen unless explicitly requested.

---

## 6. Project Structure

Use the following structure:

src/
├── components/
├── data/
├── game/
├── screens/
├── styles/
├── systems/
└── utils/

General responsibilities:

### components/

Reusable small UI components.

Examples:

* Button
* Money display
* Inventory item
* Customer card
* Star rating

### data/

Static game data.

Examples:

* Ingredients
* Recipes
* Customers
* Customer types
* Prices
* Game configuration

### game/

Core game state and game-level logic.

Examples:

* Current day
* Current money
* Shop name
* Current screen
* Player state

### screens/

Individual game screens.

Examples:

* MainMenuScreen
* ShopNamingScreen
* PreparationScreen
* GameplayScreen
* OrderScreen
* DaySummaryScreen

### systems/

Independent game systems.

Examples:

* Inventory system
* Order system
* Money system
* Customer system
* Day system
* Rating system
* Save/Load system

### styles/

Game CSS files.

### utils/

Small reusable utility functions.

---

## 7. Game State

Important game state includes:

* shopName
* currentDay
* money
* inventory
* longLastingIngredients
* tools
* upgrades
* rating
* regularCustomers
* unlockedRecipes
* unlockedFeatures

Keep game state centralized and predictable.

Avoid creating duplicated versions of the same game state in multiple files.

---

## 8. Inventory Rules

There are three main inventory categories.

### Long-lasting consumables

Examples:

* Soy sauce
* Chili sauce
* Ketchup
* Cooking oil
* Salt
* Pepper

These have usage counts.

Example:

A bottle may have 100 uses.

Each use decreases the remaining usage count by 1.

When the usage count reaches 0, the player must buy a new bottle.

### Fresh ingredients

Examples:

* Meat
* Cha
* Pate
* Vegetables
* Cucumber
* Bread

Fresh ingredients are intended for the current day.

Unused fresh ingredients are discarded when the day ends.

They do not automatically carry over to the next day.

### Durable tools

Examples:

* Knife
* Gloves
* Tongs
* Trays
* Cart

Tools do not have durability in the MVP.

---

## 9. Regular Customers

The game contains regular customers.

The game should remember information such as:

* Customer name
* Visit count
* Usual order
* Preferences
* Notes

Example:

Minh:

* Usual order: Bánh mì thịt + pate
* No vegetables
* Little chili sauce

During an order, the UI may show a small "Khách quen" indicator.

The player can view customer notes.

If a customer says "Như cũ nha", the game may show a hint based on their usual order.

Do not automatically complete the order for the player.

---

## 10. Customer Orders

Customers may order combinations of bánh mì ingredients.

Example menu:

* Bánh mì không
* Bánh mì thịt
* Bánh mì chả
* Bánh mì pate
* Bánh mì đặc biệt

The player selects ingredients based on the customer's order.

Possible outcomes:

* Correct order → full payment and high rating
* Partially correct order → reduced payment and rating
* Wrong order → poor result

Do not make the ordering system unnecessarily complicated during the MVP.

---

## 11. Money System

Track at least:

* Current money
* Daily revenue
* Daily ingredient cost
* Daily profit

The Day Summary should display these values clearly.

---

## 12. Day System

The game uses day-based progression.

Example progression:

Day 1:

* Tutorial

Day 2:

* More customers

Day 3:

* Unlock pate

Day 4:

* More difficult customer

Day 5:

* First upgrade

The exact economy and progression values may be adjusted during development.

Do not hard-code large amounts of duplicated progression logic.

---

## 13. Day Summary

At the end of each day, show:

* Revenue
* Ingredient cost
* Profit
* Customers served
* Bánh mì sold
* Rating
* Wasted ingredients
* Current money

The player should be able to confirm the summary and return to Preparation.

Do not automatically start the next day.

---

## 14. Save System

Use LocalStorage for the MVP.

Save at least:

* Shop name
* Current day
* Money
* Inventory
* Long-lasting ingredient usage
* Tools
* Upgrades
* Rating
* Regular customers
* Unlocked recipes
* Unlocked features

The Settings screen should contain a Reset Game function.

Reset Game must require confirmation before deleting save data.

---

## 15. UI / UX Rules

The game is mobile-first.

Prioritize:

* Touch-friendly buttons
* Large readable text
* Simple navigation
* Clear feedback
* Short interactions
* Minimal clutter

Visual direction:

* Cute
* Cozy
* Vietnamese street food
* Simple 2D
* Warm atmosphere
* Cartoon-like style

Avoid overly complex UI.

Important game actions should be visually obvious.

---

## 16. Responsive Design

The game must work on:

* Mobile portrait
* Mobile landscape when practical
* Desktop browser

Mobile is the primary target.

Do not design desktop-first and simply shrink the UI for mobile.

---

## 17. Coding Rules

Keep code simple and readable.

Prefer:

* Small functions
* Clear variable names
* Small modules
* Simple data structures
* Explicit game state

Avoid unnecessary:

* Abstraction
* Design patterns
* Complex class hierarchies
* Large dependencies
* Clever one-line code
* Premature optimization

The user is learning JavaScript while developing this project.

Code should therefore be understandable to a beginner.

---

## 18. Dependency Rules

Do not install new npm packages unless explicitly requested or clearly justified.

Before adding a dependency:

1. Explain why it is needed.
2. Explain what it will be used for.
3. Wait for approval if it is not necessary for the current task.

Prefer native JavaScript and existing project dependencies.

---

## 19. AI Agent Task Rules

AI must work incrementally.

For each task:

1. Understand the requested task.
2. Identify the files that need to be changed.
3. Explain the planned changes briefly.
4. Make only the required changes.
5. Do not modify unrelated files.
6. Do not delete working features.
7. Do not continue automatically to another task.
8. Report which files were created or modified.
9. Report any assumptions or problems.

Each task should produce a small, testable result.

---

## 20. Change Safety Rules

Do not rewrite the entire project unless explicitly requested.

Do not replace existing architecture just because another approach is preferred.

Before modifying an important existing file:

* Read the current file.
* Understand its role.
* Preserve working functionality.

Do not remove working code without a clear reason.

---

## 21. Testing Rules

After implementing a task:

1. Run the development server.
2. Open the game in the browser.
3. Test the changed functionality.
4. Check the browser console for errors.
5. Report the result.

Do not claim that a feature works without testing it.

---

## 22. Git Rules

Keep commits small and meaningful.

Example:

feat: add main menu

fix: fix customer order calculation

feat: add inventory system

refactor: simplify screen manager

Do not commit:

* node_modules
* build output
* .env files
* personal secrets
* temporary files

---

## 23. Source of Truth

The Game Design Document (GDD) is the main source of truth for game behavior and design.

Important project decisions should be consistent with the GDD.

If a requested implementation conflicts with the GDD:

* Identify the conflict.
* Explain it briefly.
* Do not silently change the game design.

---

## 24. Current Development Priority

Development should generally follow this order:

1. Project foundation
2. Screen Manager
3. Game State
4. Main Menu
5. Shop Naming
6. Player State
7. Preparation Screen
8. Ingredient Data
9. Inventory
10. Customer Data
11. Customer Spawning
12. Order System
13. Bread Making
14. Serving Result
15. Money System
16. Rating System
17. Day System
18. Day Summary
19. Save / Load
20. Mobile UI improvements
21. PWA
22. Polish

Do not implement later systems before the required foundation is stable unless explicitly requested.

---

## 25. Important Rule

The AI Agent is a development assistant, not the project owner.

Do not make major design decisions automatically.

If a major decision is not specified:

* explain the available options,
* recommend a simple option when appropriate,
* and wait for the user's decision when the choice would significantly affect the architecture or gameplay.

The goal is to build Xe Bánh Mì Nhỏ step by step while keeping the project understandable, maintainable, and easy for the user to learn from.
