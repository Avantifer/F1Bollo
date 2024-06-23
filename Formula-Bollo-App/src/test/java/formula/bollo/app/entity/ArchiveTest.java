package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.sql.SQLException;
import java.util.Arrays;
import java.sql.Blob;

import javax.sql.rowset.serial.SerialBlob;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.ArchiveDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class ArchiveTest {
    
    @Test
    void testArchiveAnnotations() throws SQLException {
        Blob fileBlob = new SerialBlob(new byte[]{1, 2, 3, 4});

        Archive archive = new Archive();
        archive.setId(1L);
        archive.setFile(fileBlob);
        archive.setExtension("pdf");
        archive.setDefinition("document.pdf");

        // @Getter
        assertEquals(1L, archive.getId());
        assertEquals(fileBlob, archive.getFile());
        assertEquals("pdf", archive.getExtension());
        assertEquals("document.pdf", archive.getDefinition());

        // @Setter
        Blob newFileBlob = new SerialBlob(new byte[]{5, 6, 7, 8});
        archive.setFile(newFileBlob);
        archive.setExtension("docx");
        archive.setDefinition("document.docx");

        assertEquals(newFileBlob, archive.getFile());
        assertEquals("docx", archive.getExtension());
        assertEquals("document.docx", archive.getDefinition());

        // @ToString
        String expectedToString = "Archive(id=1, file=" + newFileBlob + ", extension=docx, definition=document.docx)";
        assertEquals(expectedToString, archive.toString());

        // @AllArgsConstructor
        Archive allArgsConstructor = new Archive(1L, newFileBlob, "docx", "document.docx");
        assertEquals(archive, allArgsConstructor);

        // @NoArgsConstructor
        Archive noArgsConstructor = new Archive();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Archive.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testArchiveDTOAnnotations() {
        // @NoArgsConstructor
        ArchiveDTO noArgsConstructorDTO = new ArchiveDTO();
        assertNotNull(noArgsConstructorDTO);

        // @AllArgsConstructor
        byte[] file = new byte[]{1, 2, 3};
        ArchiveDTO allArgsConstructorDTO = new ArchiveDTO(1L, file, "txt", "Archivo de texto");
        assertEquals(1L, allArgsConstructorDTO.getId());
        assertArrayEquals(file, allArgsConstructorDTO.getFile());
        assertEquals("txt", allArgsConstructorDTO.getExtension());
        assertEquals("Archivo de texto", allArgsConstructorDTO.getDefinition());

        // @Getter
        assertEquals(1L, allArgsConstructorDTO.getId());
        assertArrayEquals(file, allArgsConstructorDTO.getFile());
        assertEquals("txt", allArgsConstructorDTO.getExtension());
        assertEquals("Archivo de texto", allArgsConstructorDTO.getDefinition());

        // @Setter
        byte[] newFile = new byte[]{4, 5, 6};
        allArgsConstructorDTO.setFile(newFile);
        allArgsConstructorDTO.setExtension("pdf");
        allArgsConstructorDTO.setDefinition("Archivo PDF");

        assertArrayEquals(newFile, allArgsConstructorDTO.getFile());
        assertEquals("pdf", allArgsConstructorDTO.getExtension());
        assertEquals("Archivo PDF", allArgsConstructorDTO.getDefinition());

        // @ToString
        String expectedToString = "ArchiveDTO(id=1, file=" + Arrays.toString(newFile) + ", extension=pdf, definition=Archivo PDF)";
        assertEquals(expectedToString, allArgsConstructorDTO.toString());

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(ArchiveDTO.class).verify();
    }
}
