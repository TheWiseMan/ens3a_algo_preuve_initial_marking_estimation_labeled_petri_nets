tsc --w &
P1=$!
sass ./style/src:./style/css -w &
P2=$!
wait $P1 $P2
