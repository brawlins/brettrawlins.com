---
title:  Setting up dynamic virtual hosts on your Mac
date:   2013-04-02
tags:
    - apache
    - mac
---

In the past I've always had to make two entries for every new site I add to my local development environment:

1. a line in my hosts file (so the site gets served locally)
2. a VirtualHost directive in my vhosts file (to tell apache where to find the web files)

This quickly becomes unsustainable. How would it be if I could just add a new folder to my apache web root and immediately load the new site in my browser? The following setup (adapted from <a href="http://www.glenscott.co.uk/blog/2012/11/10/simple-development-hosts-on-mac/" target="_blank">Glen Scott</a>) makes that possible!

This setup uses the subdomain "local" for all locally developed sites. So if I'm working on a site called "blah.com", my local version would be at "local.blah.com". Here's how you do it:

## 1. Edit your httpd.conf file

You need to enable two things to make this work:

1. mod_vhost_alias
2. httpd-vhosts.conf

Find the lines with these directives and uncomment them (your paths may differ):

```apacheconf
#LoadModule vhost_alias_module libexec/apache2/mod_vhost_alias.so
...
#Include /private/etc/apache2/extra/httpd-vhosts.conf
```

## 2. Edit your httpd-vhosts.conf file

Paste in this block (adjust the path to your apache web root as necessary):

```apacheconf
# This uses the requested hostname to map the file path to the web documents to
# be served. I don't want to have to use the "local" subdomain prefix on all my
# website folders, so the VirtualDocumentRoot will start at the second dot-
# section of the hostname and use everything from that point forward. So a
# request to "local.domain.com" will be served from the folder "domain.com" in
# my apache web root.
<VirtualHost *:80>
    ServerName local.*
    ServerAlias local.*
    UseCanonicalName Off
    VirtualDocumentRoot "~/Sites/%2+"
    <Directory "~/Sites/%2+">
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        RewriteEngine on
    </Directory>
</VirtualHost>
```

## 3. Fix your DOCUMENT_ROOT

One side-effect of using `mod_vhost_alias` is that your `DOCUMENT_ROOT` defaults to the apache web root, not the document root of the virtual host being served. So if you use the PHP global `$_SERVER['DOCUMENT_ROOT']` in your code, it will contain the wrong value. To fix this problem, we'll tell PHP to require a file that correctly defines our document root before running any PHP scripts.

Create the following file and save it somewhere that makes sense to you. For example at: `~/Sites/_config/set-doc-root.php`.

```php
<?php
/**
 * Sets the correct DOCUMENT_ROOT value for php
 *
 * Using the apache module mod_vhost_alias to map the path to virtual host
 * document roots has the unfortunate side-effect that the PHP global variable
 * $_SERVER['DOCUMENT_ROOT'] is not set correctly. It defaults to your apache
 * web root, not the document root of the virtual host being served. This
 * script should fix that problem.
 *
 * USAGE:
 * In your php.ini file, add the path to this script in the
 * "auto_prepend_file" directive. Then it will be prepended to every PHP
 * script that runs.
 *
 * NOTE: The file must exist and be readable by apache or else you get a fatal
 * error because it gets included as if called by require().
 */

$_SERVER['DOCUMENT_ROOT'] = str_replace($_SERVER['SCRIPT_NAME'], '', $_SERVER['SCRIPT_FILENAME']);
```

## 4. Create a PAC file

We need to make sure that any requests with the "local" subdomain ("local.anything") get routed to our local apache server. To do this we'll use a proxy auto-configuration (PAC) file.

Create the following PAC file:

```javascript
function FindProxyForURL(url, host)
{
    // if the host is "localhost" or starts with "local.", then serve it locally
    if (host == "localhost" || shExpMatch(host, "local.*")) {
       return "PROXY localhost";
    }
    // otherwise go to the internet
    return "DIRECT";
}
```

Save the file with a ".pac" extension somewhere in your apache web root (it must be accesible to apache). For example at: `~/Sites/_config/local.pac`.

## 5. Tell apache to use your PAC file

Now we need to adjust our System Preferences in OS X to tell apache to use our proxy auto-configuration file.

1. Go to System Preferences &gt; Network.
2. Select your network in the left-hand pane and click the "Advanced" button in the lower-right.
3. Click the "Proxies" tab and check "Automatic Proxy Configuration".
4. In the "URL" field enter the URL to your PAC file from above. For example: "http://localhost/\_config/local.pac"

Now resart apache to apply the settings.

```shell
sudo apachectl restart
```

## 6. Test it

Now you should be able to add a folder to your apache web root and immediately see it in your browser. Try it out!

```shell
mkdir -p ~/Sites/newdomain.com
echo 'Hello World!' > ~/Sites/newdomain.com/index.html
```

Now visit <a href="http://local.newdomain.com/" target="_blank">http://local.newdomain.com/</a> in your browser and you should see "Hello World!".

That's it!
