package com.example.masroufi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/depenses")
@CrossOrigin(origins = "http://localhost:4200")
public class DepenseController {

    @Autowired
    private DepenseRepository depenseRepository;

    // GET /api/depenses/user/1  → kol dépenses mte3 user 1
    @GetMapping("/user/{userId}")
    public List<Depense> getByUser(@PathVariable Long userId) {
        return depenseRepository.findByUserIdOrderByDateDesc(userId);
    }

    // POST /api/depenses → ajout
    @PostMapping
    public Depense ajouter(@RequestBody Depense depense) {
        return depenseRepository.save(depense);
    }

    // PUT /api/depenses/5 → modification
    @PutMapping("/{id}")
    public Depense modifier(@PathVariable Long id, @RequestBody Depense depense) {
        depense.setId(id);   // nخلliw nafs l id → save = update
        return depenseRepository.save(depense);
    }

    // DELETE /api/depenses/5 → suppression
    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        depenseRepository.deleteById(id);
    }
}