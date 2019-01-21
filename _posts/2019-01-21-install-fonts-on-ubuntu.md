---
layout: post
title:  "Install fonts on ubuntu"
date:   2019-01-21 09:00:00 -0600
tags:
    - shell
---

The other day I needed to install some fonts on our ubuntu server that were needed for an email script. Not something you do every day, so I thought I'd make a note of the steps for future reference. 

# 1. See if the font you need is already installed.

To list all the fonts that are installed type:
```
fc-list
```

To find a particular font, you can `grep` that list:
```
fc-list | grep "Arial"
```

If the font is installed, it will show the path to the font file. If not, it will return nothing. 

You can also use `fc-match` to find out what the system will use when trying to match the given font:
```
fc-match Arial
```

# 2. Search for an installable package.

Many fonts are available as `apt` packages on Debian/Ubuntu systems. Packages that contain fonts usually have a name that starts with "fonts-". You can use `apt-cache search [pattern]` to search them. 

To search for all font packages type:
```
apt-cache search ^fonts-
```

Or you could search for just a particular font:
```
apt-cache search Arial
```

If you find one you want, you can simply install it:
```
apt-get install [package-name]
```

# 3. Download the font file and copy it to the server.

If the font you want is not available as a package, you can probably find it on the internet somewhere. A few places that offer free font downloads are:

* [Google Fonts](https://fonts.google.com/)
* [Lost Type](http://www.losttype.com/)
* [Font Squirrel](https://www.fontsquirrel.com/)

The font file will usually have either a `.ttf` (True Type Font) or `.otf` (Open Type Font) file extension. Once you have the font file, just copy it to your server. You'll probably want to put it in the `/usr/local/share/fonts` directory so that it is available for all users:

```
scp -C ~/Downloads/myFont.ttf user@server:/usr/local/share/fonts
```

# 4. Verify that the font is installed.

Now log into your server and verify that the font is installed:
```
fc-match MyFont
```
