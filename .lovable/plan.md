

# Fix AI Health Analysis Markdown Rendering

## Problem
Line 225-226 renders `{result}` as plain text inside a `whitespace-pre-wrap` div. Raw markdown symbols (`**`, `##`, `|` tables) display as-is.

## Solution
Install `react-markdown` + `remark-gfm` and replace the raw text output with a proper markdown renderer. Add Tailwind prose styling for tables.

## Changes

### 1. Install dependencies
- `react-markdown` and `remark-gfm` (for table support)

### 2. Modify `src/pages/AIAnalysis.tsx`
- Import `ReactMarkdown` and `remarkGfm`
- Replace lines 225-227:
  ```tsx
  // Before
  <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
    {result}
  </div>
  
  // After
  <div className="prose prose-sm max-w-none dark:prose-invert
    prose-headings:text-foreground prose-strong:text-foreground
    prose-table:border-collapse prose-th:border prose-th:border-border
    prose-th:bg-muted prose-th:px-3 prose-th:py-2
    prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
  </div>
  ```

This renders bold, italics, headings, lists, and tables properly across all three analysis tabs (Prescription, Report, Symptom).

## Files
1. `package.json` — add `react-markdown`, `remark-gfm`
2. `src/pages/AIAnalysis.tsx` — import and use `ReactMarkdown`

