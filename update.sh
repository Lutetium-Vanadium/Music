# Updates local repo and then builds

echo "Updating local repository..."

git stash # Store user changes
git pull
git stash pop 

echo "Building local repository..."

yarn deploy

read -p "App Updated. Do you wish to view changelog? [y/n]  " showupdate

if [ $showupdate = "y" ]
then
  $BROWSER ./changelog.html
fi
