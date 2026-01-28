export interface ConceptEntry {
  concept: string;
  iconName: string;
  status: "approved" | "to-be-reviewed";
}

export const CONCEPTS: ConceptEntry[] = [
  // General
  { concept: "Agent(s)", iconName: "pointer-arrow", status: "approved" },
  { concept: "Ask", iconName: "question-circle", status: "approved" },
  { concept: "Bugbot", iconName: "bugbot", status: "approved" },
  { concept: "Debug", iconName: "corners-out-check", status: "approved" },
  { concept: "Model(s)", iconName: "cube-transparent", status: "approved" },
  { concept: "Plan", iconName: "list-todo", status: "approved" },
  { concept: "Review", iconName: "rect-magnifying-glass", status: "approved" },
  { concept: "Tab", iconName: "keyboard-tab", status: "approved" },
  { concept: "Beta", iconName: "traffic-cone", status: "to-be-reviewed" },
  { concept: "Billing", iconName: "credit-card", status: "to-be-reviewed" },
  { concept: "Cloud Agents", iconName: "cloud", status: "to-be-reviewed" },
  { concept: "Contact", iconName: "envelope", status: "to-be-reviewed" },
  { concept: "Context(s)", iconName: "at", status: "to-be-reviewed" },
  { concept: "Docs", iconName: "book-open", status: "to-be-reviewed" },
  { concept: "Download", iconName: "arrow-bracket-to-down", status: "to-be-reviewed" },
  { concept: "External Link", iconName: "arrow-right-up", status: "to-be-reviewed" },
  { concept: "General (Settings)", iconName: "cog", status: "to-be-reviewed" },
  { concept: "Indexing & Docs", iconName: "database", status: "to-be-reviewed" },
  { concept: "Integrations", iconName: "cube-nodes", status: "to-be-reviewed" },
  { concept: "Network", iconName: "globe", status: "to-be-reviewed" },
  { concept: "Plan & Usage", iconName: "chart-pie", status: "to-be-reviewed" },
  { concept: "Rules & Commands", iconName: "clipboard", status: "to-be-reviewed" },
  // Git
  { concept: "Git – Commit", iconName: "git-commit", status: "approved" },
  { concept: "Git – Branch", iconName: "git-branch", status: "approved" },
  { concept: "Git – Merge", iconName: "git-merge", status: "approved" },
  { concept: "Git – Pull Request", iconName: "git-pull-request", status: "approved" },
  { concept: "Git – Fetch", iconName: "git-fetch", status: "approved" },
  { concept: "Git – Pull", iconName: "git-pull", status: "approved" },
  { concept: "Git – Push", iconName: "git-push", status: "approved" },
  { concept: "Git – Compare", iconName: "git-compare", status: "approved" },
  { concept: "Git – Pull Request – Closed", iconName: "git-pull-request-closed", status: "approved" },
  { concept: "Git – Pull Request – Create", iconName: "git-pull-request-create", status: "approved" },
  { concept: "Git – Pull Request – Done", iconName: "git-pull-request-done", status: "approved" },
  { concept: "Git – Pull Request – Draft", iconName: "git-pull-request-draft", status: "approved" },
  { concept: "Git – Fork", iconName: "git-fork", status: "to-be-reviewed" },
  { concept: "Git – Stash", iconName: "arrow-bracket-to-down", status: "to-be-reviewed" },
  { concept: "Git – Stash – Pop", iconName: "arrow-bracket-from-up", status: "to-be-reviewed" },
  { concept: "Git – Stash – Apply", iconName: "arrow-bracket-from-up-dashed", status: "to-be-reviewed" },
  // Diff
  { concept: "Diff", iconName: "diff", status: "to-be-reviewed" },
  { concept: "Diff – Added", iconName: "diff-added", status: "to-be-reviewed" },
  { concept: "Diff – Removed", iconName: "diff-removed", status: "to-be-reviewed" },
  { concept: "Diff – Ignored", iconName: "diff-ignored", status: "to-be-reviewed" },
  { concept: "Diff – Modified", iconName: "diff-modified", status: "to-be-reviewed" },
  { concept: "Diff – Renamed", iconName: "diff-renamed", status: "to-be-reviewed" },
  { concept: "Diff – Single", iconName: "diff-single", status: "to-be-reviewed" },
  { concept: "Diff – Multiple", iconName: "diff-multiple", status: "to-be-reviewed" },
  // Layout
  { concept: "Layout – Tabs View", iconName: "tabs", status: "to-be-reviewed" },
  { concept: "Layout – Horizontal Split", iconName: "layout-split-horizontal", status: "to-be-reviewed" },
  { concept: "Layout – Vertical Split", iconName: "layout-split-vertical", status: "to-be-reviewed" },
  { concept: "Layout – Reverse Layout", iconName: "arrows-ccw-angular", status: "to-be-reviewed" },
];
