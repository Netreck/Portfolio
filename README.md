# Interactive Portfolio 

This project is my personal developer portfolio built with an interactive **RAG-powered chatbot** that allows visitors to explore my professional background, projects, and experience in a dynamic way.

Instead of just reading static information, users can **ask questions about my career, skills, and projects**, and the chatbot answers using **Retrieval-Augmented Generation (RAG)** based on my resume and project documentation.

---
<img width="660" height="296" alt="image" src="https://github.com/user-attachments/assets/ee9a16e6-7e22-4a6d-868b-b570f2da60f6" />

---
## Features

- 🤖 **AI Chatbot with RAG**
  - Answers questions about my professional experience
  - Uses my **resume and project information as knowledge base**
  - Provides contextual answers based on retrieved data

- 📄 **Project Pages**
  - Dedicated pages describing my main projects
  - Technical explanations, goals, and outcomes

- 💡 **Interactive Portfolio**
  - Visitors can explore my work through conversation
  - Makes the portfolio more engaging and informative

- 📄 **CI/CD**
  - Project objective is get as close as a prod enviroment
  - CI/CD configured using github actions
  - Dev and Prod enviroments
---

## 🧠 How the Chatbot Works
<img width="1396" height="934" alt="image" src="https://github.com/user-attachments/assets/4d9ade40-abce-47e6-b111-0d69a4d7abe8" />

The chatbot is built using a **Retrieval-Augmented Generation (RAG)** architecture:

1. My **resume and project descriptions** are loaded into a knowledge base
2. The content is **split into chunks and converted into embeddings**
3. These embeddings are stored in a **vector database**
4. When a user asks a question:
   - The system retrieves the most relevant chunks
   - The retrieved context is sent to the LLM
   - The model generates a response grounded in my data

---
## 🛠️ CI/CD

   CI/CD using github actions and triggerend by commits and PR. Two enviroments setup hosted in my HomeLab , Dev for testing and developing of new features and Prod always active and stable.
   example: 
   <img width="796" height="836" alt="image" src="https://github.com/user-attachments/assets/995fe9ba-65a0-4752-9831-a44ddc04ad65" />



---
## 🛠️ Technologies Used

- LLM API
- RAG (Retrieval-Augmented Generation)
- Vector Database
- Embeddings
- Modern Web Framework
- Frontend UI for chatbot interaction
- Github Actions
