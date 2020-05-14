# Updates local repo and then builds

git stash # Store user changes
git pull
git stash pop 

yarn deploy
