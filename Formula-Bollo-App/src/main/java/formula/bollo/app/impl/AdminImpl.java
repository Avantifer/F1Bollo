package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Configuration;

import formula.bollo.app.entity.Admin;
import formula.bollo.app.mapper.AdminMapper;
import formula.bollo.app.model.AdminDTO;

@Configuration
public class AdminImpl implements AdminMapper {

    /**
     * Map AdminDTO to return an object type Admin
     * @param AdminDTO
     * @return class Admin with AdminDTO properties
    */
    @Override
    public Admin adminDTOToAdmin(AdminDTO adminDTO) {
        Admin admin = new Admin();
        BeanUtils.copyProperties(adminDTO, admin);

        return admin;
    }

    /**
     * Map AdminDTO to return an object type Admin
     * @param AdminDTO
     * @return class Admin with AdminDTO properties
    */
    @Override
    public AdminDTO adminToAdminDTO(Admin admin) {
        AdminDTO adminDTO = new AdminDTO();
        BeanUtils.copyProperties(admin, adminDTO);

        return adminDTO;
    }
    
}
