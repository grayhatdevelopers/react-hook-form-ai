import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  code: string;
  lang?: string;
  theme?: string;
  className?: string;
}

export default function CodeBlock({
  code,
  lang = 'typescript',
  theme = 'one-dark-pro',
  className = '',
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    codeToHtml(code, { lang, theme }).then((result) => {
      if (mounted) setHtml(result);
    });

    return () => { mounted = false };
  }, [code, lang, theme]);

  return (
    <div className={`relative overflow-x-auto rounded-md bg-[#0d1117] ${className}`}>
      {html ? (
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className="text-sm [&_pre]:bg-[#0d1117]! [&_pre]:p-4! [&_pre]:m-0!"
        />
      ) : (
        <div className="bg-[#0d1117] p-4 rounded-md">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          </div>
        </div>
      )}
    </div>
  );
}