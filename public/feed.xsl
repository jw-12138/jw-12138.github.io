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
        /* latin-ext */
        @font-face {
          font-family: 'DM Serif Text';
          font-style: italic;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/dmseriftext/v12/rnCw-xZa_krGokauCeNq1wWyWfG1UVoNILVaqNDD.woff2) format('woff2');
          unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }
        /* latin */
        @font-face {
          font-family: 'DM Serif Text';
          font-style: italic;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/dmseriftext/v12/rnCw-xZa_krGokauCeNq1wWyWfG1X1oNILVaqA.woff2) format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
        /* latin-ext */
        @font-face {
          font-family: 'DM Serif Text';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/dmseriftext/v12/rnCu-xZa_krGokauCeNq1wWyWfqFXVAKArdqqQ.woff2) format('woff2');
          unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }
        /* latin */
        @font-face {
          font-family: 'DM Serif Text';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/dmseriftext/v12/rnCu-xZa_krGokauCeNq1wWyWfSFXVAKArc.woff2) format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
          body {
            max-width: 720px;
            margin: 0 auto;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-size: 16px;
            line-height: 1.75em;
            background-color: #fafaf8;
            color: #141413;
          }
          section {
            margin: 30px 20px;
          }
          strong {
            font-weight: 500;
            color: #141413;
          }
          small {
            font-size: 12px;
            line-height: 1.5;
            color: #737373;
          }
          h2 {
            border: none;
            padding-bottom: 0.3em;
            color: #141413;
            font-size: 1.25em;
            margin-top: 3em;
            margin-bottom: 1em;
            font-family: "DM Serif Text", serif;
          }
          .alert {
            background: #f5f5f5;
            padding: 12px 16px;
            margin: 0;
            border-radius: 12px;
            font-style: italic;
          }
          .alert:hover {
            background: #f0f0f0;
          }
          a {
            color: #141413;
            text-decoration: none;
            border-bottom: 1px solid #e5e5e5;
            transition: border-color 0.2s ease;
          }
          a:hover {
            border-color: #141413;
          }
          .entry h3 {
            margin-bottom: 0;
            font-weight: 400;
            font-size: 16px;
            color: #141413;
          }
          .entry p {
            margin: 4px 0;
          }
          ul {
            padding-left: 1.5em;
          }
          li {
            margin-bottom: 0.5em;
          }
          @media (prefers-color-scheme: dark) {
            body {
              background-color: #141413;
              color: #fafaf8;
            }
            strong {
              color: #fafaf8;
            }
            h2 {
              color: #fafaf8;
            }
            small {
              color: #a3a3a3;
            }
            a {
              color: #fafaf8;
              border-bottom-color: #404040;
            }
            a:hover {
              border-color: #fafaf8;
            }
            .alert {
              background: #1a1a1a;
            }
            .alert:hover {
              background: #202020;
            }
            .entry h3 {
              color: #fafaf8;
            }
            .entry small {
              color: #a3a3a3;
            }
          }
        </style>
      </head>
      <body>
        <section>
          <p style="font-size: 2em;">👋</p>
        </section>
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
    <p>All you need to do to get started is to add the URL (web address) for this feed to a special app called a newsreader. Visit <a href="https://aboutfeeds.com/">About Feeds</a> to get started with newsreaders and subscribing. It's free.
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
    </div>
  </xsl:template>

</xsl:stylesheet>
