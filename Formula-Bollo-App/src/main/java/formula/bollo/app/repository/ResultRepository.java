package formula.bollo.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.Result;

public interface ResultRepository extends JpaRepository<Result, Long> {
    
}
