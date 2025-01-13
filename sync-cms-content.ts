const hashnode_token = process.env.HASHNODE_TOKEN;

const response = await fetch('https://gql.hashnode.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `${hashnode_token}`,
  },
  body: JSON.stringify({
    query: `
query Publication {
  publication(host: "jw1.dev") {
    title
    posts(first: 10) {
      totalDocuments
      edges {
        node {
          id
          slug
          title
          publishedAt
          updatedAt
          tags {
            name
          }
          content {
            markdown
          }
        }
      }
    }
  }
}
    `,
  }),
});

if(!response.ok){
  console.log('Error:', response.statusText, response.status);
  process.exit(1)
}

// hashnode generated markdown: ![example alt](https://blog-r2.jw1.dev/sFDvrY4uU_bmBpX6.webp align="left")
// need to replace with <Image src="https://blog-r2.jw1.dev/sFDvrY4uU_bmBpX6.webp" alt="example alt" inferSize />
function replaceImageWithMdx(content: string){
  return content.replace(/!\[(.*)\]\((.*)\salign="(.*)"\)/g, '<Image src="$2" alt="$1" inferSize />')
}

function parseContent(content: string) {
  // chain of replacements
  return replaceImageWithMdx(content);
}

interface Post {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  updatedAt: string;
  tags: { name: string }[];
  content: { markdown: string };
}

interface Publication {
  title: string;
  posts: {
    totalDocuments: number;
    edges: { node: Post }[];
  };
}

const json = await response.json() as { data: { publication: Publication } };

const { publication } = json.data;
const posts = publication.posts.edges.map(({ node }) => node);

let gitignore = ''

// return gmt +8 time
function parseDateToGMT(date: string){
  const hour = new Date(date).getHours();
  return new Date(new Date(date).setHours(hour + 8)).toISOString();
}

posts.map(async el => {
  const publishedDate = parseDateToGMT(el.publishedAt);
  const updatedDate = el.updatedAt ? parseDateToGMT(el.updatedAt) : '';
  const dateStr = publishedDate.split('T')[0];
  const filename = dateStr + '-' + el.slug + '.mdx';
  gitignore += filename + '\n';
  await Bun.write(__dirname + '/src/content/posts/' + filename, `---
title: ${el.title}
date: publishedDate${updatedDate ? '\nupdated: ' + updatedDate : ''}
tags: ${JSON.stringify(el.tags.map(tag => tag.name))}
---

import { Image } from 'astro:assets'

${parseContent(el.content.markdown)}
  `)
})

Bun.write(__dirname + '/src/content/posts/.gitignore', gitignore)

console.log('Synced', posts.length, 'posts');

export {}