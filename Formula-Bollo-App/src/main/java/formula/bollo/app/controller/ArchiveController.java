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

import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;


@CrossOrigin(origins = "https://formulabollo.es")
@RestController
@RequestMapping(path = {"/archives"}, produces = MediaType.APPLICATION_JSON_VALUE)
public class ArchiveController {
    
    @Autowired
    private ArchiveRepository archiveRepository;

    @Autowired
    private ArchiveMapper archiveMapper;

    @Operation(summary = "Get statute")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Statute successfully obtained"),
        @ApiResponse(code = 404, message = "Statute cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/statute")
    public ArchiveDTO getStatute() {
        Log.info("START - getStatute - START");
        
        Archive statute = archiveRepository.findByDefinition("Statute").get(0);
        ArchiveDTO statuteDTO = archiveMapper.archiveToArchiveDTO(statute);

        Log.info("END - getStatute - END");
        
        return statuteDTO;
    }

    @Operation(summary = "Save statute")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Statute successfully saved"),
        @ApiResponse(code = 404, message = "Statute cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @PutMapping("/statute/save")
    public ResponseEntity<String> saveStatute(@RequestBody ArchiveDTO archiveDTO) {
        Log.info("START - saveStatute - START");

        try {
            Archive statuteOld = archiveRepository.findByDefinition("Statute").get(0);
            Archive statuteNew = archiveMapper.archiveDTOToArchive(archiveDTO);
            statuteNew.setId(statuteOld.getId());

            archiveRepository.saveAndFlush(statuteNew);
        } catch (DataAccessException e) {
            Log.error("Error inesperado", e);
            return new ResponseEntity<>("Hubo un problema con la base de datos", HttpStatus.INTERNAL_SERVER_ERROR);
        }    

        Log.info("END - saveStatute - END");

        return new ResponseEntity<>("Estatuto guardado correctamente", HttpStatus.OK);
    }
}
