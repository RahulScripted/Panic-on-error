#!/bin/bash

# This script downloads a funny "fah" meme sound
# You can replace this URL with your own sound file

echo "Downloading meme sound..."

# Using a free sound effect (you can replace with your own)
# This is a placeholder - you should add your own sound file
curl -L "https://www.myinstants.com/media/sounds/vine-boom.mp3" -o sounds/fah.mp3 2>/dev/null || \
wget "https://www.myinstants.com/media/sounds/vine-boom.mp3" -O sounds/fah.mp3 2>/dev/null || \
echo "Please manually add a sound file named 'fah.mp3' to the 'sounds' folder"

echo "Done! If download failed, please add your own fah.mp3 file to the sounds folder"
