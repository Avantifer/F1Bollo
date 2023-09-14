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
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;


@CrossOrigin(origins = "https://formulabollo.es")
@RestController
@RequestMapping(path = {"/archives"}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Archives", description = "Operations related with files")
public class ArchiveController {
    
    @Autowired
    private ArchiveRepository archiveRepository;
    
    @Autowired
    private ArchiveMapper archiveMapper;
    
    @Operation(summary = "Get statute", tags = "Archives")
    @GetMapping("/statute")
    public ArchiveDTO getStatute() {
        Log.info("START - getStatute - START");
        
        Archive statute = archiveRepository.findByDefinition("Statute").get(0);
        ArchiveDTO statuteDTO = archiveMapper.archiveToArchiveDTO(statute);

        Log.info("END - getStatute - END");
        
        return statuteDTO;
    }

    @Operation(summary = "Save statute", tags = "Archives")
    @PutMapping(path = "/statute/save", produces = MediaType.TEXT_PLAIN_VALUE, consumes = "application/json")
    public ResponseEntity<String> saveStatute(@RequestBody ArchiveDTO archiveDTO) {
        Log.info("START - saveStatute - START");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);

        try {
            Archive statuteOld = archiveRepository.findByDefinition("Statute").get(0);
            Archive statuteNew = archiveMapper.archiveDTOToArchive(archiveDTO);
            statuteNew.setId(statuteOld.getId());

            archiveRepository.save(statuteNew);
        } catch (DataAccessException e) {
            Log.error("Error inesperado", e);
            return new ResponseEntity<>("Hubo un problema con la base de datos", headers, HttpStatusCode.valueOf(500));
        }    

        Log.info("END - saveStatute - END");

        return new ResponseEntity<>("Estatuto guardado correctamente", headers, HttpStatusCode.valueOf(200));
    }
}
