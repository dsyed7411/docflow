package com.docflow.controller;

import com.docflow.dto.ProfileDTO;
import com.docflow.security.UserPrincipal;
import com.docflow.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileDTO> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(profileService.getProfile(currentUser));
    }
}
