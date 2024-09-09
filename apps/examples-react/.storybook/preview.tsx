import * as React from 'react'
import { Preview } from '@storybook/react'
import { ThemeProvider, Global, css } from '@emotion/react'
import emotionReset from 'emotion-reset'
import { DefaultTheme } from '@veavr/react-components/theme.js'
import { DocsContainer, Markdown } from '@storybook/blocks'
import { StoryLayout } from '~/src/components/layout.js'

export default {
  decorators: [
    (storyFn) => (
      <>
        <Global
          styles={css`
            @layer veavr {
              ${emotionReset}

              *, *::after, *::before {
                box-sizing: border-box;
                -moz-osx-font-smoothing: grayscale;
                -webkit-font-smoothing: antialiased;
                font-smoothing: antialiased;
              }
            }
          `}
        ></Global>
        {/* 
        
        Better use the following when css @scopes are more widely supported.
        Also remove <style> tag from preview-head.html.

        <Global
          styles={css`
            @scope (.sbdocs-preview .docs-story) {
              ${emotionReset}

              *, *::after, *::before {
                box-sizing: border-box;
                -moz-osx-font-smoothing: grayscale;
                -webkit-font-smoothing: antialiased;
                font-smoothing: antialiased;
              }
            }
          `}
        ></Global>
        
        */}
        <ThemeProvider theme={DefaultTheme}>
          <StoryLayout className="veavr">{storyFn()}</StoryLayout>
        </ThemeProvider>
      </>
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
