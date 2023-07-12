package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    List<Admin> findByUsername(String username); 
}
