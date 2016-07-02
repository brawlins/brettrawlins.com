---
layout: post
title:  Filtering Kaltura list results
date:   2013-09-12 12:56:05 -0600
tags:
    - kaltura
    - php
---

[Kaltura](http://corp.kaltura.com){:target="_blank"} is a video platform and content delivery network (CDN). The [Kaltura API](http://www.kaltura.com/api_v3/testmeDoc/index.php){:target="_blank"} is powerful but poorly documented, so usually it takes a lot of trial and error to figure out how to do something.

Here's an example of how to pull down a list of videos filtered on search terms:

```php
require_once('path/to/KalturaClient.php');

// credentials
$partner_id = 'yourPartnerId';
$user = 'ANONYMOUS';
$password = 'yourAdminPassword';

// connect to Kaltura
$config = new KalturaConfiguration($partner_id);
$config->serviceUrl = 'http://www.kaltura.com/';
$client = new KalturaClient($config);
$client->setKs($client->session->start($password, $user, KalturaSessionType::ADMIN));

// filter entries
$filter = new KalturaMediaEntryFilter();
$filter->orderBy = KalturaMediaEntryOrderBy::CREATED_AT_DESC;
$filter->mediaTypeEqual = 1; // video
$filter->searchTextMatchOr = 'this, that, something else'; // find entries with any of these terms

// get entries
$result = $client->media->listAction($filter);
```

As indicated by the name, they apply either AND or OR logic to the terms you supply them. The `tagsLike` method only accepts a single tag which is a little confusing since the name is plural. All the other methods will take multiple search terms in a comma-separated list. Spaces are treated as part of the search term. For a full list see the [API documentation](http://www.kaltura.com/api_v3/testmeDoc/index.php?object=KalturaBaseEntryBaseFilter){:target="_blank"}.

You can combine them to create layers of filters. For example, this would get all entries with the tag "building", and then filter those results for entries with one or more of the search terms:

```php
$filter->tagsLike = 'building'; // must have this tag
$filter->searchTextMatchOr = 'big, red, barn'; // plus any of these terms
```

If you want to limit the number of results and/or paginate them, you can add a pager. Just remember to pass it to your listAction call as the second parameter. This example returns the first 3 results (3 per page, page 1):

```php
// pager
$pager = new KalturaFilterPager();
$pager->pageSize = 3;
$pager->pageIndex = 1;

// get entries
$result = $client->media->listAction($filter, $pager);
```
