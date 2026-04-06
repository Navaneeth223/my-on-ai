export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  content: string;
}

export interface FileAttachment {
  name: string;
  type: string;
  content: string;
  size: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  sources?: SearchResult[] | null;
  fileData?: FileAttachment | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  userId?: string | null;
  messages: Message[];
  pinned: boolean;
  model: string;
  systemPrompt?: string | null;
  temperature: number;
  createdAt: string;
  updatedAt: string;
}

export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  details?: {
    family?: string;
    parameter_size?: string;
    quantization_level?: string;
    format?: string;
  };
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  defaultModel: string;
  defaultSystemPrompt: string;
}

export interface ChatStore {
  currentConversationId: string | null;
  conversations: Conversation[];
  messages: Message[];
  isLoading: boolean;
  isSearchEnabled: boolean;
  selectedModel: string;
  systemPrompt: string;
  temperature: number;
  uploadedFile: FileAttachment | null;
  sidebarOpen: boolean;
  setCurrentConversationId: (id: string | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string, sources?: SearchResult[]) => void;
  setIsLoading: (value: boolean) => void;
  toggleSearch: () => void;
  setModel: (model: string) => void;
  setSystemPrompt: (prompt: string) => void;
  setTemperature: (value: number) => void;
  setUploadedFile: (file: FileAttachment | null) => void;
  toggleSidebar: () => void;
  clearMessages: () => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
}
