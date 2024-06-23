package formula.bollo.app.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.ArchiveDTO;

import formula.bollo.app.repository.ArchiveRepository;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;


@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class ArchiveControllerTest {
    
    @Autowired
    private ArchiveController archiveController;

    @Mock
    private ArchiveRepository archiveRepository;
    
    @Test
    @DirtiesContext
    void getStatuteEmpty() {
        ArchiveDTO archiveDTO = archiveController.getStatute();
        assertNull(archiveDTO);
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/archive/insertArchive.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getStatuteNotEmpty() {
        ArchiveDTO archiveDTO = archiveController.getStatute();
        assertNotNull(archiveDTO);
        assertEquals("Statute", archiveDTO.getDefinition());
        assertEquals("application/pdf", archiveDTO.getExtension());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/archive/insertArchive.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void saveWithOldStatute() {
        ArchiveDTO archiveNew = new ArchiveDTO(2L, new byte[0], "application/jpeg", "Statute");
        ResponseEntity<String> response = this.archiveController.saveStatute(archiveNew);
        assertEquals("Estatuto guardado correctamente", response.getBody());

        ArchiveDTO archiveToCheck = this.archiveController.getStatute();
        assertNotNull(archiveToCheck);
        assertEquals(1L, archiveToCheck.getId());
        assertEquals("application/jpeg", archiveToCheck.getExtension());
    }

    @Test
    @DirtiesContext
    void saveWithoutOldStatute() {
        ArchiveDTO archiveNew = new ArchiveDTO(1L, new byte[0], "application/pdf", "Statute");
        ResponseEntity<String> response = this.archiveController.saveStatute(archiveNew);
        assertEquals("Estatuto guardado correctamente", response.getBody());

        ArchiveDTO archiveToCheck = this.archiveController.getStatute();
        assertNotNull(archiveToCheck);
        assertEquals("application/pdf", archiveToCheck.getExtension());
    }
}
