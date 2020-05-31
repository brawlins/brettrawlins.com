---
title:  Passing checkbox (boolean) values in ajax
date:   2013-05-28
tags:
    - ajax
    - javascript
    - php
---

## Problem:

I was reminded today that JavaScript boolean values don't translate well to PHP. Here's an example.

Say you have a form with a checkbox and you're submitting it via ajax to a PHP script. Using jQuery you can easily retrieve the value of the checkbox in your form:

```javascript
var checked = $('[name="my_checkbox"]').is(':checked');
```

This returns either true or false, which works fine in JavaScript. However, when you send that over to PHP, it evaluates to a literal string ("true" or "false") rather than a boolean value. That breaks things on the PHP side because now when you check for the value in PHP...

```php
<?php
if (!empty($_POST['my_checkbox'])) {...}
```

... it always returns TRUE, even when it's "false"! (The literal string "false" is not empty).

## Solution:

You can either check for those strings on the PHP side:

```php
<?php
if (isset($_POST['my_checkbox']) && $_POST['my_checkbox'] == 'true') {...}
```

Or, even better, you can convert it to a PHP-friendly value on the JavaScript side:

```javascript
var checked = ($('[name="my_checkbox"]').is(':checked')) ? 1 : 0;
```

Yeah. That's mo' betta.
