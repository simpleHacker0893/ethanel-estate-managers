'use client';

import dynamic from 'next/dynamic';

/** Client leaf that loads the widget after hydration so marketing pages stay static and light. */
const AssistantWidget = dynamic(() => import('./assistant-widget').then((m) => m.AssistantWidget), {
  ssr: false,
});

export function AssistantMount() {
  return <AssistantWidget />;
}
