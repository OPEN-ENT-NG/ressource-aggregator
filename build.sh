#!/bin/bash

cleanBackend() {
  echo -e '\n------------------'
  echo 'Clean before build'
  echo '------------------'
  cd backend || exit 1
  rm -rf ./.gradle
  rm -rf ./build
  rm -rf ./gradle
  rm -rf ./src/main/resources/public
#  rm -rf ./src/main/resources/view
  echo 'Frontend cleaned !'
  cd .. || exit 1
}

buildFrontend() {
  echo -e '\n--------------'
  echo 'Build Frontend'
  echo '--------------'
  cd frontend || exit 1
  ./build.sh installDeps build
  cd .. || exit 1
}

copyFrontFile() {
  echo -e '\n--------------------'
  echo 'Copy front files built'
  echo '----------------------'
  cd backend || exit 1
  rm -rf ./src/main/resources/public
  cp -R ../frontend/dist/* ./src/main/resources
  rm -rf ./src/main/resources/img
  echo 'Frontend files copied !'
  cd .. || exit 1
}

buildBackend() {
  echo -e '\n-------------'
  echo 'Build Backend'
  echo '-------------'
  cd backend || exit 1

  # Move and copy files as needed
  mv ./src/main/resources/*.html ./src/main/resources/view

  ./build.sh clean build
  cd .. || exit 1
}

cleanFrontendArtefacts() {
  echo -e '\n-------------------'
  echo 'Clean front folders'
  echo '-------------------'
  rm -rf ./frontend/dist
  echo 'Frontend artefact cleaned !'
}

install() {
  cleanBackend
  buildFrontend
  copyFrontFile
  buildBackend
  cleanFrontendArtefacts
  echo -e '\nInstall finished !\n\n'
}

for param in "$@"
do
  case $param in
    copyFrontFile)
      copyFrontFile
      ;;
    install)
      install
      ;;
    cleanBackend)
      cleanBackend
      ;;
    buildFrontend)
      buildFrontend
      ;;
    buildBackend)
      buildBackend
      ;;
    cleanFrontendArtefacts)
      cleanFrontendArtefacts
      ;;
    *)
      echo "Invalid argument : $param"
  esac
  if [ ! $? -eq 0 ]; then
    exit 1
  fi
done