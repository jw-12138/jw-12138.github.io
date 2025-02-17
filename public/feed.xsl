<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  exclude-result-prefixes="atom"
>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <title>RSS •
          <xsl:value-of select="atom:feed/atom:title"/>
        </title>
        <style type="text/css">
          body{max-width:720px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";font-size:16px;line-height:1.75em; color: #555}
          section{margin:30px 20px}
          strong{font-weight: 500; color: black}
          small{font-size: 12px; line-height: 1.5}
          h2{border:none;padding-bottom:.3em; color: black; font-size: 1.25em; margin-top: 3em; margin-bottom: 1em}
          .alert{background:#f1f1f1;padding:4px 12px;margin:0; border-radius: 12px; font-style: italic}
          a{text-decoration:none}.entry h3{margin-bottom:0}.entry p{margin:4px 0}
          a{color: black; text-decoration: underline; text-decoration-color: #aaa; text-underline-offset: 4px}
        </style>
      </head>
      <body>
        <section>
          <div class="alert">
            <p><strong>This is a web feed</strong>, also known as an RSS feed. <strong>Subscribe</strong> by copying the URL from the address bar into your newsreader app.
            </p>
          </div>
        </section>
        <section>
          <xsl:apply-templates select="atom:feed"/>
        </section>
        <section>
          <h2>Recently Posted</h2>
          <xsl:apply-templates select="atom:feed/atom:entry"/>
        </section>
        <section style="padding-bottom: 2em">
          <div style="text-align: center">
            <a href="https://jw1.dev/posts">Read More</a>
          </div>
        </section>
        <section>
          <small>
            Feed style (.xsl) is slightly modified according to the <a href="https://gist.github.com/andrewstiefel/57a0a400aa2deb6c9fe18c6da4e16e0f">original version</a> by <a href="https://andrewstiefel.com">Andrew Stiefel</a>.
          </small>
        </section>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="atom:feed">
    <p>This RSS feed provides the latest posts from<xsl:value-of select="atom:title"/>'s blog.
      <a class="head_link" target="_blank">
        <xsl:attribute name="href">
          <xsl:value-of select="atom:link[@rel='alternate']/@href"/>
        </xsl:attribute>
        Visit Website &#x2192;
      </a>
    </p>

    <h2>What is an RSS feed?</h2>
    <p>An RSS feed is a data format that contains the latest content from a website, blog, or podcast. You can use feeds to <strong>subscribe</strong> to websites and get the <strong>latest content in one place</strong>.
    </p>
    <ul>
      <li>
        <strong>Feeds put you in control.</strong>
        Unlike social media apps, there is no algorithm deciding what you see or read. You always get the latest content from the creators you care about.
      </li>
      <li>
        <strong>Feed are private by design.</strong>
        No one owns web feeds, so no one is harvesting your personal information and profiting by selling it to advertisers.
      </li>
      <li>
        <strong>Feeds are spam-proof.</strong>
        Had enough? Easy, just unsubscribe from the feed.
      </li>
    </ul>
    <p>All you need to do to get started is to add the URL (web address) for this feed to a special app called a newsreader. Visit <a href="https://aboutfeeds.com/">About Feeds</a> to get started with newsreaders and subscribing. It’s free.
    </p>
  </xsl:template>

  <xsl:template match="atom:entry">
    <div class="entry">
      <h3 style="font-weight: 400; font-size: 16px">
        <a target="_blank">
          <xsl:attribute name="href">
            <xsl:value-of select="atom:id"/>
          </xsl:attribute>
          <xsl:value-of select="atom:title"/>
        </a>
      </h3>
      <small>
        Published:
        <xsl:value-of select="atom:published_readable"/>
      </small>
    </div>
  </xsl:template>

</xsl:stylesheet>
