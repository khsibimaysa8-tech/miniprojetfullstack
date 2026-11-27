package com.example.masroufi;

import jakarta.persistence.*;
import lombok.Data;

@Data                      // Lombok : ykhalaq getters/setters wa7dou
@Entity                    // = table f MySQL
@Table(name = "users")     // "user" mot réservé, donc "users"
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // auto-increment
    private Long id;

    private String nom;
    private String email;
    private String password;
    private double salaire;   // salaire mensuel en DT
}