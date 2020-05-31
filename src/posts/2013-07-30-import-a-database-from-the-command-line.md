---
title:  Import a database from the command line
date:   2013-07-30
tags:
    - command line
    - mysql
---

Sometimes you need to import a large database that exceeds the size limits imposed by phpMyAdmin. You can change some settings in your php.ini file to allow that, or you can just do it real quick from the command line. Here's how:

## 1. Export

```shell
mysqldump -u user -p my_database > my_database.sql
```

## 2. Import

```shell
mysql -u user -p my_database < my_database.sql
```
