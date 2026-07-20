import React from 'react';
import { useTranslation } from 'react-i18next';

const EXAMPLE_PROMPT_KEYS = ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'] as const;

export function ExamplePrompts(sendMessage?: { (event: React.UIEvent, messageInput?: string): void | undefined }) {
  const { t } = useTranslation('chat');

  return (
    <div id="examples" className="relative flex flex-col gap-9 w-full max-w-3xl mx-auto flex justify-center mt-6">
      <div
        className="flex flex-wrap justify-center gap-2"
        style={{
          animation: '.25s ease-out 0s 1 _fade-and-move-in_g2ptj_1 forwards',
        }}
      >
        {EXAMPLE_PROMPT_KEYS.map((key) => {
          const text = t(`examples.${key}`);

          return (
            <button
              key={key}
              onClick={(event) => {
                sendMessage?.(event, text);
              }}
              className="border border-bolt-elements-borderColor rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary px-3 py-1 text-xs transition-theme"
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
