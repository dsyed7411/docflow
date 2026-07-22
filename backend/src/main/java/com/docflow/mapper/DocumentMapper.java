package com.docflow.mapper;

import com.docflow.dto.DocumentDTO;
import com.docflow.dto.UserDTO;
import com.docflow.entity.Document;
import com.docflow.entity.User;
import com.docflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DocumentMapper {

    private final UserMapper userMapper;
    private final UserRepository userRepository;

    public DocumentMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
        this.userRepository = null;
    }

    @Autowired
    public DocumentMapper(UserMapper userMapper, UserRepository userRepository) {
        this.userMapper = userMapper;
        this.userRepository = userRepository;
    }

    public DocumentDTO toDTO(Document document, User currentAuthUser, List<User> sharedUsers) {
        if (document == null) {
            return null;
        }

        User owner = document.getOwner();
        if (owner != null && (owner.getName() == null || owner.getEmail() == null) && userRepository != null) {
            owner = userRepository.findById(owner.getId()).orElse(owner);
        }
        if (currentAuthUser != null && owner != null && owner.getId().equals(currentAuthUser.getId())) {
            owner = currentAuthUser;
        }

        boolean isOwner = currentAuthUser != null && owner != null && owner.getId().equals(currentAuthUser.getId());
        List<UserDTO> sharedWithDTOs = sharedUsers != null ? sharedUsers.stream().map(userMapper::toDTO).toList() : List.of();

        return DocumentDTO.builder()
                .id(document.getId())
                .title(document.getTitle())
                .content(document.getContent())
                .owner(userMapper.toDTO(owner))
                .sharedWith(sharedWithDTOs)
                .isOwner(isOwner)
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .build();
    }
}
