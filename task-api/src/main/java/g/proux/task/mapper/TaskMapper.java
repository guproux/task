package g.proux.task.mapper;

import g.proux.task.controller.dto.CreationTaskFormDTO;
import g.proux.task.controller.dto.TaskDTO;
import g.proux.task.provider.data.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TaskMapper {

    TaskDTO toDTO(Task task);

    @Mapping(target = "completed", constant = "false")
    Task creationFormToEntity(CreationTaskFormDTO task);

}
