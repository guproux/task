package g.proux.task.domain;

import g.proux.task.controller.dto.CreationTaskFormDTO;
import g.proux.task.controller.dto.TaskDTO;
import g.proux.task.controller.dto.UpdateTaskFormDTO;
import g.proux.task.controller.exception.NotFoundException;
import g.proux.task.domain.exception.TaskNotFoundException;
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
        Task task = taskMapper.toTaskToCreate(form);
        task = taskRepository.save(task);
        return taskMapper.toDTO(task);
    }

    public TaskDTO getOneTask(Long taskID) {
        try {
            return taskMapper.toDTO(getTaskById(taskID));
        } catch (TaskNotFoundException ex) {
            throw new NotFoundException(ex.getMessage(), ex);
        }
    }

    public TaskDTO updateTaskStatus(Long taskID, UpdateTaskFormDTO form) {
        try {
            Task task = getTaskById(taskID);
            task = taskMapper.toUpdatedTask(task, form);
            return taskMapper.toDTO(taskRepository.save(task));
        } catch (TaskNotFoundException ex) {
            throw new NotFoundException(ex.getMessage(), ex);
        }
    }

    private Task getTaskById(Long taskID) throws TaskNotFoundException {
        return taskRepository.findById(taskID).orElseThrow(() -> {
            String errMsg = String.format("No task was found with %s ID", taskID);
            log.error(errMsg);
            return new TaskNotFoundException(errMsg, "GET_TASK_NOT_FOUND");
        });
    }
}
