package com.healthcare.repository;

import com.healthcare.model.KnowledgeDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface KnowledgeDocumentRepository extends JpaRepository<KnowledgeDocument, Long> {

    List<KnowledgeDocument> findByCategory(String category);

    @Query("SELECT k FROM KnowledgeDocument k WHERE " +
           "LOWER(k.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(k.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(k.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<KnowledgeDocument> searchByKeyword(@Param("keyword") String keyword);
}
