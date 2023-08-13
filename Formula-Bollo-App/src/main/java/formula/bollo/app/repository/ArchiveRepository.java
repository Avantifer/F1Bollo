package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.Archive;

public interface ArchiveRepository extends JpaRepository<Archive, Long> {
    List<Archive> findByDefinition(String definition); 
}
