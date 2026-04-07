#!/bin/bash

# If DEBUG env var is set to "true" then set -x to enable debug mode
if [ "$DEBUG" == "true" ]; then
	set -x
	EDIFICE_CLI_DEBUG_OPTION="--debug"
else
	EDIFICE_CLI_DEBUG_OPTION=""
fi

init() {
  me=`id -u`:`id -g`
  echo "DEFAULT_DOCKER_USER=$me" > .env

  # If CLI_VERSION is empty set to latest
  if [ -z "$CLI_VERSION" ]; then
    CLI_VERSION="latest"
  fi
  # Create a build.compose.yaml file from following template
  cat <<EOF > build.compose.yaml
services:
  edifice-cli:
    image: opendigitaleducation/edifice-cli:$CLI_VERSION
    user: "$DEFAULT_DOCKER_USER"
EOF
  # Copy /root/edifice from edifice-cli container to host machine
  docker compose -f build.compose.yaml create edifice-cli
  docker compose -f build.compose.yaml cp edifice-cli:/root/edifice ./edifice
  docker compose -f build.compose.yaml rm -fsv edifice-cli
  rm -f build.compose.yaml
  chmod +x edifice
  ./edifice version $EDIFICE_CLI_DEBUG_OPTION
}

# If called without arguments, run the full local build
if [ "$#" -eq 0 ]; then

# Clean files
echo -e '\n------------------'
echo 'Clean before build'
echo '------------------'
cd backend
rm -rf ./.gradle
rm -rf ./build
rm -rf ./gradle
find ./src/main/resources/public/ -maxdepth 1 -type f -exec rm -f {} +
rm -rf ./src/main/resources/view
echo 'Repo clean for build !'
cd ..

# Frontend
echo -e '\n--------------'
echo 'Build Frontend'
echo '--------------'
cd frontend
#./build.sh --no-docker clean init build
./build.sh installDeps build
cd ..

# Create directory structure and copy frontend dist
echo -e '\n--------------------'
echo 'Copy front files built'
echo '----------------------'
cd backend
cp -R ../frontend/dist/* ./src/main/resources

# Create view directory and copy HTML files into Backend
mkdir -p ./src/main/resources/view
mkdir -p ./src/main/resources/public/template
mkdir -p ./src/main/resources/public/img
mkdir -p ./src/main/resources/public/js
mv ./src/main/resources/*.html ./src/main/resources/view
cp -R ./src/main/resources/view-src/notify/ ./src/main/resources/view/

# Copy all public files from frontend into Backend
cp -R ../frontend/public/* ./src/main/resources/public
echo 'Files all copied !'

# Build .
echo -e '\n-------------'
echo 'Build Backend'
echo '-------------'
#./build.sh --no-docker clean build
./build.sh clean build

# Clean up - remove compiled files in front folders
echo -e '\n-------------'
echo 'Clean front folders'
echo '-------------'
rm -rf ../frontend/dist
echo 'Folders cleaned !'
  exit 0
fi

if [ ! -e .env ]; then
  init
fi

for param in "$@"
do
  case $param in
    init)
      init
      ;;
    *)
      echo "Invalid argument : $param"
  esac
  if [ ! $? -eq 0 ]; then
    exit 1
  fi
done
