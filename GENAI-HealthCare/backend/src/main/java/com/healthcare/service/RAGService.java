package com.healthcare.service;

import com.healthcare.model.KnowledgeDocument;
import com.healthcare.repository.KnowledgeDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RAGService {

    @Autowired
    private KnowledgeDocumentRepository knowledgeDocumentRepository;

    @Autowired
    private GeminiService geminiService;

    // Split document into 500-char overlapping chunks
    public List<String> chunkDocument(String content) {
        List<String> chunks = new ArrayList<>();
        int chunkSize = 500;
        int overlap = 100;
        int start = 0;
        while (start < content.length()) {
            int end = Math.min(start + chunkSize, content.length());
            chunks.add(content.substring(start, end));
            start += chunkSize - overlap;
        }
        return chunks;
    }

    // Store document with chunks
    public KnowledgeDocument storeDocument(String title, String category, String content, String uploadedBy) {
        List<String> chunks = chunkDocument(content);
        String chunksJoined = String.join("|||", chunks);

        KnowledgeDocument doc = new KnowledgeDocument();
        doc.setTitle(title);
        doc.setCategory(category);
        doc.setContent(content);
        doc.setChunks(chunksJoined);
        doc.setUploadedBy(uploadedBy);
        return knowledgeDocumentRepository.save(doc);
    }

    // Retrieve relevant chunks based on query keywords
    public String retrieveRelevantContext(String query) {
        String[] keywords = query.toLowerCase().split("\\s+");
        Set<String> relevantChunks = new LinkedHashSet<>();

        for (String keyword : keywords) {
            if (keyword.length() < 4) continue; // skip short words
            List<KnowledgeDocument> docs = knowledgeDocumentRepository.searchByKeyword(keyword);
            for (KnowledgeDocument doc : docs) {
                if (doc.getChunks() != null) {
                    for (String chunk : doc.getChunks().split("\\|\\|\\|")) {
                        if (chunk.toLowerCase().contains(keyword)) {
                            relevantChunks.add("[" + doc.getTitle() + "]: " + chunk.trim());
                        }
                    }
                }
            }
        }

        if (relevantChunks.isEmpty()) return null;

        // Return top 3 most relevant chunks
        return relevantChunks.stream().limit(3).collect(Collectors.joining("\n\n"));
    }

    // RAG-enhanced query: retrieve context + inject into LLM prompt
    public String ragQuery(String userQuery) {
        String context = retrieveRelevantContext(userQuery);

        String prompt;
        if (context != null && !context.isEmpty()) {
            prompt = String.format(
                "You are a medical AI assistant. Use the following retrieved medical knowledge to answer the question accurately.\n\n" +
                "RETRIEVED MEDICAL KNOWLEDGE:\n%s\n\n" +
                "USER QUESTION: %s\n\n" +
                "Answer based on the retrieved knowledge above. If the knowledge doesn't cover the question, say so and provide general guidance.\n" +
                "Keep the response clear, concise, and in plain text without markdown symbols.",
                context, userQuery
            );
        } else {
            prompt = String.format(
                "You are a medical AI assistant. No specific knowledge base documents were found for this query.\n\n" +
                "USER QUESTION: %s\n\n" +
                "Provide a helpful general medical response. Keep it clear and in plain text without markdown symbols.",
                userQuery
            );
        }

        return geminiService.generateContent(prompt);
    }

    public List<KnowledgeDocument> getAllDocuments() {
        return knowledgeDocumentRepository.findAll();
    }

    public void deleteDocument(Long id) {
        knowledgeDocumentRepository.deleteById(id);
    }
}
