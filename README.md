# git

$ git add .  
$ git commit -m 'message'  

If is first time  
$ git remote add origin https://github.com/locnv/home-ctrl.git

$ $ git push -u origin master

cd db-backup dir

$ mongodump -d learn-voca -o ./

$ tar -zcvf learn-voca-db-20190529.tar.gz ./learn-voca/

$ scp -i /Users/locnv/Documents/ec2-free-test learn-voca-db-20190529.tar.gz admin@18.222.53.144:/home/admin/Documents/projects/koa-app/db/learn-voca-db-20190529.tar.gz

--> host
$ tar -zxvf learn-voca-db-20190529.tar.gz


mongodump -d <database_name> -o <directory_backup>

mongorestore -d <database_name> <directory_backup>