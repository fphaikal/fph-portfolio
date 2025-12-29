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
    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
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
              <div className="relative group my-4">
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Copy code"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <pre
                  ref={preRef}
                  className="bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto border border-neutral-800"
                  {...props}
                >
                  {children}
                </pre>
              </div>
            );
          },
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            // Type assertion for prop types that might be passed by ReactMarkdown
            const isInline = !match && !String(children).includes("\n");

            return isInline ? (
              <code
                className="bg-neutral-100 dark:bg-neutral-800 text-amber-500 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Custom styling for other elements can be added here
          img: ({ node, ...props }) => (
            <img {...props} className="rounded-xl shadow-md mx-auto my-6" alt={props.alt || "Blog image"} />
          ),
          h1: ({ node, ...props }) => <h1 {...props} className="text-3xl font-bold mt-8 mb-4 scroll-m-20" />,
          h2: ({ node, ...props }) => <h2 {...props} className="text-2xl font-bold mt-8 mb-4 scroll-m-20" />,
          h3: ({ node, ...props }) => <h3 {...props} className="text-xl font-bold mt-6 mb-3 scroll-m-20" />,
          p: ({ node, ...props }) => <p {...props} className="leading-7 [&:not(:first-child)]:mt-6" />,
          ul: ({ node, ...props }) => <ul {...props} className="my-6 ml-6 list-disc [&>li]:mt-2" />,
          ol: ({ node, ...props }) => <ol {...props} className="my-6 ml-6 list-decimal [&>li]:mt-2" />,
          blockquote: ({ node, ...props }) => (
            <blockquote {...props} className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
