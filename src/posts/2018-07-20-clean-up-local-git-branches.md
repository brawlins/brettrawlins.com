---
layout: post
title:  "Clean up local git branches"
date:   2018-07-20 07:50:00 -0600
tags:
    - shell
    - git
---

Branch cleanup is a constant housekeeping item. To make things easier I've been using this script:

[pruneLocalBranches.sh](https://gist.github.com/brawlins/98563783155ac28fe8e317c0a3af26c9){:target="_blank"}

It checks to see which branches have been deleted on the remote and lets you delete your local copy. First it creates a list of branches to be removed so you can edit it if you want to keep any of them. I have it aliased in my bash profile as `gpl` for "git prune local": 

```
alias gpl='sh ~/_myconfig/pruneLocalBranches.sh'
```
