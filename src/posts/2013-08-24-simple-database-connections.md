---
layout: post
title:  Simple Database Connections
date:   2013-08-24 16:32:25 -0600
tags:
    - mysql
    - php
---

The other day I had to explain to someone how to connect to a MySQL database in PHP. It was a good reminder. Here's a simple example using two different API's.

## 1. Mysqli

The old MySQL extension is deprecated in favor of the <a href="http://php.net/manual/en/book.mysqli.php" target="_blank">MySQL Improved Extension</a>. This extension offers an object-oriented interface, but you can also use the procedural style like its predecessor. Mysqli also includes some more advanced features like prepared statements and stored procedures.

```php
<?php
// connect to the database
$mysqli = new mysqli('localhost', 'user', 'password', 'database');

// make sure it worked
if ($mysqli->connect_error) {
    die('Connection error: ' . $mysqli->connect_error);
}

// run a query
$sql = 'SELECT * FROM my_table';
$result = $mysqli->query($sql);

// loop through the rows
while ($row = $result->fetch_assoc()) {
    // do something with $row
}

// close the connection
$result->free();
$mysqli->close();
```

## 2. PDO

PDO stands for <a href="http://www.php.net/manual/en/book.pdo.php" target="_blank">PHP Data Objects</a> which is the latest and greatest data-access API. It includes drivers for many different databases (not just MySQL), so it's very portable. Although really, when was the last time you switched database systems? Probably never. PDO uses an object-oriented interface and also supports advanced features like prepared statements and stored procedures.

```php
<?php
// connect to the database
try {
    $pdo = new PDO('mysql:host=localhost;dbname=database', 'user', 'password');
} catch (PDOException $e) {
    die($e->getMessage());
}

// run a query
$sql = 'SELECT * FROM my_table';
$result = $pdo->query($sql, PDO::FETCH_ASSOC);

// loop through the rows
foreach ($result as $row) {
    // do something with $row
}

// close the connection
$pdo = null;
```

Of course there's a lot more you can do with either API, but that's a quick and dirty example :).
