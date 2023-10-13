package formula.bollo.app.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Archive;
import formula.bollo.app.mapper.ArchiveMapper;
import formula.bollo.app.model.ArchiveDTO;
import formula.bollo.app.utils.Log;

@Component
public class ArchiveImpl implements ArchiveMapper {


    /**
     * Converts an ArchiveDTO object to an Archive object.
     *
     * @param archiveDTO The ArchiveDTO object to be converted.
     * @return           An Archive object with properties copied from the ArchiveDTO.
    */
    @Override
    public Archive archiveDTOToArchive(ArchiveDTO archiveDTO) {
        Archive archive = new Archive();

        try {
            BeanUtils.copyProperties(archiveDTO, archive);
            Blob file = new SerialBlob(archiveDTO.getFile());
            archive.setFile(file);
        } catch (SQLException | IllegalArgumentException e) {
            Log.error("No se ha podido obtener el blob de base64: ", e);
        }

        return archive;
    }

    /**
     * Converts an Archive object to an ArchiveDTO object.
     *
     * @param archive The Archive object to be converted.
     * @return        An ArchiveDTO object with properties copied from the Archive.
    */
    @Override
    public ArchiveDTO archiveToArchiveDTO(Archive archive) {
        ArchiveDTO archiveDTO = new ArchiveDTO();
        BeanUtils.copyProperties(archive, archiveDTO);

        try (InputStream inputStream = archive.getFile().getBinaryStream(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int bytesRead;

            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }

            archiveDTO.setFile(outputStream.toByteArray());
        } catch (SQLException | IOException e) {
            Log.error("No se ha podido obtener la base64 del blob: ", e);
        }

        return archiveDTO;
    }
}
