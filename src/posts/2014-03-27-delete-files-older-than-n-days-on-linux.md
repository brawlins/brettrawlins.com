---
layout: post
title:  "Delete files older than N days on Linux"
date:   2014-03-27 15:58:26 -0600
tags:
    - command line
---


Today I needed to delete a bunch of old log files to clear up some room on our server. Here’s a handy shortcut that I found to delete any files that are older than a given number of days old.

First you’ll want to run this command to make sure you’re selecting just the files you want. It’s best to use the full path so there’s no mistake!

```shell
sudo find /path/to/dir -type f -mtime +7
```

Once you’re sure you want to proceed, you can add the delete option to the end like this:

```shell
sudo find /path/to/dir -type f -mtime +7 -delete
```

Here’s an explanation of each part:

* `sudo`  – Perform the action as if you were root (avoids permission denied errors)
* `find /path/to/dir`  – Find files in this directory
* `-type f`  – Only get files of type “file” (excludes directories)
* `-mtime +7`  – Only get files whose timestamp is greater than 7 days old
* `-delete`  – Delete all the matched files