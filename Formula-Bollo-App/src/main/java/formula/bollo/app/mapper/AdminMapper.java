package formula.bollo.app.mapper;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Admin;
import formula.bollo.app.model.AdminDTO;

@Component
public interface AdminMapper {
    
    AdminMapper INSTANCE = Mappers.getMapper(AdminMapper.class);

    Admin adminDTOToAdmin(AdminDTO adminDTO);

    AdminDTO adminToAdminDTO(Admin admin);
}
