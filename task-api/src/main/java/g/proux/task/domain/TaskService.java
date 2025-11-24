package g.proux.task.domain;

import g.proux.task.controller.dto.CreationTaskFormDTO;
import g.proux.task.controller.dto.TaskDTO;
import g.proux.task.mapper.TaskMapper;
import g.proux.task.provider.data.entity.Task;
import g.proux.task.provider.data.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

import static g.proux.task.provider.data.repository.TaskSpecs.isCompleted;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    private final TaskMapper taskMapper;

    public List<TaskDTO> getTasks(Boolean completed) {
        List<Task> tasks;
        if (completed == null) {
            tasks = taskRepository.findAll();
        } else {
            tasks = taskRepository.findAll(isCompleted(completed));
        }
        return tasks.stream().map(taskMapper::toDTO).toList();
    }

    public TaskDTO createTask(CreationTaskFormDTO form) {
        Task task = taskMapper.creationFormToEntity(form);
        task = taskRepository.save(task);
        return taskMapper.toDTO(task);
    }
}
