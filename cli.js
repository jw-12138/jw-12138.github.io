import { Command } from 'commander';
import newPost from './cli-functions/newPost.js'
import newIssue from './cli-functions/newIssue.js'

const program = new Command()

program.name('jw1dev-astro-blog')
  .description('Some commonly used cli functions for Astro')
  .version('0.0.0')

program.command('new-post')
  .description('create a new post')
  .argument('<title>', 'post title')
  .option('-t, --type <type>', 'file type, default is "md", can also be "mdx"')
  .option('--draft', 'create a draft post')
  .action(newPost)

program.command('new-issue')
  .description('create a new issue for a blog post')
  .argument('<title>', 'issue title')
  .argument('<path>', 'blog path, no domain needed, just the path')
  .action(newIssue)


program.parse()
