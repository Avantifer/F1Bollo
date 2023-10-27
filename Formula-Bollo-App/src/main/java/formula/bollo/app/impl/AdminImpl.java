package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Configuration;

import formula.bollo.app.entity.Admin;
import formula.bollo.app.mapper.AdminMapper;
import formula.bollo.app.model.AdminDTO;

@Configuration
public class AdminImpl implements AdminMapper {

    /**
     * Converts an AdminDTO object to an Admin object.
     *
     * @param adminDTO The AdminDTO object to be converted.
     * @return         An Admin object with properties copied from the AdminDTO.
    */
    @Override
    public Admin adminDTOToAdmin(AdminDTO adminDTO) {
        Admin admin = new Admin();
        BeanUtils.copyProperties(adminDTO, admin);

        return admin;
    }

    /**
     * Converts an Admin object to an AdminDTO object.
     *
     * @param admin The Admin object to be converted.
     * @return      An AdminDTO object with properties copied from the Admin.
    */
    @Override
    public AdminDTO adminToAdminDTO(Admin admin) {
        AdminDTO adminDTO = new AdminDTO();
        BeanUtils.copyProperties(admin, adminDTO);

        return adminDTO;
    }
}
