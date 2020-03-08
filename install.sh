echo "Building Music..."

# For a linux based system
# Builds the project and then adds a .desktop file to the Desktop

yarn deploy

DIR=`pwd`

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