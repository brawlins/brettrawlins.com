---
layout: post
title:  Git branch workflow
date:   2013-08-28 18:38:08 -0600
tags:
    - command line
    - git
---

I have three environments:

1. local (development)
2. test
3. production

Usually you want to try out a new feature and then test it out on the server without screwing up your stable code. If it works, you can move it to production, but if not, you can just throw it away. That's the beauty of branching with git! Here's an example workflow.

## 1. Create a local branch

    git checkout -b feature

Now you have a new branch called "feature" and it's checked out. After you edit some files and commit the changes you'll want to push this new branch up the repository:

    git push -u origin feature

## 2. Test it on the server

The new branch is in the repository now, but it's not yet on the server, so you'll need to fetch it:

    git fetch origin
    git checkout --track origin/feature

Now you have a tracked and checked-out copy of the new branch on your server. Test, test, test!

## 3. Merge it into the master branch

Once you're satisfied that it works, you'll want to merge it into the master branch. Do that first locally:

    git checkout master
    git merge --no-ff feature

Then push up the changes to the repository:

    git push origin master

## 4. Delete the feature branch

You no longer need the feature branch, so let's delete it. First locally:

    git branch -d feature

And then from the repository:

    git push origin :feature

## 5. Deploy on the server

Now you're ready to deploy it. SSH into the server and pull down the changes:

    git pull origin master
