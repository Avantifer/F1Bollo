package formula.bollo.app.mapper;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Result;
import formula.bollo.app.model.ResultDTO;

@Component
public interface ResultMapper {
    
    ResultMapper INSTANCE = Mappers.getMapper(ResultMapper.class);

    Result resultDTOToResult(ResultDTO resultDTO);

    ResultDTO resultToResultDTO(Result result);
}
