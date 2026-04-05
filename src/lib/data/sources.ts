export type ToolSource = {
  id: string;
  label: string;
  kind: 'github' | 'startup' | 'dailydev';
  description: string;
  priority: number;
};

export const sources: ToolSource[] = [
  {
    id: 'github-releases',
    label: 'GitHub releases',
    kind: 'github',
    description: 'Track new Svelte-related repos, releases, and starred projects.',
    priority: 1
  },
  {
    id: 'startup-launches',
    label: 'Startup launches',
    kind: 'startup',
    description: 'Collect product launches, teaser pages, and early access tools.',
    priority: 2
  },
  {
    id: 'daily-dev',
    label: 'daily.dev',
    kind: 'dailydev',
    description: 'Surface developer posts, libraries, and current community picks.',
    priority: 3
  }
];
