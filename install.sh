# For a linux based system
# Builds the project and then adds a .desktop file to the Desktop

DIR=`pwd`

if [[ ! -f "$DIR/.env" ]]
then
  echo "Setting up env variables..."
  read -p "Napsters Api key: " napster
  read -p "Google's Youtube Data Api key: " google
  echo

  echo "NAPSTER_API_KEY = $napster
GOOGLE_API_KEY = $google" > .env
fi

echo "Instaling dependencies..."
cd app
yarn
cd ..
echo "  This will take some time."
yarn

yarn fix-sqlite3

echo
echo "Building Music..."
yarn deploy

echo
echo "Installing Desktop Entry..."

echo "[Desktop Entry]
Name=Music
Exec=$DIR/Music-linux-x64/Music
Icon=$DIR/Music-linux-x64/resources/app/src/logo.png
Terminal=false
Type=Application
Categories=Utilities
StartupNotify=true
Encoding=UTF-8;
" > "$HOME/Desktop/Music.desktop"