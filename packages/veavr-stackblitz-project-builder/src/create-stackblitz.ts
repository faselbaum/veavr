import * as stackblitz from '@stackblitz/sdk'

export function createStackblitz(hostElementId: string) {
  stackblitz.default.embedProject(
    hostElementId,
    {
      template: 'node',
      files: {
        'package.json': `{
          "type": "module",
          "scripts": {
            "dev": "vite"
          },
          "dependencies": {
            "@veavr/react": "latest",
            "react": "latest",
            "react-dom": "latest",
            "@types/react": "latest",
            "@types/react-dom": "latest",
            "typescript": "^5.5.3",
            "vite": "latest"
          }
        }`,
        'tsconfig.json': `{
          "compilerOptions": {
            "strict": true,
            "target": "ES2022",
            "module": "NodeNext",
            "moduleResolution": "NodeNext",
            "allowSyntheticDefaultImports": false,
            "esModuleInterop": false,
            "incremental": true,
            "jsx": "react-jsx",
          },
          "include": ["./"]
        }`,
        'App.tsx': `
          import * as React from "react";
          import { veavr } from "@veavr/react";
          import { createRoot } from "react-dom/client";

          export const Component = veavr<{}>()({
            parts: { Root: "div" },
            component: ({ props, veavr }) => {
              return veavr
                .bindProps(() => ({}))
                .bindNode(({ parts, assignedProps }) => (
                  <parts.Root {...assignedProps.Root}>THIS IS VEAVR</parts.Root>
                ));
            },
          });
          
          const root = createRoot(document.querySelector('#root')!);
          root.render(<Component />);
        `,
        'index.html': /* HTML */ `
          <html>
            <body>
              <div id="root"></div>
              <script type="module" src="./App.tsx"></script>
            </body>
          </html>
        `,
      },
      title: 'SDK Test',
    },
    {
      height: '100%',
      startScript: 'dev',
    }
  )
}
