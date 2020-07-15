# Updates local repo and then builds

echo "Updating local repository..."

prevPackageJSON=`cat package.json`
prevAppPackageJSON=`cat app/package.json`

if [[ `git status` == *"nothing to commit"* ]]
then
  git pull
else
  git stash # Store user changes
  git pull
  git stash pop 
fi

node updatePackages.js "$prebPackageJSON" "$prevAppPackageJSON"

./install.sh

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
