package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Archive;
import formula.bollo.app.mapper.ArchiveMapper;
import formula.bollo.app.model.ArchiveDTO;
import formula.bollo.app.repository.ArchiveRepository;
import formula.bollo.app.utils.Log;

import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

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
        @ApiResponse(code = 200, message = "Teams successfully obtained"),
        @ApiResponse(code = 404, message = "Teams cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/statute")
    public ArchiveDTO getStatuteDTO() {
        Log.info("START - getStatuteDTO - START");
        
        Archive statute = archiveRepository.findByDefinition("Statute").get(0);
        ArchiveDTO statuteDTO = archiveMapper.archiveToArchiveDTO(statute);

        Log.info("END - getAllTeams - END");
        
        return statuteDTO;
    }
}
