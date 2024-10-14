# EngageAI-AISummary

## Introduction
JambaMini AI Summary Generator is a Node.js application that leverages AWS Bedrock's ai21.j2-mid-v1 model to summarize input text into concise key points and generate clear section headlines. The application sends text prompts to the Bedrock service and retrieves summarized responses, which are styled in the console using the chalk library for better readability.

## Features
- **AI-Powered Summarization**: Uses AWS Bedrock's ai21.j2-mid-v1 model to summarize input text into structured key points with headlines.
- **Customizable Prompts**: Easily modify the input prompt to fit your use case, such as summaries, text generation, or other tasks.
- **Console Styling**: Output is styled using the chalk library for color-coded display, making results more readable.
- **Error Handling**: Basic error handling ensures that any issues with the model invocation are logged.

## Prerequisites
Before setting up the project, ensure you have the following installed:
- Node.js (version 20.x or higher)
- npm (usually comes with Node.js)
- Configured AWS CLI with appropriate AWS credentials.

## Installation
To get started with the JambaMini AI Summary Generator, follow these steps:

```bash
git clone https://github.com/codeztech-atique/EngageAI-AISummary.git
cd EngageAI-AISummary
npm install
```

## Usage
Run the sentiment analysis tool using:
```bash
node index.js
```

