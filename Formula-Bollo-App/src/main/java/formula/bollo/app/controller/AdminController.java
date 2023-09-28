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
import formula.bollo.app.services.AdminService;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@CrossOrigin(origins = Constants.URL_FRONTED)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_ADMIN}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_ADMIN, description = Constants.TAG_ADMIN_SUMMARY)
public class AdminController {
    
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private JwtConfig jwtConfig;

    @Autowired
    private AdminService adminService;

    @Operation(summary = "Login user admin", tags = Constants.TAG_ADMIN)
    @PostMapping(path = "/login", produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> login(@RequestBody AdminDTO adminUser) {
        Log.info("START - login - START");
        Log.info("RequestBody login -> " + adminUser.toString());

        List<Admin> admin = adminRepository.findByUsername(adminUser.getUsername());
        Boolean goodCredentials = this.adminService.checkUserCredentials(adminUser, admin);

        if (!goodCredentials) return new ResponseEntity<>(Constants.ERROR_INVALID_CREDENTIALS, HttpStatusCode.valueOf(500));

        AdminDTO adminDTO = adminMapper.adminToAdminDTO(admin.get(0));
        String token = jwtConfig.generateToken(adminDTO);
        
        Log.info("END - login - END");
        
        return new ResponseEntity<>(token, HttpStatusCode.valueOf(200));
    }
}
