export PORT=80
export NODE_ENV=production
LOG=/home/ec2-user/logs
forever start -a -l $LOG/forever.log -o $LOG/out.log -e $LOG/err.log /home/ec2-user/how2read/app.js
#node /home/ec2-user/how2read/app.js &
