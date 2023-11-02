package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import formula.bollo.app.entity.Archive;
import formula.bollo.app.mapper.ArchiveMapper;
import formula.bollo.app.model.ArchiveDTO;
import formula.bollo.app.repository.ArchiveRepository;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;


@CrossOrigin(origins = Constants.PRODUCTION_FRONTEND)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_ARCHIVES}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_ARCHIVE, description = Constants.TAG_ARCHIVE_SUMMARY)
public class ArchiveController {
    
    private ArchiveRepository archiveRepository;
    
    private ArchiveMapper archiveMapper;

    public ArchiveController(ArchiveRepository archiveRepository, ArchiveMapper archiveMapper) {
        this.archiveRepository = archiveRepository;
        this.archiveMapper = archiveMapper;
    }
    
    @Operation(summary = "Get statute", tags = Constants.TAG_ARCHIVE)
    @GetMapping("/statute")
    public ArchiveDTO getStatute() {
        Log.info("START - getStatute - START");
        
        ArchiveDTO statuteDTO = null;
        List<Archive> statute = archiveRepository.findByDefinition("Statute");

        if (statute.isEmpty()) return statuteDTO;
        statuteDTO = archiveMapper.archiveToArchiveDTO(statute.get(0));
 
        Log.info("END - getStatute - END");
        
        return statuteDTO;
    }

    @Operation(summary = "Save statute", tags = Constants.TAG_ARCHIVE)
    @PutMapping(path = "/statute/save", produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveStatute(@RequestBody ArchiveDTO archiveDTO) {
        Log.info("START - saveStatute - START");

        try {
            List<Archive> statuteOld = archiveRepository.findByDefinition("Statute");
            Archive statuteNew = archiveMapper.archiveDTOToArchive(archiveDTO);

            if (!statuteOld.isEmpty()) {
                statuteNew.setId(statuteOld.get(0).getId());
                archiveRepository.save(statuteNew);
            }
        } catch (DataAccessException e) {
            Log.error(Constants.ERROR_UNEXPECTED, e);
            return new ResponseEntity<>(Constants.ERROR_BBDD_GENERIC, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        }

        Log.info("END - saveStatute - END");

        return new ResponseEntity<>("Estatuto guardado correctamente", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(200));
    }
}
