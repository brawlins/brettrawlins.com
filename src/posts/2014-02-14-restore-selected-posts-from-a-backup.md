---
layout: post
title:  "Restore selected posts from a backup"
date:   2014-02-14 12:02:45 -0600
tags:
    - mysql
    - wordpress
---

Recently at work we had a situation where we needed to roll back to the previous day's backup of our WordPress site to undo some changes that went awry. However, since posts had been added and modified since that time, we also needed to restore those posts (and associated meta records) after we rolled back. Here's one way to do that.

## 1. Clone the database in its current state

First of all, we need to clone the database in its current state so that we don't lose any work that was done since yesterday's backup. Then later we can compare this clone to yesterday's backup to determine which posts to re-import.

Create an empty database for the clone:

```sql
CREATE DATABASE my_database_clone;
```

Then export your current database and import it into the clone:

```shell
mysqldump -u username -p my_database > my_database_clone.sql
mysql -u username -p my_database_clone < my_database_clone.sql
```

##  2. Roll back to a previous backup

Locate yesterday's backup file (or whatever point you want to roll back to), and import it into your database:

```shell
mysql -u username -p my_database < previous_backup.sql
```

##  3. Identify the posts to restore

Write a query to identify the posts you want to restore from the clone. In this example I'm selecting anything modified after the date I rolled back to:

```sql
SELECT *
FROM my_database_clone.wp_posts
WHERE post_modified >= '2014-02-10'
ORDER BY post_modified DESC
```

Adjust your query as needed to select just the posts you want.

## 4. Insert them from the clone

Now, using that query, we'll re-insert them from the clone into our database.

```sql
INSERT IGNORE INTO my_database.wp_posts
SELECT *
FROM my_database_clone.wp_posts
WHERE post_modified >= '2014-02-10'
ORDER BY post_modified DESC
```

The `IGNORE` keyword suppresses any duplicate-key errors that would cause the statement to abort. See the documentation on <a href="http://dev.mysql.com/doc/refman/5.6/en/insert.html" target="_blank">INSERT Syntax</a> for details.

## 5. Get associated meta records too

We're almost there. Now we have the posts that were modified since the rollback, but we also need to get the associated post meta records. First select them to make sure we know what we'll be inserting. Here I'm selecting everything from both tables, so I can see which posts I'm dealing with:

```sql
SELECT *
FROM my_database_clone.wp_postmeta m
INNER JOIN my_database_clone.wp_posts p ON p.ID = m.post_id
WHERE post_modified >= '2014-02-10'
ORDER BY post_id, meta_id
```

Now just add the `INSERT` statement and select only from the postmeta table to insert them:

```sql
SELECT *
FROM my_database_clone.wp_postmeta m
INNER JOIN my_database_clone.wp_posts p ON p.ID = m.post_id
WHERE post_modified >= '2014-02-10'
ORDER BY post_id, meta_id
```

That should do it.
