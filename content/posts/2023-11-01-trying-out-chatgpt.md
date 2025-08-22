---
title: "Trying out ChatGPT"
date: 2023-11-01
tags:
  - ai
  - go
---

Recently I decided to check out OpenAI's [ChatGPT](https://openai.com/chatgpt/). It's pretty interesting. These language models are very powerful. I was surprised at how easily you can integrate with their API. It's very well documented and easy to use.

Using their [quickstart documentation](https://platform.openai.com/docs/quickstart), I was able to build a simple question/answer utility in Go that you can run from the command line. After launching the application, you simply type a question and hit enter. It sends a request to their API, which returns a response from their ChatGPT model.

It looks like this:
<img src="https://raw.githubusercontent.com/brawlins/go-ask/main/go-ask-screenshot.png" title="screenshot" alt="screenshot" width="100%;" />

You can check out the repo here:
[https://github.com/brawlins/go-ask](https://github.com/brawlins/go-ask)
