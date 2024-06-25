#!/usr/bin/env bash

set -o errexit

# Download Chrome
if [[ ! -d /opt/render/project/.render/chrome ]]; then
  echo "...Downloading Chrome"
  mkdir -p /opt/render/project/.render/chrome
  cd /opt/render/project/.render/chrome
  wget -P ./ https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  dpkg -x ./google-chrome-stable_current_amd64.deb .
  rm ./google-chrome-stable_current_amd64.deb
  cd $HOME/project/src
else
  echo "...Using Chrome from cache"
fi

export PATH="${PATH}:/opt/render/project/.render/chrome/opt/google/chrome"
echo "Current PATH: $PATH"

# Install Python libraries (replace with your actual requirements)
# pip install -r requirements.txt