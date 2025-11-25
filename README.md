# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running Locally

To run this project on your local machine or in a codespace, follow these steps:

### 1. Install Dependencies

First, you need to install the necessary npm packages. Open your terminal in the project's root directory and run:

```bash
npm install
```

### 2. Set Up Environment Variables (Optional)

This project uses Genkit for AI features, which connects to the Google AI (Gemini) API. To use these features, you'll need to provide an API key.

1.  Create a new file named `.env.local` in the root of the project.
2.  Add your API key to this file:

```
GEMINI_API_KEY=your_google_ai_api_key_here
```

You can get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Run the Development Server

Once the dependencies are installed, you can start the Next.js development server.

```bash
npm run dev
```

This will start the application, and you can view it in your browser at the local address provided in the terminal (usually `http://localhost:9002`). The app will automatically reload if you make any changes to the code.
