import * as React from 'react'
import { Preview } from '@storybook/react'
import { DocsContainer, Markdown } from '@storybook/blocks'
import { StoryLayout } from '~/src/components/layout.js'

export default {
  decorators: [
    (storyFn, context) => (
      <StoryLayout className="veavr" style={context.parameters.layout}>
        {storyFn()}
      </StoryLayout>
    ),
  ],
  parameters: {
    docs: {
      container: ({ children, context }) => (
        <DocsContainer context={context}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              flexDirection: 'column',
            }}
          >
            <a
              href="https://github.com/faselbaum/veavr"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Markdown>View **veavr** on GitHub</Markdown>
              <img
                style={{ width: '48px' }}
                src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
              />
            </a>
          </div>
          {children}
        </DocsContainer>
      ),
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'react',
          [
            'Getting Started',
            'Attaching vs. Overriding Props',
            'Generating Props for Element Collections',
            'Advanced Component Modification',
            [
              'Intro',
              'Read and Modify Props',
              'Read and Modify State',
              'Swapping Parts',
              'Augmenting The Public Interface',
            ],
          ],
        ],
      },
    },
  },
  tags: ['autodocs'],
} satisfies Preview
