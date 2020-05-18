---
layout: post
title:  Where to put your custom WordPress functions
date:   2013-08-09 16:58:22 -0600
tags:
    - wordpress
---

I found a great WordPress tip while reading some articles today. Often when you're trying to solve a problem you'll find code snippets in a tutorial or blog post somewhere, and they usually tell you to paste the code into your theme's `functions.php` file. While that works for the time being, it's probably not the best idea because as soon as you change your theme you'll lose that functionality too.

A better idea is to write your own plugin that holds any custom functionality that is specific to your site and that also needs to be independent of whatever theme you choose. This goes by various names such as a "<a href="http://www.wpbeginner.com/beginners-guide/what-why-and-how-tos-of-creating-a-site-specific-wordpress-plugin/" target="_blank">site-specific plugin</a>", "<a href="http://wpcandy.com/teaches/how-to-create-a-functionality-plugin/#.Ug1cwhbGky4" target="_blank">functionality plugin</a>", or "<a href="http://justintadlock.com/archives/2011/02/02/creating-a-custom-functions-plugin-for-end-users" target="_blank">custom functions plugin</a>". The above links provide a good walk-through on how to write your plugin.

Credit to Justin Tadlock for the additional tip of making it a "<a href="http://justintadlock.com/archives/2011/02/02/creating-a-custom-functions-plugin-for-end-users" target="_blank">must-use plugin</a>". Must-use plugins are automatically loaded so they don't have to be activated/deactivated. It's as simple as putting it in a new subfolder at `wp-content/mu-plugins` instead of `wp-content/plugins`.
