package com.example.masroufi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")   // yسمah l Angular
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // POST /api/users/inscription
    @PostMapping("/inscription")
    public ResponseEntity<?> inscription(@RequestBody User user) {
        // email déjà utilisé ?
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email déjà utilisé"));
        }
        return ResponseEntity.ok(userRepository.save(user));
    }

    // POST /api/users/connexion
    @PostMapping("/connexion")
    public ResponseEntity<?> connexion(@RequestBody User login) {
        User user = userRepository.findByEmail(login.getEmail());
        if (user == null || !user.getPassword().equals(login.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Email ou mot de passe incorrect"));
        }
        return ResponseEntity.ok(user);   // nرجّعou l user lel Angular
    }
}