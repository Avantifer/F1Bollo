package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.config.JwtConfig;
import formula.bollo.app.entity.Admin;
import formula.bollo.app.mapper.AdminMapper;
import formula.bollo.app.model.AdminDTO;
import formula.bollo.app.repository.AdminRepository;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@CrossOrigin(origins = "https://formulabollo.es")
@RestController
@RequestMapping(path = {"/admin"}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Admin", description = "Operations related with admins")
public class AdminController {
    
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private JwtConfig jwtConfig;

    @Operation(summary = "Login user admin", tags = "Admin")
    @PostMapping(path = "/login", produces = MediaType.TEXT_PLAIN_VALUE, consumes = "application/json")
    public ResponseEntity<String> login(@RequestBody AdminDTO adminUser) {
        Log.info("START - login - START");
        Log.info("RequestBody login -> " + adminUser.toString());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);

        List<Admin> admin = adminRepository.findByUsername(adminUser.getUsername());
        
        if (admin.isEmpty() || !new BCryptPasswordEncoder().matches(adminUser.getPassword(), admin.get(0).getPassword())) {
            return new ResponseEntity<>("No hay usuario con esas credenciales", headers, HttpStatusCode.valueOf(500));
        }

        AdminDTO adminDTO = adminMapper.adminToAdminDTO(admin.get(0));
        adminDTO.setPassword("");
        
        String token = jwtConfig.generateToken(adminDTO);
        

        Log.info("END - login - END");
        
        return new ResponseEntity<>(token, headers, HttpStatusCode.valueOf(200));
    }
}
