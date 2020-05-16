---
layout: post
title:  The right way to do an ajax post in Wordpress
date:   2013-11-16 15:47:24 -0600
tags:
    - ajax
    - wordpress
---

For a long time making ajax calls in Wordpress was very confusing to me. After reading the [Codex](http://codex.wordpress.org/AJAX_in_Plugins){:target="_blank"} and several articles about it, I think I understand it a little better now. When you stop fighting Wordpress and do it the "Wordpress way" it's not too bad. Here's a little plugin that demonstrates how to do an ajax post from the front end the right way.

My plugin has two files. The folder looks like this:

```shell
.
└── My_Ajax
    ├── My_Ajax.php
    └── js
        └── my-ajax-request.js
```

## First the code:

**My_Ajax.php**

```php
/**
 * Plugin Name: My Ajax
 * Description: Testing ajax calls in Wordpress
 * Author: Brett Rawlins
 */

// instantiate it
$My_Ajax = new My_Ajax();

class My_Ajax
{
    public function __construct()
    {
        // get scripts ready
        add_action('init', array($this, 'prepare_scripts'));

        // connect your ajax handler to the custom action hook for your action
        add_action('wp_ajax_my_frontend_action', array($this, 'frontend_ajax_handler'));
        add_action('wp_ajax_nopriv_my_frontend_action', array($this, 'frontend_ajax_handler'));
    }

    public function prepare_scripts()
    {
        // enqueue script
        wp_enqueue_script('my-ajax-request', plugins_url('js/my-ajax-request.js', __FILE__), array('jquery'));

        // localize it (define ajax object for your variables)
        wp_localize_script('my-ajax-request', 'MyAjaxObject', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('my-frontend-action-nonce'),
        ));
    }

    public function frontend_ajax_handler()
    {
        global $wpdb;
        // now you can access the database

        // make sure the request is legit
        if (!wp_verify_nonce($_POST['nonce'], 'my-frontend-action-nonce')) {
            exit; 
        }

        // print out the POST array
        print_r($_POST);
        exit; 
    }
}
```

**my-ajax-request.js**

```javascript
// my-ajax-request.js
jQuery(document).ready(function($) {
    $('.my-form').submit(function() {
        // get form data
        var data = $('.my-form').serialize();
        // add my action (for ajax routing)
        data += '&action=' + 'my_frontend_action';
        // add nonce (for verification)
        data += '&nonce=' + MyAjaxObject.nonce;
        // post it
        $.post(MyAjaxObject.ajax_url, data, function(response) {
            console.log(response);
        });
        return false;
    }); 
});
```

## Now let's walk through it.

Wordpress has a built-in ajax handler located at `/wp-admin/admin-ajax.php`. This is set up so that you can post to that file and pass a custom "action" variable in your `$_POST` array. The important part of that file looks like this:

```php
if ( is_user_logged_in() )
    do_action( 'wp_ajax_' . $_REQUEST['action'] ); // Authenticated actions
else
    do_action( 'wp_ajax_nopriv_' . $_REQUEST['action'] ); // Non-admin actions
```

This code makes two custom action hooks available to you: one for logged-in users and one for regular users. The action hooks are named after the action you provided. So if my action is "do_cool_stuff", then the corresponding action hooks are called "wp_ajax_do_cool_stuff" and "wp_ajax_nopriv_do_cool_stuff".

The `do_action()` call here invokes all functions attached to that action hook. So now all we have to do is write a function (which will be our own custom ajax handler for this call), and then attach it to this action hook. We do that like so:

```php
// connect your ajax handler to the custom action hook for your action
add_action('wp_ajax_my_frontend_action', array($this, 'frontend_ajax_handler'));
add_action('wp_ajax_nopriv_my_frontend_action', array($this, 'frontend_ajax_handler'));
```

My ajax handler function doesn't actually do much. It simply verifies the nonce to make sure the request is coming from the right place, and then prints out the the posted variables:

```php
public function frontend_ajax_handler()
{
    global $wpdb;
    // now you can access the database

    // make sure the request is legit
    if (!wp_verify_nonce($_POST['nonce'], 'my-frontend-action-nonce')) {
        exit; 
    }

    // print out the POST array
    print_r($_POST);
    exit; 
}
```

You could do whatever you want here. One important thing to note is that you have to call `exit()` or `die()` here after you echo whatever you want to return to the calling javascript function. Otherwise `admin-ajax.php` will echo a 0 or 1 which gets added to the end of your response text, and that could possibly break stuff on the other end.

Since we put our javascript in a separate file, we want to enqueue that script so that it loads on the page where we need to call it. We can also define a global ajax object that we can use to pass variables around with. This is a little cleaner than having to echo out variables wrapped in php tags into our javascript.

First we write a function to prepare our scripts:

```php
public function prepare_scripts()
{
    // enqueue script
    wp_enqueue_script('my-ajax-request', plugins_url('js/my-ajax-request.js', __FILE__), array('jquery'));

    // localize it (define ajax object for your variables)
    wp_localize_script('my-ajax-request', 'MyAjaxObject', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('my-frontend-action-nonce'),
    ));
}
```

Then we attach that function to some action hook that will fire before the page loads:

```php
// get scripts ready
add_action('init', array($this, 'prepare_scripts'));
```

Now all that's left is the javascript which actually makes the ajax call. Here I'm simply grabbing a form and posting its data to my ajax handler. First I serialize the form fields, then I add my action and nonce variables to it, and then I post it. When the response comes back from the handler (which is just the post variables), I log it to the console so we can see that it came back correctly. Then I return false to prevent the page from reloading (the form has no action attribute so by default it will submit to the page it's on which would reload the page).

```javascript
jQuery(document).ready(function($) {
    $('.my-form').submit(function() {
        // get form data
        var data = $('.my-form').serialize();
        // add my action (for ajax routing)
        data += '&action=' + 'my_frontend_action';
        // add nonce (for verification)
        data += '&nonce=' + MyAjaxObject.nonce;
        // post it
        $.post(MyAjaxObject.ajax_url, data, function(response) {
            console.log(response);
        });
        return false;
    }); 
});
```

That's it! Hopefully that helps clarify the process a little. Here's some other good reading on the subject of using ajax in Wordpress:

* [5 tips for using AJAX in WordPress](http://www.garyc40.com/2010/03/5-tips-for-using-ajax-in-wordpress/){:target="_blank"}
* [How To Use AJAX In WordPress](http://wp.smashingmagazine.com/2011/10/18/how-to-use-ajax-in-wordpress/){:target="_blank"}
