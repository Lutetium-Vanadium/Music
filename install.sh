# For a linux based system
# Builds the project and then adds a .desktop file to the Desktop

DIR=`pwd`

if [ ! -f "$DIR/app/main/apiKeys.ts" ]
then
  echo "Setting up api keys..."
  read -p "Napsters Api key: " napster
  read -p "Google's Youtube Data Api key: " google
  echo

  echo "export const NAPSTER_API_KEY = \"$napster\"
export const GOOGLE_API_KEY = \"$google\"" > ./app/main/apiKeys.ts
fi

if [ ! -d "$DIR/node_modules" ]
then
  echo "Installing dependencies..."
  echo
  yarn
fi

music_version=$(cat package.json | grep -ohE "\"version\": \"[0-9]\\.[0-9]\\.[0-9]\"" | grep -ohE "[0-9]+\\.[0-9]+\\.[0-9]+")

echo "Building Music..."
yarn deploy

echo 
echo "Installing Desktop Entry..."

# Check if pacman is an installed package
if hash pacman 2>/dev/null
then
  echo "Using pacman"
  echo
  sudo pacman -U "release/Music-$music_version.pacman"

  temp=`cat /usr/share/applications/music.desktop`
  echo "${temp/Icon=music/Icon=$DIR/resources/icon.png}" | sudo tee /usr/share/applications/music.desktop
else  
  echo "Pacman not found"
  echo

  echo "[Desktop Entry]
  Name=Music
  Exec=$DIR/release/Music-$music_version.AppImage
  Icon=$DIR/resources/logo.png
  Terminal=false
  Type=Application
  Categories=Utilities
  StartupNotify=true
  Encoding=UTF-8;" | sudo tee /usr/share/applications/Music.desktop
fi
