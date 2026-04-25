#!/bin/bash
set -euo pipefail

video_folder="../video"

today=$(date +%F)
echo "$today"

audio_folder="../temp-audio/${today}"
mkdir -p "$audio_folder"

op_folder="../opfiles/${today}"
mkdir -p "$op_folder"

stock_audio_folder="../stock-music" 

shopt -s nullglob
for f in "${video_folder}"/*.mp4
do
  echo "Processing $f..."

  file_size_total=$(ffprobe -i "$f" -show_entries format=duration -v quiet -of csv="p=0")
  file_size=$(printf %.0f "$file_size_total")

  complete_file_name=$(basename "$f")
  file_name="${complete_file_name%.*}"

  audio_file=$(ls "$stock_audio_folder" | sort -R | tail -1)
  audio_file_old_path="${stock_audio_folder}/${audio_file}"
  audio_file_new_path="${audio_folder}/${file_name}.mp3"

  echo "$audio_file_new_path"
  ffmpeg -y -ss 0 -i "$audio_file_old_path" -t "$file_size" -c copy "$audio_file_new_path"

  output_file_name="${op_folder}/${complete_file_name}"
  ffmpeg -y -i "$f" -i "$audio_file_new_path" -map 0:0 -map 1:0 "$output_file_name"

  echo "$file_size"
done

