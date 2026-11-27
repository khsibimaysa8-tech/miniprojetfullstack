package com.example.masroufi;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class Depense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double montant;
    private String description;
    private String categorie;   // Alimentation, Transport, Café...
    private LocalDate date;     // JSON : "2026-11-27"
    private Long userId;        // à qui appartient la dépense
}