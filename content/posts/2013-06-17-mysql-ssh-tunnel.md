---
title:  MySQL SSH tunnel
date:   2013-06-17
tags:
    - shell
    - mysql
    - php
---

If your MySQL server is configured to only accept local connections, then you can't connect remotely by just specifying the hostname in your database connection. One work around is to create an SSH tunnel to the server so it looks like the connection is local. Here's how you can connect to a remote database from a local script:

## 1. Forward a local port to the server:

```shell
ssh -L 3377:localhost:3306 user@host
```

Now you have an SSH tunnel to the server. As long as your connection remains active, all traffic on local port 3377 (or whatever port number you chose) will be forwarded to the server on port 3306.

## 2. Use the forwarded port in your database connection:

```php
<?php
// mysqli
$db = new mysqli('localhost:3377', 'user', 'password', 'database');

// pdo
$db = new PDO('mysql:host=localhost:3377;dbname=database', 'user', 'password');
```

That's it! Now you can query the database on the remote server from your local script.
