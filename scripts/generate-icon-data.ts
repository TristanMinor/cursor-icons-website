import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import opentype from "opentype.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ICONS_DIR = path.join(ROOT, "source/icons");
const FONTS_DIR = path.join(ROOT, "source/fonts");
const TAGS_FILE = path.join(ROOT, "source/tags.json");
const OUTPUT_FILE = path.join(ROOT, "src/generated/icons.json");
const MAPPING_FILE = path.join(ROOT, "source/mapping.json");

// ── Semantic tag expansion map ──────────────────────────────────────────────
const TAG_EXPANSIONS: Record<string, string[]> = {
  arrow: ["navigate", "direction", "pointer", "move"],
  home: ["house", "main", "start", "landing"],
  user: ["person", "profile", "account", "avatar", "people"],
  users: ["people", "group", "team", "members"],
  search: ["find", "look", "magnify", "query", "lookup"],
  check: ["done", "complete", "success", "tick", "confirm", "approve"],
  close: ["remove", "delete", "dismiss", "cancel", "x"],
  plus: ["add", "create", "new", "insert"],
  minus: ["remove", "subtract", "reduce", "less"],
  edit: ["pencil", "write", "modify", "change", "update"],
  trash: ["delete", "remove", "discard", "bin", "garbage"],
  star: ["favorite", "bookmark", "rating", "featured"],
  heart: ["like", "love", "favorite", "health"],
  eye: ["view", "visibility", "watch", "show", "see", "visible"],
  lock: ["secure", "private", "locked", "security", "protect"],
  unlock: ["open", "public", "unlocked", "access"],
  mail: ["email", "message", "letter", "envelope", "inbox"],
  phone: ["call", "telephone", "contact", "mobile", "device"],
  calendar: ["date", "schedule", "event", "time", "planner"],
  clock: ["time", "schedule", "timer", "hour", "watch"],
  settings: ["gear", "preferences", "config", "options", "cog"],
  gear: ["settings", "preferences", "config", "options", "cog"],
  file: ["document", "page", "paper", "doc"],
  folder: ["directory", "collection", "group", "organize"],
  image: ["photo", "picture", "media", "gallery", "pic"],
  camera: ["photo", "picture", "capture", "snap", "record"],
  video: ["movie", "film", "media", "play", "record", "clip"],
  music: ["audio", "sound", "song", "media", "play"],
  bell: ["notification", "alert", "alarm", "ring", "notify"],
  chat: ["message", "conversation", "talk", "comment", "discuss"],
  message: ["chat", "conversation", "talk", "comment", "text"],
  send: ["submit", "share", "deliver", "dispatch"],
  download: ["save", "export", "get", "fetch"],
  upload: ["import", "share", "publish", "send"],
  link: ["chain", "url", "connect", "attach", "hyperlink"],
  share: ["social", "distribute", "send", "forward"],
  copy: ["duplicate", "clone", "clipboard"],
  paste: ["clipboard", "insert"],
  cut: ["scissors", "trim", "clip"],
  filter: ["funnel", "sort", "refine", "narrow"],
  sort: ["order", "arrange", "organize", "rank"],
  grid: ["layout", "table", "matrix", "tiles"],
  list: ["menu", "items", "rows", "lines"],
  menu: ["hamburger", "navigation", "options", "list"],
  more: ["dots", "ellipsis", "options", "overflow"],
  refresh: ["reload", "sync", "update", "rotate"],
  sync: ["refresh", "update", "synchronize", "cloud"],
  cloud: ["storage", "upload", "online", "server"],
  database: ["storage", "data", "server", "table"],
  server: ["host", "backend", "machine", "computer"],
  code: ["programming", "develop", "brackets", "script", "terminal"],
  terminal: ["console", "command", "shell", "cli", "prompt"],
  bug: ["error", "issue", "debug", "problem", "defect"],
  warning: ["alert", "caution", "attention", "exclamation", "danger"],
  info: ["information", "help", "about", "details", "tooltip"],
  question: ["help", "ask", "support", "faq", "unknown"],
  circle: ["round", "dot", "shape", "ring"],
  square: ["shape", "box", "rectangle", "block"],
  triangle: ["shape", "play", "delta"],
  shield: ["security", "protect", "safe", "guard", "defense"],
  key: ["password", "access", "security", "unlock", "auth"],
  credit: ["card", "payment", "money", "finance", "billing"],
  cart: ["shopping", "buy", "purchase", "ecommerce", "basket"],
  bag: ["shopping", "purchase", "tote"],
  tag: ["label", "price", "category", "badge"],
  flag: ["report", "mark", "country", "important", "bookmark"],
  pin: ["location", "map", "marker", "place", "attach"],
  map: ["location", "navigation", "place", "geography", "directions"],
  compass: ["navigation", "direction", "explore", "orient"],
  globe: ["world", "earth", "international", "web", "language"],
  sun: ["light", "day", "bright", "weather", "mode"],
  moon: ["night", "dark", "mode", "sleep"],
  zap: ["lightning", "power", "energy", "fast", "electric", "bolt"],
  battery: ["power", "energy", "charge", "level"],
  wifi: ["wireless", "internet", "network", "signal", "connection"],
  bluetooth: ["wireless", "connect", "device", "pair"],
  monitor: ["display", "screen", "desktop", "computer"],
  laptop: ["computer", "device", "portable", "notebook"],
  tablet: ["device", "ipad", "screen", "mobile"],
  smartphone: ["mobile", "device", "phone", "cell"],
  printer: ["print", "paper", "document", "output"],
  speaker: ["audio", "sound", "volume", "music"],
  mic: ["microphone", "audio", "record", "voice", "speak"],
  headphones: ["audio", "music", "listen", "earphones"],
  bold: ["text", "format", "strong", "weight"],
  italic: ["text", "format", "emphasis", "slant"],
  underline: ["text", "format", "decoration"],
  align: ["text", "format", "justify", "layout"],
  type: ["text", "font", "typography", "letter"],
  hash: ["number", "tag", "pound", "hashtag", "octothorpe"],
  at: ["email", "mention", "address"],
  percent: ["discount", "ratio", "proportion"],
  dollar: ["money", "currency", "price", "finance", "cost"],
  activity: ["pulse", "health", "chart", "graph", "monitor"],
  bar: ["chart", "graph", "statistics", "data", "analytics"],
  pie: ["chart", "graph", "statistics", "data", "proportion"],
  trending: ["graph", "growth", "analytics", "chart", "increase"],
  layers: ["stack", "depth", "level", "overlap"],
  layout: ["grid", "template", "design", "structure"],
  sidebar: ["panel", "drawer", "navigation", "aside"],
  columns: ["layout", "grid", "table", "split"],
  rows: ["layout", "grid", "table", "horizontal"],
  maximize: ["fullscreen", "expand", "enlarge", "resize"],
  minimize: ["shrink", "collapse", "reduce", "resize"],
  expand: ["enlarge", "grow", "maximize", "open"],
  collapse: ["shrink", "minimize", "close", "fold"],
  external: ["link", "open", "outside", "new", "window"],
  log: ["record", "history", "activity", "journal"],
  save: ["floppy", "store", "keep", "preserve"],
  undo: ["back", "revert", "reverse", "return"],
  redo: ["forward", "repeat", "again"],
  crop: ["trim", "cut", "resize", "image"],
  rotate: ["turn", "spin", "orientation", "flip"],
  zoom: ["magnify", "scale", "enlarge", "focus"],
  palette: ["color", "paint", "design", "art", "theme"],
  brush: ["paint", "draw", "art", "design", "stroke"],
  pen: ["draw", "write", "tool", "design", "ink"],
  eraser: ["remove", "clear", "delete", "undo"],
  scissors: ["cut", "trim", "clip", "tool"],
  paperclip: ["attach", "attachment", "clip", "file"],
  bookmark: ["save", "favorite", "mark", "flag"],
  archive: ["store", "backup", "compress", "box", "history"],
  inbox: ["mail", "receive", "message", "tray"],
  outbox: ["send", "mail", "dispatch"],
  forward: ["next", "ahead", "continue", "right", "advance"],
  back: ["previous", "left", "return", "behind", "retreat"],
  up: ["above", "top", "ascend", "rise", "increase"],
  down: ["below", "bottom", "descend", "drop", "decrease"],
  left: ["back", "previous", "west"],
  right: ["forward", "next", "east"],
  top: ["up", "above", "first", "start"],
  bottom: ["down", "below", "last", "end"],
  window: ["browser", "app", "frame", "panel"],
  tab: ["browser", "page", "switch", "panel"],
  panel: ["sidebar", "drawer", "section", "pane"],
  modal: ["dialog", "popup", "overlay", "alert"],
  tooltip: ["hint", "info", "help", "hover"],
  dropdown: ["select", "menu", "options", "list", "combobox"],
  toggle: ["switch", "on", "off", "boolean"],
  checkbox: ["check", "select", "option", "tick"],
  radio: ["select", "option", "choice", "button"],
  slider: ["range", "adjust", "control", "input"],
  input: ["field", "text", "form", "entry"],
  cursor: ["pointer", "mouse", "click", "select"],
  hand: ["grab", "drag", "pointer", "gesture"],
  touch: ["tap", "gesture", "finger", "interact"],
  drag: ["move", "reorder", "grab", "handle"],
  resize: ["scale", "adjust", "handle", "dimension"],
  move: ["drag", "reposition", "relocate", "transfer"],
  sparkle: ["ai", "magic", "new", "star", "shine", "effect"],
  wand: ["magic", "ai", "auto", "generate"],
  robot: ["ai", "bot", "automation", "machine"],
  brain: ["ai", "intelligence", "think", "smart", "mind"],
  target: ["goal", "aim", "focus", "crosshair", "bullseye"],
  crosshair: ["target", "aim", "focus", "precision"],
  stop: ["pause", "end", "halt", "block", "square"],
  play: ["start", "begin", "media", "video", "run"],
  pause: ["stop", "hold", "wait", "break"],
  skip: ["next", "forward", "jump", "advance"],
  rewind: ["back", "previous", "reverse", "backward"],
  record: ["capture", "save", "dot", "red"],
  volume: ["sound", "audio", "speaker", "loud"],
  mute: ["silent", "quiet", "off", "nosound"],
  space: ["blank", "empty", "gap", "whitespace"],
  wrap: ["text", "line", "break", "overflow"],
  paragraph: ["text", "block", "content", "body"],
  heading: ["title", "header", "h1", "text"],
  quote: ["blockquote", "cite", "reference", "text"],
  table: ["grid", "data", "spreadsheet", "columns"],
  form: ["input", "field", "submit", "entry"],
  button: ["click", "action", "submit", "cta"],
  badge: ["count", "notification", "indicator", "label"],
  avatar: ["user", "profile", "image", "photo"],
  divider: ["separator", "line", "hr", "break"],
  dot: ["circle", "point", "indicator", "bullet"],
  chip: ["tag", "badge", "label", "pill"],
  card: ["container", "box", "panel", "tile"],
  loading: ["spinner", "progress", "wait", "busy"],
  spinner: ["loading", "progress", "wait", "rotate"],
  progress: ["loading", "bar", "status", "level"],
  empty: ["blank", "none", "zero", "placeholder"],
  error: ["fail", "wrong", "invalid", "red", "problem"],
  success: ["done", "complete", "valid", "green", "pass"],
  log_in: ["signin", "login", "enter", "access"],
  log_out: ["signout", "logout", "exit", "leave"],
  sign: ["label", "notice", "indicator", "post"],
  trend: ["analytics", "graph", "growth", "direction"],
  tool: ["wrench", "settings", "utility", "repair"],
  wrench: ["tool", "settings", "fix", "repair", "maintenance"],
  hammer: ["tool", "build", "construct", "fix"],
  plug: ["connect", "plugin", "power", "extension"],
  cable: ["wire", "connect", "usb", "port"],
  chip_component: ["cpu", "processor", "hardware", "circuit"],
  hard_drive: ["storage", "disk", "hdd", "ssd", "data"],
  box: ["package", "container", "cube", "product"],
  package: ["box", "module", "library", "delivery", "npm"],
  gift: ["present", "reward", "surprise", "offer"],
  truck: ["delivery", "shipping", "transport", "vehicle"],
  store: ["shop", "market", "retail", "buy"],
  receipt: ["invoice", "bill", "transaction", "purchase"],
  wallet: ["money", "payment", "finance", "crypto"],
  bank: ["finance", "money", "institution", "building"],
  building: ["office", "company", "structure", "architecture"],
  hospital: ["health", "medical", "emergency", "care"],
  school: ["education", "learn", "study", "academic"],
  book: ["read", "education", "library", "manual", "documentation"],
  newspaper: ["news", "article", "press", "media", "blog"],
  film: ["movie", "cinema", "video", "media", "reel"],
  tv: ["television", "screen", "monitor", "display", "media"],
  radio_device: ["broadcast", "frequency", "signal", "media"],
  podcast: ["audio", "episode", "show", "listen", "media"],
  gamepad: ["game", "controller", "play", "joystick", "console"],
  trophy: ["award", "achievement", "win", "prize", "cup"],
  medal: ["award", "achievement", "badge", "prize", "honor"],
  crown: ["king", "queen", "royal", "premium", "vip"],
  diamond: ["gem", "premium", "valuable", "jewel", "precious"],
  fire: ["hot", "trending", "popular", "flame", "burn"],
  water: ["liquid", "drop", "rain", "ocean", "hydrate"],
  leaf: ["nature", "plant", "eco", "green", "organic"],
  tree: ["nature", "plant", "forest", "branch", "growth"],
  flower: ["nature", "plant", "bloom", "garden", "rose"],
  mountain: ["nature", "landscape", "peak", "outdoor", "hike"],
  wave: ["ocean", "water", "sound", "signal", "hello"],
  snowflake: ["winter", "cold", "ice", "freeze", "weather"],
  umbrella: ["rain", "weather", "protection", "cover"],
  thermometer: ["temperature", "weather", "hot", "cold", "heat"],
  coffee: ["drink", "cafe", "cup", "beverage", "morning"],
  food: ["eat", "meal", "restaurant", "cuisine", "dish"],
  utensils: ["fork", "knife", "eat", "restaurant", "dining"],
  car: ["vehicle", "drive", "auto", "transport"],
  bus: ["vehicle", "transport", "public", "transit"],
  train: ["vehicle", "transport", "rail", "subway", "transit"],
  plane: ["flight", "travel", "airplane", "transport", "airport"],
  rocket: ["launch", "space", "fast", "startup", "boost"],
  anchor: ["link", "port", "marine", "stable", "dock"],
  navigation: ["compass", "direction", "guide", "route"],
  people: ["users", "group", "team", "community", "crowd"],
  accessibility: ["a11y", "inclusive", "universal", "disability"],
  translate: ["language", "i18n", "localize", "globe", "international"],
  command: ["cmd", "keyboard", "shortcut", "mac"],
  option: ["alt", "keyboard", "key", "modifier"],
  shift: ["keyboard", "key", "modifier", "uppercase"],
  control: ["ctrl", "keyboard", "key", "modifier"],
  enter: ["return", "submit", "confirm", "keyboard"],
  escape: ["exit", "close", "cancel", "keyboard", "esc"],
  delete: ["remove", "backspace", "clear", "erase"],
  space_key: ["blank", "keyboard", "spacebar"],
  text: ["type", "font", "content", "string", "abc"],
  number: ["digit", "numeric", "count", "hash", "integer"],
  qr: ["code", "scan", "barcode", "link"],
  scan: ["barcode", "qr", "read", "capture"],
  fingerprint: ["biometric", "identity", "auth", "secure", "touch"],
  face: ["biometric", "identity", "recognition", "person", "emoji"],
  voice: ["speech", "audio", "talk", "speak", "microphone"],
  ai: ["artificial", "intelligence", "machine", "learning", "smart"],
  api: ["interface", "endpoint", "rest", "connect", "integration"],
  webhook: ["callback", "event", "trigger", "api", "notify"],
  git: ["version", "branch", "commit", "repository", "source"],
  branch: ["git", "fork", "tree", "split", "diverge"],
  merge: ["combine", "join", "git", "union", "integrate"],
  commit: ["save", "git", "version", "snapshot"],
  pull: ["fetch", "download", "git", "request", "get"],
  push: ["upload", "publish", "git", "deploy", "send"],
  deploy: ["publish", "release", "launch", "ship", "live"],
  test: ["check", "verify", "validate", "quality", "spec"],
  debug: ["bug", "fix", "inspect", "troubleshoot", "diagnose"],
  log_file: ["record", "history", "trace", "output", "journal"],
  variable: ["var", "value", "property", "data", "binding"],
  function: ["method", "procedure", "lambda", "action", "routine"],
  component: ["module", "widget", "element", "part", "block"],
  block: ["square", "element", "section", "container", "brick"],
  snippet: ["code", "template", "fragment", "sample"],
  regex: ["pattern", "match", "search", "expression"],
  json: ["data", "format", "object", "config"],
  xml: ["data", "format", "markup", "config"],
  html: ["web", "markup", "page", "code"],
  css: ["style", "design", "web", "layout"],
  sparks: ["ai", "magic", "generate", "auto", "effect"],
  verified: ["check", "approved", "certified", "authentic", "badge"],
  certification: ["badge", "verified", "approved", "license"],
  document: ["file", "page", "paper", "doc", "text"],
  spreadsheet: ["excel", "table", "data", "grid", "csv"],
  presentation: ["slides", "powerpoint", "deck", "talk"],
  note: ["memo", "sticky", "reminder", "text", "jot"],
  clipboard: ["copy", "paste", "board", "task"],
  notification: ["bell", "alert", "badge", "push", "remind"],
  alert: ["warning", "notification", "attention", "error", "danger"],
  broadcast: ["live", "stream", "radio", "signal", "announce"],
  channel: ["stream", "feed", "topic", "communication"],
  conversation: ["chat", "discuss", "thread", "talk", "dialog"],
  comment: ["note", "remark", "feedback", "reply", "annotation"],
  reaction: ["emoji", "like", "response", "sentiment"],
  mention: ["at", "tag", "reference", "notify", "ping"],
  thread: ["conversation", "replies", "discuss", "chain"],
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDisplayName(filename: string): string {
  return filename
    .replace(/\.svg$/, "")
    .replace(/^_/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Compound word expansions for single-word icon names
const COMPOUND_EXPANSIONS: Record<string, string[]> = {
  lightbulb: ["light", "bulb", "idea", "bright", "lamp", "innovation", "creative", "thinking", "inspiration", "glow", "energy", "power", "suggestion", "tip", "hint"],
  bluetooth: ["wireless", "connect", "device", "pair", "signal", "radio", "communication", "network", "ble"],
  smartphone: ["mobile", "device", "phone", "cell", "cellular", "android", "iphone", "touchscreen", "app"],
  smartwatch: ["watch", "wearable", "time", "clock", "wrist", "device", "fitness", "health", "notification", "apple", "digital"],
  gamepad: ["game", "controller", "play", "joystick", "console", "gaming", "xbox", "playstation", "dualshock"],
  headphones: ["audio", "music", "listen", "earphones", "headset", "sound", "ear", "podcast", "hear"],
  paperclip: ["attach", "attachment", "clip", "file", "document", "fasten", "pin", "office"],
  bookmark: ["save", "favorite", "mark", "flag", "read", "later", "library", "page", "tag"],
  checkbox: ["check", "select", "option", "tick", "form", "input", "boolean", "toggle", "done"],
  dropdown: ["select", "menu", "options", "list", "combobox", "picker", "choose", "input", "form"],
  crosshair: ["target", "aim", "focus", "precision", "scope", "center", "reticle", "sight", "sniper"],
  fingerprint: ["biometric", "identity", "auth", "secure", "touch", "scan", "verify", "unique", "sensor", "id"],
  snowflake: ["winter", "cold", "ice", "freeze", "weather", "snow", "crystal", "frost", "cool", "holiday"],
  thermometer: ["temperature", "weather", "hot", "cold", "heat", "celsius", "fahrenheit", "measure", "fever", "climate"],
  spreadsheet: ["excel", "table", "data", "grid", "csv", "sheet", "cells", "rows", "columns", "numbers"],
  presentation: ["slides", "powerpoint", "deck", "talk", "pitch", "keynote", "slideshow", "present"],
  newspaper: ["news", "article", "press", "media", "blog", "journal", "headline", "read", "publication"],
  clipboard: ["copy", "paste", "board", "task", "list", "notes", "content", "buffer"],
  notification: ["bell", "alert", "badge", "push", "remind", "notify", "message", "update", "ping"],
  conversation: ["chat", "discuss", "thread", "talk", "dialog", "message", "communicate", "speak"],
  microphone: ["mic", "audio", "record", "voice", "speak", "sound", "input", "podcast", "sing"],
  loudspeaker: ["speaker", "audio", "sound", "volume", "announce", "broadcast", "amplify", "megaphone"],
  telescope: ["observe", "view", "distant", "space", "zoom", "astronomy", "lens", "explore", "far"],
  microscope: ["zoom", "science", "lab", "examine", "detail", "magnify", "research", "inspect", "analyze"],
  stopwatch: ["timer", "time", "speed", "race", "countdown", "measure", "clock", "performance", "benchmark"],
  hourglass: ["time", "wait", "loading", "timer", "patience", "sand", "countdown", "pending", "duration"],
  briefcase: ["work", "business", "job", "professional", "office", "career", "portfolio", "case"],
  backpack: ["bag", "school", "travel", "carry", "hike", "storage", "pack", "adventure"],
  suitcase: ["travel", "luggage", "trip", "vacation", "pack", "journey", "airport", "bag"],
  warehouse: ["storage", "inventory", "stock", "building", "logistics", "depot", "supply"],
  dashboard: ["analytics", "overview", "panel", "metrics", "stats", "monitor", "control", "summary"],
  thumbnail: ["preview", "image", "small", "gallery", "miniature", "icon", "snapshot"],
  screenshot: ["capture", "screen", "image", "snap", "record", "window", "picture"],
  timestamp: ["time", "date", "record", "log", "moment", "clock", "when"],
  workflow: ["process", "automation", "flow", "pipeline", "steps", "sequence", "task"],
  database: ["storage", "data", "server", "table", "sql", "query", "records", "schema", "db"],
  keyboard: ["type", "input", "keys", "shortcut", "hardware", "device", "typing"],
  voicemail: ["message", "voice", "phone", "audio", "recording", "inbox", "call"],
  megaphone: ["announce", "broadcast", "shout", "speaker", "marketing", "promotion", "loud"],
  stethoscope: ["medical", "doctor", "health", "diagnose", "heart", "hospital", "exam"],
  wheelchair: ["accessibility", "disability", "inclusive", "mobility", "aid", "a11y"],
  sunglasses: ["cool", "sun", "shade", "fashion", "summer", "bright", "protect", "uv"],
  umbrella: ["rain", "weather", "protection", "cover", "shade", "shelter", "wet"],
  eyedropper: ["color", "pick", "sample", "palette", "design", "dropper", "pipette"],
  paintbrush: ["paint", "draw", "art", "design", "brush", "stroke", "canvas", "creative"],
  screwdriver: ["tool", "fix", "repair", "hardware", "maintenance", "build", "screw"],
  wrench: ["tool", "settings", "fix", "repair", "maintenance", "configure", "adjust", "spanner"],
  flashlight: ["light", "torch", "bright", "dark", "illuminate", "beam", "search", "night"],
  satellite: ["space", "signal", "orbit", "communication", "gps", "broadcast", "antenna"],
  robot: ["ai", "bot", "automation", "machine", "artificial", "intelligence", "android", "mechanical", "assistant"],
  archive: ["store", "backup", "compress", "box", "history", "save", "old", "vault", "storage", "zip", "package"],
  calendar: ["date", "schedule", "event", "time", "planner", "month", "day", "week", "appointment", "organize"],
  settings: ["gear", "preferences", "config", "options", "cog", "configure", "adjust", "control", "setup", "admin"],
  sparkle: ["ai", "magic", "new", "star", "shine", "effect", "special", "highlight", "feature", "generate", "auto"],
  document: ["file", "page", "paper", "doc", "text", "content", "sheet", "write", "read", "report"],
  location: ["pin", "map", "place", "gps", "position", "address", "where", "coordinates", "marker"],
  download: ["save", "export", "get", "fetch", "receive", "pull", "file", "arrow", "import", "transfer"],
  upload: ["import", "share", "publish", "send", "push", "file", "arrow", "export", "transfer"],
  refresh: ["reload", "sync", "update", "rotate", "retry", "again", "restart", "renew", "cycle"],
  trash: ["delete", "remove", "discard", "bin", "garbage", "waste", "erase", "clear", "recycle", "destroy"],
  camera: ["photo", "picture", "capture", "snap", "record", "image", "shoot", "lens", "photography"],
  monitor: ["display", "screen", "desktop", "computer", "tv", "watch", "view", "output"],
};

// Category patterns using word-boundary matching against hyphenated words
// Each pattern matches against individual words in the icon name (split by "-")
const WORD_CATEGORY_TAGS: Record<string, string[]> = {
  arrow: ["navigation", "direction", "move", "pointer", "ui", "control"],
  chevron: ["navigation", "direction", "expand", "collapse", "ui", "control", "caret"],
  caret: ["navigation", "direction", "expand", "collapse", "ui", "control", "chevron"],
  circle: ["shape", "round", "ring", "dot", "badge", "indicator"],
  square: ["shape", "box", "rectangle", "block", "container"],
  triangle: ["shape", "play", "delta", "warning", "pointer"],
  chart: ["analytics", "data", "statistics", "visualization", "report", "metrics"],
  graph: ["analytics", "data", "statistics", "visualization", "report", "metrics"],
  bar: ["analytics", "data", "chart", "statistics"],
  pie: ["analytics", "data", "chart", "proportion"],
  align: ["text", "format", "layout", "editor", "paragraph", "typography"],
  justify: ["text", "format", "layout", "editor", "paragraph", "typography"],
  sort: ["organize", "list", "order", "arrange", "table", "data"],
  filter: ["organize", "list", "order", "refine", "narrow", "funnel"],
  grid: ["layout", "design", "structure", "template", "arrange", "ui"],
  layout: ["design", "structure", "template", "arrange", "ui", "grid"],
  column: ["layout", "grid", "table", "vertical", "ui"],
  columns: ["layout", "grid", "table", "vertical", "ui"],
  row: ["layout", "grid", "table", "horizontal", "ui"],
  rows: ["layout", "grid", "table", "horizontal", "ui"],
  lock: ["security", "protect", "safe", "auth", "access", "privacy", "password"],
  shield: ["security", "protect", "safe", "defense", "guard", "privacy"],
  key: ["security", "access", "auth", "password", "unlock", "credential"],
  user: ["account", "profile", "avatar", "member", "identity", "person", "people"],
  person: ["account", "profile", "avatar", "member", "identity", "user", "people"],
  people: ["account", "profile", "group", "team", "members", "users", "community"],
  users: ["account", "profile", "group", "team", "members", "people", "community"],
  mail: ["email", "message", "communication", "send", "receive", "letter", "envelope"],
  inbox: ["email", "message", "receive", "tray", "mail"],
  envelope: ["email", "message", "letter", "mail", "send"],
  folder: ["storage", "organize", "directory", "collection", "files", "browse"],
  file: ["storage", "organize", "document", "content", "save", "browse", "page"],
  document: ["file", "page", "paper", "text", "content", "write", "read"],
  page: ["file", "document", "content", "sheet", "paper"],
  play: ["media", "player", "audio", "video", "start", "begin", "run"],
  pause: ["media", "player", "audio", "video", "stop", "hold", "wait"],
  stop: ["media", "player", "end", "halt", "block"],
  skip: ["media", "player", "next", "forward", "jump"],
  rewind: ["media", "player", "back", "previous", "reverse"],
  volume: ["audio", "sound", "media", "speaker", "loud", "hear"],
  speaker: ["audio", "sound", "volume", "media", "hear", "listen"],
  mute: ["audio", "sound", "silent", "quiet", "off"],
  mic: ["audio", "sound", "microphone", "record", "voice", "speak"],
  cloud: ["storage", "upload", "online", "server", "sync", "saas", "internet"],
  phone: ["communication", "contact", "mobile", "device", "telephone", "call", "ring"],
  call: ["communication", "contact", "phone", "telephone", "ring"],
  bell: ["notification", "alert", "alarm", "ring", "notify", "reminder"],
  notification: ["alert", "bell", "remind", "update", "ping"],
  alert: ["warning", "notification", "attention", "caution", "danger"],
  heart: ["favorite", "like", "love", "health", "save", "rate"],
  star: ["favorite", "bookmark", "rating", "featured", "important", "rate", "like"],
  flag: ["report", "mark", "important", "bookmark", "country"],
  bookmark: ["save", "favorite", "mark", "read", "later", "library"],
  eye: ["visibility", "show", "hide", "watch", "see", "preview", "view", "observe"],
  edit: ["modify", "change", "update", "compose", "write", "pencil"],
  pen: ["edit", "write", "draw", "tool", "compose"],
  pencil: ["edit", "write", "draw", "tool", "compose"],
  search: ["find", "look", "query", "discover", "explore", "lookup", "magnify"],
  magnifying: ["search", "find", "look", "zoom", "inspect", "discover"],
  check: ["done", "complete", "success", "confirm", "approve", "valid", "tick"],
  verify: ["done", "complete", "success", "confirm", "approve", "valid", "certified"],
  close: ["dismiss", "cancel", "remove", "exit", "clear", "x"],
  x: ["close", "dismiss", "cancel", "remove", "clear", "delete", "cross"],
  plus: ["add", "create", "new", "insert", "more", "increase"],
  add: ["create", "new", "insert", "plus", "more"],
  minus: ["remove", "subtract", "reduce", "less", "decrease"],
  copy: ["duplicate", "clone", "clipboard", "replicate"],
  clipboard: ["copy", "paste", "board", "task"],
  duplicate: ["copy", "clone", "replicate"],
  link: ["connect", "url", "hyperlink", "attach", "chain", "reference"],
  chain: ["link", "connect", "url", "attach"],
  share: ["social", "distribute", "send", "forward", "export", "collaborate"],
  globe: ["international", "web", "language", "global", "world", "earth", "translate"],
  world: ["international", "web", "language", "global", "globe", "earth"],
  sun: ["light", "day", "bright", "weather", "mode", "theme"],
  moon: ["night", "dark", "mode", "sleep", "theme"],
  tag: ["label", "price", "category", "badge", "classify", "metadata"],
  label: ["tag", "category", "badge", "classify", "name"],
  badge: ["tag", "label", "count", "notification", "indicator"],
  image: ["photo", "picture", "media", "gallery", "visual", "graphic"],
  photo: ["image", "picture", "media", "gallery", "camera", "visual"],
  picture: ["image", "photo", "media", "gallery", "visual"],
  code: ["programming", "develop", "script", "engineering", "software", "brackets"],
  terminal: ["console", "command", "shell", "cli", "prompt", "code"],
  bracket: ["code", "programming", "syntax", "develop"],
  git: ["version", "source", "repository", "vcs", "development"],
  branch: ["git", "fork", "tree", "split", "diverge", "version"],
  merge: ["combine", "join", "git", "union", "integrate"],
  table: ["data", "grid", "cells", "database", "rows", "columns", "spreadsheet"],
  message: ["communication", "conversation", "text", "chat", "discuss", "reply"],
  chat: ["communication", "conversation", "message", "discuss", "talk"],
  comment: ["note", "remark", "feedback", "reply", "annotation", "discuss"],
  wifi: ["wireless", "network", "internet", "connection", "signal", "connectivity"],
  signal: ["wireless", "network", "connection", "strength", "antenna"],
  battery: ["charge", "power", "energy", "level", "status"],
  zap: ["lightning", "power", "energy", "fast", "electric", "bolt", "flash"],
  cursor: ["pointer", "mouse", "click", "select", "interact", "ui"],
  sidebar: ["layout", "navigation", "ui", "panel", "drawer"],
  panel: ["layout", "sidebar", "section", "drawer", "pane"],
  modal: ["dialog", "popup", "overlay", "alert", "window"],
  toggle: ["switch", "on", "off", "boolean", "control"],
  slider: ["range", "adjust", "control", "input", "value"],
  input: ["field", "text", "form", "entry", "data"],
  button: ["action", "submit", "cta", "press", "click"],
  loading: ["spinner", "progress", "wait", "busy"],
  spinner: ["loading", "progress", "wait", "rotate"],
  error: ["fail", "problem", "issue", "invalid", "red"],
  warning: ["alert", "caution", "attention", "exclamation", "danger"],
  success: ["done", "complete", "valid", "green", "pass"],
  crop: ["trim", "cut", "resize", "image", "adjust"],
  resize: ["scale", "adjust", "dimension", "transform", "size"],
  rotate: ["turn", "spin", "orientation", "flip", "angle"],
  zoom: ["magnify", "scale", "enlarge", "focus", "inspect"],
  save: ["store", "keep", "preserve", "disk", "floppy"],
  undo: ["back", "revert", "reverse", "history", "return"],
  redo: ["forward", "repeat", "again", "history"],
  bold: ["text", "format", "strong", "weight", "typography"],
  italic: ["text", "format", "emphasis", "slant", "typography"],
  underline: ["text", "format", "decoration", "typography"],
  strikethrough: ["text", "format", "delete", "line", "typography"],
  heading: ["text", "title", "header", "section", "h1"],
  list: ["items", "order", "organize", "menu", "bullet"],
  quote: ["cite", "reference", "text", "blockquote"],
  divider: ["separator", "line", "hr", "break", "section"],
  dollar: ["money", "currency", "price", "finance", "cost", "payment"],
  money: ["finance", "dollar", "currency", "payment", "cost"],
  payment: ["finance", "money", "dollar", "card", "billing"],
  wallet: ["money", "finance", "payment", "crypto", "funds"],
  credit: ["card", "payment", "money", "finance", "billing"],
  cart: ["shopping", "buy", "purchase", "ecommerce", "basket"],
  shop: ["store", "buy", "purchase", "ecommerce", "retail"],
  store: ["shop", "market", "retail", "buy", "ecommerce"],
  truck: ["delivery", "shipping", "transport", "vehicle", "logistics"],
  building: ["office", "company", "structure", "architecture", "place"],
  house: ["home", "building", "residence", "property"],
  home: ["house", "main", "start", "landing", "residence"],
  book: ["read", "education", "library", "documentation", "learn", "knowledge"],
  trophy: ["award", "achievement", "win", "prize", "cup", "competition"],
  medal: ["award", "achievement", "badge", "prize", "honor"],
  crown: ["king", "queen", "royal", "premium", "vip"],
  fire: ["hot", "trending", "popular", "flame", "burn", "urgent"],
  leaf: ["nature", "plant", "eco", "green", "organic", "environment"],
  tree: ["nature", "plant", "forest", "branch", "growth"],
  car: ["vehicle", "drive", "auto", "transport", "automobile"],
  rocket: ["launch", "space", "fast", "startup", "boost", "speed", "deploy"],
  anchor: ["link", "port", "marine", "stable", "dock", "fixed"],
  box: ["container", "package", "cube", "product", "3d"],
  package: ["box", "module", "library", "delivery", "npm", "ship"],
  cube: ["3d", "container", "box", "module", "product", "shape"],
  move: ["drag", "reorder", "rearrange", "position", "transfer"],
  external: ["link", "new", "window", "tab", "outside", "redirect"],
  maximize: ["fullscreen", "expand", "enlarge", "resize", "window"],
  minimize: ["shrink", "collapse", "reduce", "resize", "window"],
  expand: ["enlarge", "grow", "maximize", "open", "more"],
  collapse: ["shrink", "minimize", "close", "fold", "less"],
  text: ["typography", "content", "string", "write", "characters", "font"],
  hash: ["number", "tag", "pound", "hashtag", "channel"],
  percent: ["discount", "ratio", "proportion", "sale", "rate"],
  logo: ["brand", "company", "identity", "trademark"],
  markdown: ["md", "format", "text", "markup", "document", "readme"],
  download: ["save", "export", "get", "fetch", "receive", "arrow"],
  upload: ["import", "share", "publish", "send", "push", "arrow"],
  refresh: ["reload", "sync", "update", "rotate", "retry"],
  trash: ["delete", "remove", "discard", "bin", "garbage", "erase"],
  delete: ["remove", "trash", "erase", "clear", "destroy"],
  archive: ["store", "backup", "compress", "box", "history", "vault"],
  clock: ["time", "schedule", "timer", "hour", "watch", "duration", "countdown"],
  watch: ["time", "clock", "wearable", "timer", "hour", "timepiece", "wrist"],
  calendar: ["date", "schedule", "event", "time", "planner", "month", "day", "appointment"],
  camera: ["photo", "picture", "capture", "snap", "record", "image", "lens"],
  monitor: ["display", "screen", "desktop", "computer", "tv", "view"],
  window: ["browser", "app", "frame", "panel", "desktop"],
  tab: ["browser", "page", "switch", "panel"],
  dock: ["pin", "attach", "fix", "position", "taskbar"],
  pin: ["location", "map", "marker", "place", "attach", "fix"],
  map: ["location", "navigation", "place", "geography", "directions"],
  compass: ["navigation", "direction", "explore", "orient"],
  sparkle: ["ai", "magic", "new", "star", "shine", "effect", "generate"],
  sparks: ["ai", "magic", "generate", "auto", "effect"],
  robot: ["ai", "bot", "automation", "machine", "artificial", "intelligence"],
  brain: ["ai", "intelligence", "think", "smart", "mind", "cognitive"],
  target: ["goal", "aim", "focus", "crosshair", "bullseye"],
  record: ["capture", "save", "dot", "red", "audio", "video"],
  space: ["blank", "empty", "gap", "whitespace"],
  wrap: ["text", "line", "break", "overflow"],
  paragraph: ["text", "block", "content", "body"],
  plug: ["connect", "plugin", "power", "extension"],
  wrench: ["tool", "settings", "fix", "repair", "maintenance"],
  hammer: ["tool", "build", "construct", "fix"],
  gift: ["present", "reward", "surprise", "offer"],
  receipt: ["invoice", "bill", "transaction", "purchase"],
  hospital: ["health", "medical", "emergency", "care"],
  school: ["education", "learn", "study", "academic"],
  newspaper: ["news", "article", "press", "media", "blog"],
  film: ["movie", "cinema", "video", "media", "reel"],
  tv: ["television", "screen", "monitor", "display", "media"],
  gamepad: ["game", "controller", "play", "joystick", "console"],
  diamond: ["gem", "premium", "valuable", "jewel"],
  water: ["liquid", "drop", "rain", "ocean"],
  flower: ["nature", "plant", "bloom", "garden"],
  mountain: ["nature", "landscape", "peak", "outdoor"],
  wave: ["ocean", "water", "sound", "signal"],
  snowflake: ["winter", "cold", "ice", "freeze", "weather"],
  umbrella: ["rain", "weather", "protection", "cover"],
  coffee: ["drink", "cafe", "cup", "beverage", "morning"],
  car: ["vehicle", "drive", "auto", "transport"],
  bus: ["vehicle", "transport", "public", "transit"],
  train: ["vehicle", "transport", "rail", "subway"],
  plane: ["flight", "travel", "airplane", "transport"],
  accessibility: ["a11y", "inclusive", "universal", "disability"],
  translate: ["language", "i18n", "localize", "globe", "international"],
  command: ["cmd", "keyboard", "shortcut", "mac"],
  option: ["alt", "keyboard", "key", "modifier"],
  shift: ["keyboard", "key", "modifier", "uppercase"],
  control: ["ctrl", "keyboard", "key", "modifier"],
  enter: ["return", "submit", "confirm", "keyboard"],
  escape: ["exit", "close", "cancel", "keyboard", "esc"],
  fingerprint: ["biometric", "identity", "auth", "secure", "touch"],
  face: ["biometric", "identity", "recognition", "person", "emoji"],
  voice: ["speech", "audio", "talk", "speak", "microphone"],
  ai: ["artificial", "intelligence", "machine", "learning", "smart"],
  api: ["interface", "endpoint", "rest", "connect", "integration"],
  webhook: ["callback", "event", "trigger", "api", "notify"],
  deploy: ["publish", "release", "launch", "ship", "live"],
  test: ["check", "verify", "validate", "quality", "spec"],
  debug: ["bug", "fix", "inspect", "troubleshoot"],
  regex: ["pattern", "match", "search", "expression"],
  json: ["data", "format", "object", "config"],
  html: ["web", "markup", "page", "code"],
  css: ["style", "design", "web", "layout"],
  verified: ["check", "approved", "certified", "authentic"],
  seal: ["verified", "approved", "official", "stamp", "certificate"],
  note: ["memo", "sticky", "reminder", "text", "jot"],
  broadcast: ["live", "stream", "radio", "signal", "announce"],
  thread: ["conversation", "replies", "discuss", "chain"],
  rect: ["rectangle", "shape", "box", "frame"],
  slash: ["disabled", "off", "blocked", "crossed", "forbidden"],
  circle: ["shape", "round", "ring", "dot"],
  squares: ["grid", "multiple", "tiles", "blocks", "windows"],
  lines: ["horizontal", "menu", "list", "hamburger", "text"],
  dots: ["more", "ellipsis", "options", "overflow", "menu"],
};

function generateTags(name: string): string[] {
  const cleanName = name.replace(/^_/, "");
  const words = cleanName.split("-");
  const tags = new Set<string>(words);

  // Add the full name as a tag
  tags.add(cleanName);

  // Add joined form (e.g. "arrow-left" -> "arrowleft")
  if (words.length > 1) {
    tags.add(words.join(""));
  }

  // Check word-level expansions from TAG_EXPANSIONS
  for (const word of words) {
    const expansions = TAG_EXPANSIONS[word];
    if (expansions) {
      for (const tag of expansions) {
        tags.add(tag);
      }
    }
  }

  // Check compound word expansions (for single-word names like "lightbulb")
  const compound = COMPOUND_EXPANSIONS[cleanName];
  if (compound) {
    for (const tag of compound) {
      tags.add(tag);
    }
  }

  // Check word-level category tags (safe, no substring matching)
  for (const word of words) {
    const categoryTags = WORD_CATEGORY_TAGS[word];
    if (categoryTags) {
      for (const tag of categoryTags) {
        tags.add(tag);
      }
    }
  }

  // Also check the full name as a compound in WORD_CATEGORY_TAGS
  const fullCategoryTags = WORD_CATEGORY_TAGS[cleanName];
  if (fullCategoryTags) {
    for (const tag of fullCategoryTags) {
      tags.add(tag);
    }
  }

  // Add general UI tag for common patterns
  if (/^(arrow|chevron|caret|corner)/.test(cleanName)) {
    tags.add("ui");
    tags.add("interface");
  }

  // Ensure minimum 10 tags by adding contextual generic tags
  if (tags.size < 10) {
    const genericContextual = [
      "icon", "ui", "interface", "design", "graphic", "symbol", "visual",
      "element", "component", "asset",
    ];
    for (const tag of genericContextual) {
      if (tags.size >= 10) break;
      tags.add(tag);
    }
  }

  return Array.from(tags).sort();
}

function extractUnicodeMappings(
  fontPath: string
): Record<string, string> | null {
  try {
    const font = opentype.loadSync(fontPath);
    const mapping: Record<string, string> = {};

    for (let i = 0; i < font.glyphs.length; i++) {
      const glyph = font.glyphs.get(i);
      if (glyph.name && glyph.unicode !== undefined && glyph.unicode > 0x20) {
        // Normalize glyph name to match our icon filenames
        const name = glyph.name.replace(/_/g, "-").toLowerCase();
        mapping[name] = glyph.unicode.toString(16).toUpperCase().padStart(4, "0");
      }
    }

    return mapping;
  } catch (e) {
    console.warn(`Could not parse font: ${fontPath}`, e);
    return null;
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log("Generating icon data...\n");

  // Load existing tags if they exist
  let existingTags: Record<string, string[]> = {};
  if (fs.existsSync(TAGS_FILE)) {
    existingTags = JSON.parse(fs.readFileSync(TAGS_FILE, "utf-8"));
    console.log(
      `Loaded ${Object.keys(existingTags).length} existing tag entries`
    );
  }

  // Try to load user-provided mapping first, fall back to font extraction
  let unicodeMapping: Record<string, string> = {};

  if (fs.existsSync(MAPPING_FILE)) {
    console.log("Loading Unicode mapping from mapping.json...");
    const raw: Record<string, number> = JSON.parse(fs.readFileSync(MAPPING_FILE, "utf-8"));
    for (const [name, codepoint] of Object.entries(raw)) {
      unicodeMapping[name] = codepoint.toString(16).toUpperCase().padStart(4, "0");
    }
    console.log(`Loaded ${Object.keys(unicodeMapping).length} mappings`);
  } else {
    // Extract from TTF files
    const outlineTtf = path.join(
      FONTS_DIR,
      "16/outline/Cursor Icons Outline.ttf"
    );
    const filledTtf = path.join(
      FONTS_DIR,
      "16/filled/Cursor Icons Filled.ttf"
    );

    if (fs.existsSync(outlineTtf)) {
      console.log("Extracting Unicode mappings from outline font...");
      const mapping = extractUnicodeMappings(outlineTtf);
      if (mapping) {
        Object.assign(unicodeMapping, mapping);
        console.log(`Extracted ${Object.keys(mapping).length} mappings`);
      }
    }
    if (fs.existsSync(filledTtf)) {
      console.log("Extracting Unicode mappings from filled font...");
      const mapping = extractUnicodeMappings(filledTtf);
      if (mapping) {
        // Only add if not already present from outline
        for (const [k, v] of Object.entries(mapping)) {
          if (!unicodeMapping[k]) unicodeMapping[k] = v;
        }
      }
    }
  }

  console.log(
    `Total Unicode mappings: ${Object.keys(unicodeMapping).length}\n`
  );

  // Scan icons from 16px folders (they define the icon set)
  const sizes = ["16", "24"] as const;
  const styles = ["filled", "outline"] as const;

  // Get all unique icon names from 16px folders
  const iconNames = new Set<string>();
  for (const style of styles) {
    const dir = path.join(ICONS_DIR, "16", style);
    if (fs.existsSync(dir)) {
      for (const file of fs.readdirSync(dir)) {
        if (file.endsWith(".svg") && !file.startsWith(".")) {
          iconNames.add(file.replace(/\.svg$/, ""));
        }
      }
    }
  }

  console.log(`Found ${iconNames.size} unique icons\n`);

  // Build icon data
  const icons = Array.from(iconNames)
    .sort()
    .map((name) => {
      const displayName = toDisplayName(name + ".svg");

      // Read SVG content for each size/style combo
      const svg: Record<string, Record<string, string | null>> = {};
      for (const size of sizes) {
        svg[size] = {};
        for (const style of styles) {
          const filePath = path.join(ICONS_DIR, size, style, `${name}.svg`);
          if (fs.existsSync(filePath)) {
            svg[size][style] = fs
              .readFileSync(filePath, "utf-8")
              .trim()
              .replace(/fill="#1B1B1B"/gi, 'fill="currentColor"')
              .replace(/stroke="#1B1B1B"/gi, 'stroke="currentColor"');
          } else {
            svg[size][style] = null;
          }
        }
      }

      // Get or generate tags
      const tags = existingTags[name] || generateTags(name);

      // Lookup unicode
      const unicode = unicodeMapping[name] || null;

      return {
        name,
        displayName,
        tags,
        unicode,
        svg,
      };
    });

  // Save tags (preserve existing, add new)
  const allTags: Record<string, string[]> = { ...existingTags };
  let newTagCount = 0;
  for (const icon of icons) {
    if (!allTags[icon.name]) {
      allTags[icon.name] = icon.tags;
      newTagCount++;
    }
  }

  // Sort tags file by key
  const sortedTags: Record<string, string[]> = {};
  for (const key of Object.keys(allTags).sort()) {
    sortedTags[key] = allTags[key];
  }

  fs.writeFileSync(TAGS_FILE, JSON.stringify(sortedTags, null, 2) + "\n");
  console.log(
    `Tags: ${Object.keys(sortedTags).length} total, ${newTagCount} new`
  );

  // Write output
  const output = { icons, generatedAt: new Date().toISOString() };
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2) + "\n");
  console.log(`\nWrote ${icons.length} icons to ${OUTPUT_FILE}`);
}

main();
