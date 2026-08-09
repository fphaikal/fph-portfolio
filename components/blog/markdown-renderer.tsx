"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none prose-headings:text-neutral-900 dark:prose-headings:text-white prose-p:text-neutral-700 dark:prose-p:text-neutral-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ node, children, ...props }) => {
            const [copied, setCopied] = useState(false);
            const preRef = useRef<HTMLPreElement>(null);

            const handleCopy = () => {
              if (preRef.current) {
                const text = preRef.current.textContent || "";
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }
            };

            return (
              <div className="relative group my-4 not-prose">
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-2 p-1.5 rounded-md bg-white/20 hover:bg-white/30 text-neutral-300 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Copy code"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <pre
                  ref={preRef}
                  className="!bg-[#282c34] !text-neutral-200 p-4 rounded-lg overflow-x-auto border border-neutral-700"
                  {...props}
                >
                  {children}
                </pre>
              </div>
            );
          },
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");

            return isInline ? (
              <code
                className="bg-neutral-200 dark:bg-neutral-700 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code className={`${className} !text-neutral-200`} {...props}>
                {children}
              </code>
            );
          },
          img: ({ node, ...props }) => (
            <img {...props} className="rounded-xl shadow-md mx-auto my-6" alt={props.alt || "Blog image"} />
          ),
          h1: ({ node, ...props }) => <h1 {...props} className="text-3xl font-bold mt-8 mb-4 scroll-m-20 text-neutral-900 dark:text-white" />,
          h2: ({ node, ...props }) => <h2 {...props} className="text-2xl font-bold mt-8 mb-4 scroll-m-20 text-neutral-900 dark:text-white" />,
          h3: ({ node, ...props }) => <h3 {...props} className="text-xl font-bold mt-6 mb-3 scroll-m-20 text-neutral-900 dark:text-white" />,
          p: ({ node, ...props }) => <p {...props} className="leading-7 [&:not(:first-child)]:mt-6 text-neutral-700 dark:text-neutral-300" />,
          ul: ({ node, ...props }) => <ul {...props} className="my-6 ml-6 list-disc [&>li]:mt-2 text-neutral-700 dark:text-neutral-300" />,
          ol: ({ node, ...props }) => <ol {...props} className="my-6 ml-6 list-decimal [&>li]:mt-2 text-neutral-700 dark:text-neutral-300" />,
          blockquote: ({ node, ...props }) => (
            <blockquote {...props} className="mt-6 border-l-4 border-violet-500 pl-6 italic text-neutral-600 dark:text-neutral-400" />
          ),
          a: ({ node, ...props }) => (
            <a {...props} className="text-violet-600 dark:text-violet-400 hover:underline" />
          ),
          strong: ({ node, ...props }) => (
            <strong {...props} className="font-bold text-neutral-900 dark:text-white" />
          ),
          li: ({ node, ...props }) => (
            <li {...props} className="text-neutral-700 dark:text-neutral-300" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
