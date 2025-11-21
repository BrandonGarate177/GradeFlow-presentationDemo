# GradeFlow - Presentation Demo

An AI-powered presentation preparation and grading tool that helps users improve their public speaking skills through real-time feedback and analysis.

## Demo Video

https://github.com/user-attachments/assets/d55ef95e-49d3-4f32-8b0a-c48d9e2ecbb0

*Note: The audio gets quite low during parts of the recording - please adjust your volume accordingly.*

## Overview

Training platform that combines Google Slides integration with advanced AI analysis to provide detailed feedback on presentation delivery. The application records your presentation audio, analyzes various aspects of your speech, and generates actionable feedback to help you improve.

### Key Features

- **Real-time Audio Recording**: Seamlessly record your presentation while viewing your slides
- **Multi-dimensional Analysis**: Get scored feedback on:
  - Clarity and articulation
  - Presentation structure
  - Delivery and confidence
  - Pacing and timing
  - Filler word usage
- **AI-Generated Feedback**: Receive detailed strengths, areas for improvement, and suggested scripts
- **Google Slides Integration**: Present directly within the app using embedded slides
- **TTS Model Delivery**: Generate example audio using ElevenLabs Text-to-Speech
- **Responsive Interface**: Clean, modern UI built with Next.js and Tailwind CSS

## Architecture

This is a full-stack application built as a monorepo:

### Frontend (Next.js + TypeScript + Tailwind)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Audio Recording**: MediaRecorder API for browser-based recording
- **Google Slides**: Embedded iframe integration
- **State Management**: React hooks with local state

### Backend (Go)
- **Runtime**: Go 1.21+ with modern HTTP server
- **APIs**: RESTful endpoints for presentation grading
- **AI Integration**: 
  - OpenAI GPT for presentation analysis
  - ElevenLabs for text-to-speech synthesis
- **Audio Processing**: WebM audio file handling
- **Architecture**: Clean architecture with dependency injection

## Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - Modern React with hooks

### Backend
- **Go 1.21+** - High-performance backend language
- **OpenAI API** - GPT models for presentation analysis
- **ElevenLabs API** - Advanced text-to-speech synthesis
- **Standard Library** - Minimal dependencies for reliability

### Infrastructure
- **Docker** - Containerized deployment
- **Google Cloud Run** - Serverless container deployment
- **GitHub Actions** - CI/CD pipeline (deployment script included)

## Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Go 1.21+**
- **OpenAI API key** (for presentation analysis)
- **ElevenLabs API key** (for TTS generation)

### Environment Setup

1. **Clone the repository**:
```bash
git clone https://github.com/BrandonGarate177/GradeFlow-presentationDemo.git
cd GradeFlow-presentationDemo
```

2. **Set up environment variables**:
```bash
# Backend environment variables
export ELEVENLABS_API_KEY="your_elevenlabs_api_key"
export OPENAI_API_KEY="your_openai_api_key"
export PORT="8080"
export HOST="localhost"

# Frontend environment variables
export NEXT_PUBLIC_BACKEND_URL="http://localhost:8080"
```

### Running the Application

1. **Start the backend**:
```bash
cd backend
go build ./cmd/server
./server
# Server starts on http://localhost:8080
```

2. **Start the frontend** (in a new terminal):
```bash
cd frontend
npm ci
npm run dev
# Frontend starts on http://localhost:3000
```

3. **Configure Google Slides**:
   - Update the `SLIDE_ID` placeholder in `frontend/src/components/SlidesViewer.tsx`
   - Use a publicly published Google Slides presentation ID

## Project Structure

```
GradeFlow-presentationDemo/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js 13+ app router
│   │   ├── components/      # React components
│   │   └── lib/            # API client and utilities
│   └── package.json
├── backend/                 # Go backend application
│   ├── cmd/server/         # Application entry point
│   ├── internal/           # Internal packages
│   │   ├── config/         # Configuration management
│   │   ├── http/           # HTTP handlers and routing
│   │   ├── models/         # Data models
│   │   └── services/       # Business logic services
│   └── go.mod
├── docker/                 # Docker configuration
├── deploy.sh              # Deployment script for Google Cloud
└── README.md
```

## API Endpoints

- **POST /grade-presentation** - Upload audio and receive grading analysis
- **GET /health** - Health check endpoint

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **OpenAI** for GPT-based presentation analysis
- **ElevenLabs** for high-quality text-to-speech synthesis
- **Google Slides** for presentation embedding capabilities
