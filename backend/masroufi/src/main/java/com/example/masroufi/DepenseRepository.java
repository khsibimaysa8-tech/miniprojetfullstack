package com.example.masroufi;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepenseRepository extends JpaRepository<Depense, Long> {
    // les dépenses mte3 user, men l ajdid lel a9dam
    List<Depense> findByUserIdOrderByDateDesc(Long userId);
}