# Updates local repo and then builds

DIR=`pwd`

echo "Updating local repository..."

 if [[ `git status` == *"nothing to commit"* ]]
 then
   git pull
 else
   git stash # Store user changes
   git pull
   git stash pop 
 fi

if [ ! -f "$DIR/src/apiKeys.ts" ]
then
  echo "Setting up api keys..."
  read -p "Napsters Api key: " napster
  read -p "Google's Youtube Data Api key: " google
  echo

  echo "export const NAPSTER_API_KEY = \"$napster\";
export const GOOGLE_API_KEY = \"$google\";" > ./src/apiKeys.ts
fi

echo "Building local repository..."

yarn deploy

music_version=$(cat package.json | grep -ohE "\"version\": \"[0-9]\\.[0-9]\\.[0-9]\"" | grep -ohE "[0-9]+\\.[0-9]+\\.[0-9]+")

# Check if pacman is an installed package
if hash pacman 2>/dev/null
then
  echo "Using pacman"
  echo
  sudo pacman -U "release/Music-$music_version.pacman"

  temp=`cat /usr/share/applications/music.desktop`
  echo "${temp/Icon=music/Icon=$DIR/resources/icon.png}" | sudo tee /usr/share/applications/music.desktop
fi

read -p "App Updated. Do you wish to view changelog? [y/n] " showupdate

if [ $showupdate = "y" ] || [ $showupdate = "Y" ]
then
  echo "Opening changelog in browser"
  python -c "import webbrowser; webbrowser.open(\"file://$DIR/changelog.html\")"
  exit
fi

while [ $showupdate != "n" ] && [ $showupdate != "N" ]
do
  echo "Please type only [y/n]"
  read -p "App Updated. Do you wish to view changelog? [y/n] " showupdate

  if [ $showupdate = "y" ] || [ $showupdate = "Y" ]
  then
    echo "Opening changelog in browser"
    python -c "import webbrowser; webbrowser.open(\"file://$DIR/changelog.html\")"
    exit
  fi
done
