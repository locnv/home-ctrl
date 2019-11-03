# copy bob.service into /etc/systemd/system/bob.service
$ /etc/systemd/system/bob.service

# To start / stop service
$ sudo systemctl start bob.service
$ sudo systemctl stop bob.service

# View log
$ journalctl -u bob
