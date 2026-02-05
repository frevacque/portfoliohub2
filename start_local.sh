#!/bin/bash

# ===========================================
# PortfolioHub - Script de démarrage local
# ===========================================

echo "🚀 Démarrage de PortfolioHub..."
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Répertoire du script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Fonction de nettoyage
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Arrêt de l'application...${NC}"
    
    # Arrêter les processus
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "   Backend arrêté"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "   Frontend arrêté"
    fi
    
    echo -e "${GREEN}✅ Application arrêtée proprement${NC}"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT SIGTERM

# Vérifier les prérequis
echo "📋 Vérification des prérequis..."

# Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 n'est pas installé${NC}"
    echo "   Installez-le avec: brew install python@3.11"
    exit 1
fi
echo -e "   ${GREEN}✓${NC} Python $(python3 --version | cut -d' ' -f2)"

# Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo "   Installez-le avec: brew install node@18"
    exit 1
fi
echo -e "   ${GREEN}✓${NC} Node.js $(node --version)"

# MongoDB
if ! command -v mongod &> /dev/null; then
    echo -e "${RED}❌ MongoDB n'est pas installé${NC}"
    echo "   Installez-le avec: brew install mongodb-community"
    exit 1
fi
echo -e "   ${GREEN}✓${NC} MongoDB installé"

echo ""

# Démarrer MongoDB si nécessaire
echo "🍃 Vérification de MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "   Démarrage de MongoDB..."
    brew services start mongodb-community 2>/dev/null || mongod --dbpath ~/data/db &
    sleep 3
fi
echo -e "   ${GREEN}✓${NC} MongoDB actif"

echo ""

# Vérifier que les dossiers existent
if [ ! -d "$SCRIPT_DIR/backend" ]; then
    echo -e "${RED}❌ Dossier backend non trouvé${NC}"
    exit 1
fi

if [ ! -d "$SCRIPT_DIR/frontend" ]; then
    echo -e "${RED}❌ Dossier frontend non trouvé${NC}"
    exit 1
fi

# Créer les fichiers .env si nécessaire
if [ ! -f "$SCRIPT_DIR/backend/.env" ]; then
    echo "📝 Création du fichier backend/.env..."
    cat > "$SCRIPT_DIR/backend/.env" << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfoliohub
EOF
fi

if [ ! -f "$SCRIPT_DIR/frontend/.env" ]; then
    echo "📝 Création du fichier frontend/.env..."
    cat > "$SCRIPT_DIR/frontend/.env" << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
EOF
fi

# Démarrer le Backend
echo "🔧 Démarrage du Backend..."
cd "$SCRIPT_DIR/backend"

# Créer l'environnement virtuel s'il n'existe pas
if [ ! -d "venv" ]; then
    echo "   Création de l'environnement virtuel Python..."
    python3 -m venv venv
fi

# Activer l'environnement virtuel et installer les dépendances
source venv/bin/activate

# Vérifier si les dépendances sont installées
if ! pip show fastapi &> /dev/null; then
    echo "   Installation des dépendances Python..."
    pip install -r requirements.txt --quiet
fi

# Démarrer le serveur backend en arrière-plan
uvicorn server:app --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!
echo -e "   ${GREEN}✓${NC} Backend démarré (PID: $BACKEND_PID)"

sleep 3

# Démarrer le Frontend
echo "🎨 Démarrage du Frontend..."
cd "$SCRIPT_DIR/frontend"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "   Installation des dépendances JavaScript..."
    yarn install --silent
fi

# Démarrer le serveur frontend en arrière-plan
yarn start &
FRONTEND_PID=$!
echo -e "   ${GREEN}✓${NC} Frontend démarré (PID: $FRONTEND_PID)"

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 PortfolioHub est prêt !${NC}"
echo "=========================================="
echo ""
echo "📱 Application : http://localhost:3000"
echo "🔌 API Backend : http://localhost:8001/api"
echo ""
echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter l'application${NC}"
echo ""

# Attendre que l'utilisateur arrête
wait
