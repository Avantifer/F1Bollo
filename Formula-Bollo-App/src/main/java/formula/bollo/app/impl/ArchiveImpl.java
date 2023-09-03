package formula.bollo.app.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;

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
     * Map archiveDTO to return an object type Archive
     * @param archiveDTO
     * @exception SQLException Cannot do something with the db
     * @exception IllegalArgumentException Cannot convert string to byte[]
     * @return class Archive with ArchiveDTO properties
    */
    @Override
    public Archive archiveDTOToArchive(ArchiveDTO archiveDTO) {
        Archive archive = new Archive();

        try {
            BeanUtils.copyProperties(archiveDTO, archive);

            byte[] decodedByte = Base64.getDecoder().decode(archiveDTO.getFile());
            Blob file = new SerialBlob(decodedByte);
            archive.setFile(file);
        } catch (SQLException | IllegalArgumentException e) {
            Log.error("No se ha podido obtener el blob de base64: ", e);
        }

        return archive;
    }

    /**
     * Map Archive to return an object type ArchiveDTO
     * @param archive
     * @exception SQLException Cannot do something with the db
     * @return class ArchiverDTO with Archive properties
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
