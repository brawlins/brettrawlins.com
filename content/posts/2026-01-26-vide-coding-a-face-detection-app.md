---
title: "Vibe coding a face detection app"
date: 2026-01-26
tags:
  - ai
---

I've been using AI agents more and more in my work. Sometimes you get super helpful results, and sometimes you have a long session that leads nowhere. It's definitely changing my role as a software engineer. At times it can be amazing, scary, or disorienting, but in the technology field you have to embrace change 😉. So I try to learn, experiment, and remain curious.

## Overview

As an experiment, I decided to try vibe coding an entire app. That's where you work with an AI agent, describe what you want it to do, and then let it write the code. Then you review it, test, make adjustments, and keep iterating until you get the desired outcome.

Recently I heard about a cool face detection library called <a href="https://github.com/justadudewhohacks/face-api.js/" target="_blank">face-api.js</a>. I love the functionality that FamilySearch has on their website where you can label faces on a digital image, so I thought it would be fun to see if I could build something similar using this library to auto-detect the faces.

Here's the little app I came up with:

- Github: <a href="https://github.com/brawlins/face-detection-app" target="_blank">https://github.com/brawlins/face-detection-app</a>
- Demo: <a href="https://face-detection-app-xi.vercel.app" target="_blank">https://face-detection-app-xi.vercel.app</a>

## Features

- Upload an image
- Auto detect faces with face-api.js
- Adjust face boxes (or add new ones) manually
- Label people with their names
- Switch to View mode to reveal tagged areas on hover
- Persistence in localStorage
- No server involved (runs locally in the browser)

## Tech Stack

- React + Vite
- Tailwind CSS
- face-api.js

## Face-api can do more!

BTW, the face-api is very impressive, and can do much more than what I'm using it for here. For example:

- Face matching/recognition (similarity based on landmarks)
- Facial expression recognition (happy, sad, angry)
- Age and gender recognition
- Video face tracking

Check it out here: <a href="https://github.com/justadudewhohacks/face-api.js/" target="_blank">https://github.com/justadudewhohacks/face-api.js/</a>
