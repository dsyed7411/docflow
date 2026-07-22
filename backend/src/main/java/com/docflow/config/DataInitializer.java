package com.docflow.config;

import com.docflow.entity.Document;
import com.docflow.entity.DocumentShare;
import com.docflow.entity.User;
import com.docflow.repository.DocumentRepository;
import com.docflow.repository.DocumentShareRepository;
import com.docflow.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final DocumentShareRepository documentShareRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DocumentRepository documentRepository,
                           DocumentShareRepository documentShareRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
        this.documentShareRepository = documentShareRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        logger.info("Initializing demo seed data...");

        User alice = userRepository.findByEmail("alice@example.com").orElseGet(() -> {
            User user = User.builder()
                    .name("Alice")
                    .email("alice@example.com")
                    .password(passwordEncoder.encode("Password123"))
                    .role("ROLE_USER")
                    .createdAt(LocalDateTime.now())
                    .build();
            return userRepository.save(user);
        });

        User bob = userRepository.findByEmail("bob@example.com").orElseGet(() -> {
            User user = User.builder()
                    .name("Bob")
                    .email("bob@example.com")
                    .password(passwordEncoder.encode("Password123"))
                    .role("ROLE_USER")
                    .createdAt(LocalDateTime.now())
                    .build();
            return userRepository.save(user);
        });

        if (documentRepository.count() == 0) {
            // Seed sample document for Alice
            Document aliceDoc = Document.builder()
                    .title("Welcome to DocFlow")
                    .content("{\"type\":\"doc\",\"content\":[{\"type\":\"heading\",\"attrs\":{\"level\":1},\"content\":[{\"type\":\"text\",\"text\":\"Welcome to DocFlow Workspaces! 🚀\"}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"DocFlow is a modern collaborative document workspace designed for speed, clarity, and ease of use.\"}]},{\"type\":\"bulletList\",\"content\":[{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"marks\":[{\"type\":\"bold\"}],\"text\":\"Rich Formatting: \"},{\"type\":\"text\",\"text\":\"Bold, italics, headings, and bullet points persistence.\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"marks\":[{\"type\":\"bold\"}],\"text\":\"Instant Sharing: \"},{\"type\":\"text\",\"text\":\"Share documents seamlessly with colleagues by email.\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"marks\":[{\"type\":\"bold\"}],\"text\":\"Smart Autosave: \"},{\"type\":\"text\",\"text\":\"Changes save automatically after 2 seconds of inactivity.\"}]}]}]}]}")
                    .owner(alice)
                    .createdAt(LocalDateTime.now().minusHours(2))
                    .updatedAt(LocalDateTime.now().minusMinutes(30))
                    .build();
            aliceDoc = documentRepository.save(aliceDoc);

            // Share Alice's document with Bob
            documentShareRepository.save(DocumentShare.builder()
                    .document(aliceDoc)
                    .user(bob)
                    .build());

            // Seed sample document for Bob
            Document bobDoc = Document.builder()
                    .title("Project Roadmap Q3")
                    .content("{\"type\":\"doc\",\"content\":[{\"type\":\"heading\",\"attrs\":{\"level\":1},\"content\":[{\"type\":\"text\",\"text\":\"Project Roadmap Q3\"}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Key milestones for product rollout:\"}]},{\"type\":\"orderedList\",\"content\":[{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Complete API security audit.\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Finalize rich text editor integration.\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Deploy production backend to Render and database to Supabase.\"}]}]}]}]}")
                    .owner(bob)
                    .createdAt(LocalDateTime.now().minusHours(5))
                    .updatedAt(LocalDateTime.now().minusHours(1))
                    .build();
            documentRepository.save(bobDoc);
        }

        logger.info("Demo seed data initialized successfully.");
    }
}
