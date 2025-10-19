# DocuMind - AI PDF Intelligence
DocuMind is a React-based web application that allows users to upload PDF documents, automatically extract text, generate AI-powered summaries (brief, detailed, and bullet-point), and interact with the content via a chat interface. It provides an intuitive dashboard to manage and explore uploaded documents.


Features

1. Upload PDFs: Drag-and-drop or browse files to upload PDF documents.
2. Automatic Text Extraction: Extracts text content from uploaded PDFs.
3. AI Summarization: Generate brief summaries, detailed summaries, and bullet-point key points.
4. Document Dashboard: View all uploaded documents, filter by status, and search documents.
5. Document Chat: Ask questions about the content of your documents (via AI assistant).
6. Download PDFs: Download the original uploaded PDF.
7. Status Tracking: Track document processing status (processing, ready, error).
8. Responsive Design: Works on both desktop and mobile devices.


src/
├─ api/
│  └─ base44Client.js          # API integration for file uploads and AI calls
├─ components/
│  ├─ dashboard/
│  │  ├─ DocumentCard.jsx      # Card component for individual documents
│  │  └─ EmptyState.jsx        # Component for empty search or dashboard
│  ├─ DocumentHeader.jsx       # Header for document view
│  └─ SummaryPanel.jsx         # Tabs panel for summaries
├─ pages/
│  ├─ Dashboard.jsx            # Dashboard page
│  ├─ UploadPage.jsx           # Upload page with drag-and-drop and progress
│  └─ Layout.jsx               # Layout component with sidebar navigation
├─ schemas/
│  ├─ Document.schema.json     # JSON schema for document object
│  └─ ChatMessage.schema.json  # JSON schema for chat messages
├─ utils/
│  └─ utils.js                 # Utility functions like createPageUrl
└─ App.jsx                      # Main application entry


Technologies Used

1. React.js – Frontend library
2. React Router DOM – Routing
3. Framer Motion – Animations
4. Tailwind CSS – Styling
5. Lucide-react – Icons
6. Shadcn/UI – UI components (Sidebar, Cards, Tabs)
7. date-fns – Date formatting
8. React Query – Server state management and API caching


JSON Schemas

1. Document.schema.json – Defines structure of documents with properties like title, file_url, summaries, status, etc.
2. ChatMessage.schema.json – Defines structure of chat messages with document reference, role, content, and timestamp.


How It Works

1. User uploads a PDF via the Upload Page.
2. File is sent to the backend/API (base44) for extraction.
3. Extracted text is processed by an AI LLM to generate:
   1. Brief summary (2-3 sentences)
   2. Detailed summary
   3. Bullet-point summary
4. The document is saved, and its status updates to ready.
5. Users can view documents in the Dashboard, search/filter, and download the original PDF.
6. Users can also chat with the document content (if implemented).


Future Improvements:

1. Implement document chat interface to ask questions directly from PDFs.
2. Add authentication for multiple users.
3. Implement PDF page preview.
4. Enhance AI summarization with more advanced prompts and options.
5. Add PDF annotation features.


License
This project is licensed under the MIT License.
