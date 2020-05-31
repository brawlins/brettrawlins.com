---
title:  "React starter project with webpack and PHP"
date:   2015-11-12
tags:
    - react
    - webpack
---

I've been delving into React lately and have started to use it more and more for projects. Previously I was using Gulp to run my builds, but I wanted to try out webpack. It was rather confusing at first, but after watching Joe Eames's excellent <a href="https://app.pluralsight.com/library/courses/webpack-fundamentals/table-of-contents" target="_blank">Webpack Fundamentals</a> course I got it working.

Inspired by Christian Alfoni's <a href="http://www.christianalfoni.com/articles/2015_04_19_The-ultimate-webpack-setup" target="_blank">ultimate webpack setup</a>, I decided to create a React starter application that I could use as a template when starting new projects. Here is what I came up with:

<strong>Repo: <a href="https://github.com/brawlins/react-webpack-php-starter" target="_blank">react-webpack-php-starter</a></strong>

React applications are often served using a node server like Express. However, in my case I wanted to use Apache because we use PHP to manage user authentication. I know there are packages that theoretically can make Express serve PHP, but it was easier to just use our existing Apache server.

This happens to be my specific use case at the moment, but this project could easily be adapted to use a node server instead. <a href="https://github.com/brawlins/react-webpack-php-starter" target="_blank">See the repo for all the details</a>.