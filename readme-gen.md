---
permalink: list.md
---

# {{site.title}}

## Recent Posts
{%for item in site.posts%}
- [{{item.title}}](https://jw1.dev{{item.url}})  
  {%if item.desc%}
  {{item.desc}}...
  {%else%}
  {{ item.excerpt | strip_html | truncatewords: 10 }}...
  {%endif%}
{%endfor%}

## Friends

{% for item in site.data.data.links %}
- [{{item.name}}]({{item.url}})  
  {{item.slogan}}
{% endfor %}