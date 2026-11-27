package com.example.masroufi;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    // Spring ykawwen l requête wa7dou men esm l méthode
    User findByEmail(String email);
}