### [{{site.title}}]({{site.url}})  

[RSS订阅 🚩](https://jw1.dev/atom.xml)  

#### 最近的文章  

{% for item in site.posts %}
- [{{item.title}}]({{item.id}}.html)  
  > {{item.excerpt | strip_html | truncatewords: 20}}  
{% endfor %}

#### 友情链接  

{% for item in site.data.data.links %}
- [{{item.name}}]({{item.url}})  
  > {{item.slogan}}  
  
{% endfor %}