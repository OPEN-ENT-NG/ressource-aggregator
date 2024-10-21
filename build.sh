#!/bin/bash

# Options
NO_DOCKER=""
for i in "$@"
do
case $i in
  --no-docker*)
  NO_DOCKER="true"
  shift
  ;;
  *)
  ;;
esac
done

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <clean|install|copyFrontFiles>"
  echo "Example: $0 clean"
  echo "Example: $0 install"
  echo "Example: $0 copyFrontFiles"
  echo "Example: $0 [--springboard=recette] watch"
  exit 1
fi

if [ -z ${USER_UID:+x} ]
then
  export USER_UID=1000
  export GROUP_GID=1000
fi

# options
SPRINGBOARD="recette"
for i in "$@"
do
case $i in
    -s=*|--springboard=*)
    SPRINGBOARD="${i#*=}"
    shift
    ;;
    *)
    ;;
esac
done

clean () {
  cd frontend
  ./build.sh clean
  cd ../backend
  ./build.sh clean
  cd ..
}

install() {
  cd frontend && ./build.sh installDeps build
  cd ..
  cd backend && ./build.sh clean build
  cd ..
  copyFrontFiles
  clean
}

copyFrontFiles() {
  echo -e '\n--------------------'
  echo 'Copy front files built'
  echo '----------------------'
  cd backend
  cp -R ../frontend/dist/* ./src/main/resources

  # Create view directory and copy HTML files into Backend
  mkdir -p ./src/main/resources/view
  mkdir -p ./src/main/resources/public/template
  mv ./src/main/resources/*.html ./src/main/resources/view
  cp -R ./src/main/resources/view-src/notify/ ./src/main/resources/view/

  # Copy all public files from frontend into Backend
  cp -R ../frontend/public/* ./src/main/resources/public
  cd ..
}

for param in "$@"
do
  case $param in
    clean)
      clean
      ;;
    copyFrontFiles)
      copyFrontFiles
      ;;
    install)
      install
      ;;
    *)
      echo "Invalid argument : $param"
  esac
  if [ ! $? -eq 0 ]; then
    exit 1
  fi
done