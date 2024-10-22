import { Command } from 'commander';
import newPost from './cli-functions/newPost.js'

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


program.parse()
