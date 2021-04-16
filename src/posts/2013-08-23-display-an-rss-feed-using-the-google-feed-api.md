---
title:  Display an RSS feed using the Google Feed API
date:   2013-08-23
tags:
    - javascript
---

Some time you may want to grab an RSS feed from another site and display it on yours. Here's how you can do it using the <a href="https://developers.google.com/feed/" target="_blank">Google Feed API</a>.

## 1. Include the Google Loader script

The "recommended" place for this is inside the `<head>` tags of your page, but you can really put it anywhere. It just has to be included before your script in step 3.

```html
<!-- include Google Loader script -->
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
```

##  2. Add a container element for your feed

Put this wherever you want the feed to be displayed. Give it an `id` attribute so you can reference it in your script.

```html
<div id="feed-container"></div>
```

##  3. Add your script

A good place to put this is just before the closing `</body>` tag of your page. You'll want to adjust the URL of the feed and the number of entries to show. You can also completely control the markup that is output. Inside the for loop you can access the properties of each entry with the entry object. See the <a href="https://developers.google.com/feed/v1/devguide#resultJson" target="_blank">documentation on the JSON result</a> format for details.

```html
<script type="text/javascript">
    // load Google Feed API
    google.load("feeds", "1");
    // specify callback function
    google.setOnLoadCallback(showFeed);
    // define function
    function showFeed() {
        // get feed container
        var container = document.getElementById("feed-container");
        // set up feed
        var feed = new google.feeds.Feed("http://feeds.feedburner.com/nettuts");
        feed.setNumEntries(5);
        // load it
        feed.load(function(result) {
            if (!result.error) {
                // add heading
                var heading = document.createElement("h3");
                heading.innerHTML = '<a href="' + result.feed.link + '">' + result.feed.title + '</a>';
                container.appendChild(heading);
                // add entries
                for (var i = 0; i < result.feed.entries.length; i++) {
                    var entry = result.feed.entries[i];
                    var li = document.createElement("li");
                    li.innerHTML = '<a href="' + entry.link + '">' + entry.title + '</a>';
                    container.appendChild(li);
                }
            }
        });
    }
</script>
```

## 4. Here's the output:

<div id="feed-container"></div>
<script type="text/javascript" src="https://www.google.com/jsapi"></script><script type="text/javascript">// <![CDATA[
    // load Google Feed API
    google.load("feeds", "1");
    // specify callback function
    google.setOnLoadCallback(showFeed);
    // define function
    function showFeed() {
        // get feed container
        var container = document.getElementById("feed-container");
        // set up feed
        var feed = new google.feeds.Feed("http://feeds.feedburner.com/nettuts");
        feed.setNumEntries(5);
        // load it
        feed.load(function(result) {
            if (!result.error) {
                // add heading
                var heading = document.createElement("h3");
                heading.innerHTML = '<a href="' + result.feed.link + '">' + result.feed.title + '</a>';
                container.appendChild(heading);
                // add entries
                for (var i = 0; i < result.feed.entries.length; i++) {
                    var entry = result.feed.entries[i];
                    console.log(entry);
                    var li = document.createElement("li");
                    li.innerHTML = '<a href="' + entry.link + '">' + entry.title + '</a>';
                    container.appendChild(li);
                }
            }
        });
    }
// ]]></script>
