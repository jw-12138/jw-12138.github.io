for i in *.mp3;
  do name=`echo "$i" | cut -d'.' -f1`
  echo "$name"
  ffmpeg -y -i "$i" -filter_complex "showwavespic=s=1800x60:colors=#999999" -frames:v 1  "${name}.png"
done