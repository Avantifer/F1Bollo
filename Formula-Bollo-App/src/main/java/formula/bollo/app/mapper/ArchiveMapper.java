package formula.bollo.app.mapper;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Archive;
import formula.bollo.app.model.ArchiveDTO;

@Component
public interface ArchiveMapper {
    
    ArchiveMapper INSTANCE = Mappers.getMapper(ArchiveMapper.class);

    Archive archiveDTOToArchive(ArchiveDTO archiveDTO);

    ArchiveDTO archiveToArchiveDTO(Archive archive);
}

