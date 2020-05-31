---
title:  Trigger onSelect from today button in Datepicker
date:   2014-02-06
tags:
    - javascript
    - jquery
---

The <a href="http://jqueryui.com/datepicker" target="_blank">jQuery UI Datepicker</a> widget is a handy way to add a calendar control to a web page. It's pretty easy to implement and offers a lot of flexibility in terms of customization.

By setting the `showButtonPanel` option to true, you get a button that takes you to today's date. However, this button functions a little differently than I expected. I thought it would select today's date in the calendar as if you had clicked on it, but it doesn't. It simply moves the calendar back to the current month (if you have navigated away from it) so that you can see the current date which is highlighted by default.

Recently I used the Datepicker in a WordPress widget I was building to display calendar items from our Exchange calendar.  I wanted the today button to fetch calendar items for the current date, so I needed it to fire the `onSelect` method on that date, as if you had clicked it in the calendar. Here's how you can make that happen:

```javascript
jQuery(document).ready(function($) {
    // get datepicker element
    var datepicker = $('.my-datepicker');
    // set up your options
    datepicker.datepicker({
        showButtonPanel: true,
        onSelect: function (date) {
            // code here
            // e.g. get calendar items for selected date
        }
    });
    // add click event to today button
    $('.ui-datepicker-current').live('click', function() {
        // set date to today and trigger the click event
        datepicker.datepicker('setDate', new Date());
        $('.ui-datepicker-current-day').click();
    });
    // trigger today button on initial page load
    $('.ui-datepicker-current').trigger('click');
});
```
