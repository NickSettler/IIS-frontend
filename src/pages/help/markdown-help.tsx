import { JSX, useEffect, useState } from 'react';
import page from './help.md';
import MuiMarkdown from 'mui-markdown';

export const MarkdownHelp = (): JSX.Element => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    fetch(page)
      .then(async (res) => res.text())
      .then((md) => {
        setContent(md);
      });
  }, []);

  return <MuiMarkdown>{content}</MuiMarkdown>;
};
