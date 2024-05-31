---
title: Privacy Polices of This Blog
layout: ../layouts/md-page-layout.astro
issue: 0
---

### TL;DR

本博客（jw1.dev）的评论系统不会存储任何用户信息。

This blog does not store any user information.

--- 

正常来讲，一个博客压根就不需要什么隐私声明，不过我觉得，让用户知道自己的信息将会被如何使用以及处理还是很有必要的。

Normally, a blog doesn't need a privacy policy, but I think it's necessary to let users know how their information will be used and processed.

### 信息授权 Granting Access

本博客的评论系统完全基于 GitHub Issues 制作，点击「登录以发表评论」按钮之后会跳转到 GitHub 的授权页面，授权信息仅包括用户 GitHub 账户的公开信息。

The comment system of this blog is completely based on GitHub Issues. After clicking the "Login to comment" button, you will be redirected to the GitHub authorization page. The authorized information only includes the public information of the user's GitHub account.

### 信息处理 Processing of Information

在用户授权登录成功后，GitHub 会返回给本博客一个用户令牌，这个令牌可以让用户在本博客进行代理操作，比如发表评论、删除评论或给评论点赞等。该令牌将会被存储在浏览器中，未来再次访问本博客时即可省去重新登录的步骤。

After the user successfully logs in, GitHub will return a user token to this blog. This token allows users to perform proxy operations on this blog, such as posting comments, deleting comments, or liking comments. The token will be stored in the browser and can be used to skip the login step when visiting this blog again in the future.

目前本博客支持的代理操作有：

- Issues 的创建、删除、修改
- Reactions 的创建、删除

Currently, the proxy operations supported by this blog are:

- Create, delete, and modify Issues
- Create and delete Reactions


### 信息存储 Storage of Information

服务器端：本博客不会存储用户的任何信息，更加不会将用户的信息分享给任何第三方或是用于其他地方。

Server: The blog server does not store any user information, let alone share it with any third party or use it elsewhere.

客户端：GitHub 令牌将会被存储在浏览器的 LocalStorage 中，也就是用户的设备上，退出登录即可删除该令牌。

Client: The GitHub token will be stored in the browser's LocalStorage, which is the user's device. You can delete the token by logging out.

### 取消授权 Revoke Access

前往 GitHub 设置页面，点击左侧的「Applications」，切换到「Authorized GitHub Apps」，找到「jw1dev comments」，点击「Revoke Access」即可取消授权。

To revoke access, go to the GitHub settings page, click on the left "Applications", switch to "Authorized GitHub Apps", find "jw1dev comments", and click "Revoke Access".

[这个链接](https://github.com/settings/connections/applications/Iv1.717c117523f74671)应该可以直接跳转到该设置页面。

[This link](https://github.com/settings/connections/applications/Iv1.717c117523f74671) should take you directly to the settings page.

取消授权之后，用户设备上的令牌将会立即失效。

After revoking access, the token on the user's device will be immediately invalidated.
