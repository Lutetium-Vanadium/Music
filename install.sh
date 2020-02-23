echo "Building Music..."

yarn deploy

DIR=`pwd`

echo "[Desktop Entry]
Name=Music
Exec=$DIR/Music-linux-x64/Music
Icon=$DIR/app/src/logos/logo.png
Terminal=false
Type=Application
Categories=Utilities
StartupNotify=true
Encoding=UTF-8;
" > "$HOME/Desktop/Music.desktop"