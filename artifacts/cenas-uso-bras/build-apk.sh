#!/bin/bash

echo ""
echo "=========================================="
echo "  Gerador de APK - Cenas de Uso Brás"
echo "=========================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em: https://nodejs.org"
    exit 1
fi

# Check if eas-cli is installed, install if not
if ! command -v eas &> /dev/null; then
    echo "📦 Instalando EAS CLI..."
    npm install -g eas-cli
fi

# Install dependencies
echo "📦 Instalando dependências do app..."
npm install

echo ""
echo "🔐 Fazendo login na sua conta Expo..."
echo "   (Crie uma conta grátis em https://expo.dev se ainda não tiver)"
echo ""
eas login

echo ""
echo "🔨 Iniciando build do APK..."
echo "   Aguarde 10-20 minutos..."
echo ""
eas build --platform android --profile preview --non-interactive

echo ""
echo "✅ Pronto! Use o link acima para baixar o APK no celular."
echo "   No celular: Abra o link, baixe e instale o APK."
echo ""
