import type { Preview } from '@storybook/nextjs-vite'
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#f9fafb" },
        { name: "dark", value: "#1f2937" },
        { name: "white", value: "#ffffff" },
      ],
    },
  },
};

export default preview;