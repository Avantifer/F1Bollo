package formula.bollo.app.services;


import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Admin;
import formula.bollo.app.model.AdminDTO;

@Service
public class AdminService {
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Checks if the provided admin's credentials match those stored in the database.
     *
     * @param admin    The admin whose credentials need to be checked.
     * @param adminBD  The list of admin records from the database.
     * @return         True if the credentials match, false otherwise.
    */
    public boolean checkUserCredentials(AdminDTO admin, List<Admin> adminBD) {
        if (adminBD == null || adminBD.isEmpty()) return false;
        return passwordEncoder.matches(admin.getPassword(), adminBD.get(0).getPassword());
    }
}

