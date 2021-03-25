---
permalink: list.md
---

# {{site.title}}

## Posts
{%for item in site.posts%}
- [{{item.title}}](https://jw1.dev{{item.url}})  
  {{item.date | date: "%Y-%m-%d"}}
{%endfor%}

## Friends

{% for item in site.data.data.links %}
- [{{item.name}}]({{item.url}})  
  {{item.slogan}}
{% endfor %}