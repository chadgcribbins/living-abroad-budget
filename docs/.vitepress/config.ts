import type { UserConfig } from 'vitepress';

const config: UserConfig = {
  title: 'Project Documentation',
  description: 'Living docs for the built system.',
  cleanUrls: true,
  themeConfig: {
    sidebar: [
      { text: 'Features', link: '/features/' }, // Assumes docs/features/index.md exists
      { text: 'Architecture', link: '/architecture/' }, // Assumes docs/architecture/index.md exists
      { text: 'ToDos', link: '/todos' } // Assumes docs/todos.md exists
    ]
  }
};

export default config; 