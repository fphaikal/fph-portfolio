"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
}

type CodeBlockProps = React.ComponentPropsWithoutRef<"pre">;

function CodeBlock({ children, ...props }: CodeBlockProps) {
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
    <div className="group relative my-6">
      <button
        aria-label="Copy code"
        className="absolute right-3 top-3 z-10 rounded-md border border-white/15 bg-white/10 p-1.5 text-white opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 hover:bg-white/20"
        type="button"
        onClick={handleCopy}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre
        ref={preRef}
        className="overflow-x-auto rounded-xl border border-white/10 bg-[#05070d] p-5 font-mono text-deck-sm leading-relaxed tracking-normal text-slate-100"
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="font-sans text-deck-base text-white/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ node, children, ...props }) => (
            <CodeBlock {...props}>{children}</CodeBlock>
          ),
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");

            return isInline ? (
              <code
                className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.9em] tracking-normal text-sky-200"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className={cn(className, "!bg-transparent font-mono")}
                {...props}
              >
                {children}
              </code>
            );
          },
          img: ({ node, ...props }) => (
            <img
              {...props}
              alt={props.alt || "Blog image"}
              className="mx-auto my-8 rounded-card border border-white/10"
              decoding="async"
              loading="lazy"
            />
          ),
          h1: ({ node, ...props }) => (
            <h1
              {...props}
              className="mb-4 mt-10 scroll-m-20 text-deck-3xl font-medium text-white"
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              {...props}
              className="mb-4 mt-10 scroll-m-20 text-deck-2xl font-medium text-white"
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              {...props}
              className="mb-3 mt-8 scroll-m-20 text-deck-xl font-medium text-white"
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              {...props}
              className="mb-3 mt-8 scroll-m-20 text-deck-lg font-medium text-white"
            />
          ),
          p: ({ node, ...props }) => (
            <p
              {...props}
              className="text-[#b5bfd1] [&:not(:first-child)]:mt-6"
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              {...props}
              className="my-6 ml-6 list-disc space-y-2 text-[#b5bfd1] marker:text-sky-400"
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              {...props}
              className="my-6 ml-6 list-decimal space-y-2 text-[#b5bfd1] marker:text-sky-400"
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className="my-6 border-l-2 border-sky-400 pl-5 text-white/75"
            />
          ),
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-sky-300 underline-offset-4 transition-colors hover:underline"
            />
          ),
          strong: ({ node, ...props }) => (
            <strong {...props} className="font-semibold text-white" />
          ),
          hr: ({ node, ...props }) => (
            <hr {...props} className="my-10 border-t border-white/10" />
          ),
          table: ({ node, ...props }) => (
            <div className="my-6 w-full overflow-x-auto">
              <table
                {...props}
                className="w-full border-collapse text-deck-sm [&_th]:border [&_th]:border-white/15 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-white/15 [&_td]:px-3 [&_td]:py-2"
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th {...props} className="font-semibold text-white" />
          ),
          td: ({ node, ...props }) => (
            <td {...props} className="text-white/75" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
