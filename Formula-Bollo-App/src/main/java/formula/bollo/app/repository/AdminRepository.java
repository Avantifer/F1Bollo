package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    List<Admin> findByUsername(String username); 
}
