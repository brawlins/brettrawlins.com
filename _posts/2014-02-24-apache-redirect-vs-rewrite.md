---
layout: post
title:  "Apache redirect vs. rewrite"
date:   2014-02-24 15:58:02 -0600
tags:
    - apache
---

Apache rewrite rules can be very confusing at times. They're very powerful, but not easily understood or mastered. I don't claim to be an expert by any means, but I recently came to some clarity on this issue: 


## Redirect

A redirect is a server response that tells the client to make a new, modified request. The dialog goes something like this:


Because a second request is made, now for a different resource, the URL obviously changes in the browser's address bar. The user is aware that his original request has been redirected to something different than what he typed.

The redirect rule in your .htaccess file would look like this:


You can send whatever response code is appropriate. If you don't give one, a 302 response will be sent, which is the default for a redirect. See the [list of HTTP status codes](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes#3xx_Redirection){:target="_blank"} for more information.

##  Rewrite

A rewrite maps the requested path to some different path on the server, based on whatever rewrite rules are defined. The server does this without notifying the client, and then serves up the content from the new path. It goes something like this:


The original request was fulfilled by **substituting a different path** for the one that was requested. The client is unaware that the content being served came from `/otherpage.php` because the URL remains unchanged in the address bar.

The rewrite rule in your .htaccess file would look like this:


Rewriting is often used to map pretty URLs (that make sense to the user) to uglier ones on the server that actually retrieve the content. Using this technique you can take a request for something like `/shoes/heels/red` and map it to a script that serves the correct content based on query string variables, such as `/products.php?product=shoes&amp;type=heels&amp;color=red`. You probably don't want the user to be redirected to that ugly URL, so you just rewrite it to whatever it needs to be on the server side and serve up the contents. Nobody needs to know what's going on behind the scenes.

However, if you DO want the user to be redirected to the new path, you can force a redirect by using the [R] flag after your rule:


Usually you want to stop rewriting at this point, so you should also include the [L] flag to make this the last rule that gets evaluated. Otherwise, any rewrite rules that follow this one will also be applied before the redirect happens, which could result in the user being redirected to the wrong place.

## Examples of redirects

This rule will redirect all requests to another site:


This one redirects from one directory to another directory:


Here `$1` is a back-reference to the portion of the pattern in parentheses. So anything beyond the directory will remain the same.
