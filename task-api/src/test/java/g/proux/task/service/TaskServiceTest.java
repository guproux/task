package g.proux.task.service;

import g.proux.task.controller.dto.CreationTaskFormDTO;
import g.proux.task.controller.dto.TaskDTO;
import g.proux.task.controller.exception.NotFoundException;
import g.proux.task.domain.TaskService;
import g.proux.task.domain.exception.TaskNotFoundException;
import g.proux.task.mapper.TaskMapper;
import g.proux.task.provider.data.entity.Task;
import g.proux.task.provider.data.repository.TaskRepository;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @InjectMocks
    private TaskService taskService;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskMapper taskMapper;

    @Test
    public void testGetTasks_nullCompleted() {
        Task task1 = new Task(1L, "Tâche 1", "Description 1", false);
        Task task2 = new Task(2L, "Tâche 2", "Description 2", false);
        Task task3 = new Task(3L, "Tâche 3", "Description 3", true);
        List<Task> taskList = Arrays.asList(task1, task2, task3);

        when(taskRepository.findAll()).thenReturn(taskList);

        TaskDTO taskDTO1 = new TaskDTO(1L, "Tâche 1", "Description 1", false);
        TaskDTO taskDTO2 = new TaskDTO(2L, "Tâche 2", "Description 2", false);
        TaskDTO taskDTO3 = new TaskDTO(3L, "Tâche 3", "Description 3", true);
        when(taskMapper.toDTO(task1)).thenReturn(taskDTO1);
        when(taskMapper.toDTO(task2)).thenReturn(taskDTO2);
        when(taskMapper.toDTO(task3)).thenReturn(taskDTO3);

        List<TaskDTO> result = taskService.getTasks(null);

        verify(taskRepository).findAll();

        verify(taskMapper, times(3)).toDTO(any(Task.class));

        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals("Tâche 1", result.get(0).label());
        assertEquals("Tâche 2", result.get(1).label());
        assertEquals("Tâche 3", result.get(2).label());
    }

    @Test
    public void testGetTasks_falseCompleted() {
        Task task1 = new Task(1L, "Tâche 1", "Description 1", false);
        Task task2 = new Task(2L, "Tâche 2", "Description 2", false);
        List<Task> taskList = Arrays.asList(task1, task2);

        when(taskRepository.findAll(any(Specification.class))).thenReturn(taskList);

        TaskDTO taskDTO1 = new TaskDTO(1L, "Tâche 1", "Description 1", false);
        TaskDTO taskDTO2 = new TaskDTO(2L, "Tâche 2", "Description 2", false);
        when(taskMapper.toDTO(task1)).thenReturn(taskDTO1);
        when(taskMapper.toDTO(task2)).thenReturn(taskDTO2);

        List<TaskDTO> result = taskService.getTasks(false);

        verify(taskRepository).findAll(any(Specification.class));

        verify(taskMapper, times(2)).toDTO(any(Task.class));

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Tâche 1", result.get(0).label());
        assertEquals("Tâche 2", result.get(1).label());
    }

    @Test
    public void testGetTasks_trueCompleted() {
        Task task3 = new Task(3L, "Tâche 3", "Description 3", true);
        List<Task> taskList = Collections.singletonList(task3);

        when(taskRepository.findAll(any(Specification.class))).thenReturn(taskList);

        TaskDTO taskDTO3 = new TaskDTO(3L, "Tâche 3", "Description 3", true);
        when(taskMapper.toDTO(task3)).thenReturn(taskDTO3);

        List<TaskDTO> result = taskService.getTasks(true);

        verify(taskRepository).findAll(any(Specification.class));

        verify(taskMapper).toDTO(any(Task.class));

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Tâche 3", result.get(0).label());
    }

    @Test
    void testCreateTask() {
        CreationTaskFormDTO form = new CreationTaskFormDTO("Nouvelle tâche", "Description de la tâche");

        Task taskEntity = new Task(1L, "Nouvelle tâche", "Description de la tâche", false);

        TaskDTO expectedDTO = new TaskDTO(1L, "Nouvelle tâche", "Description de la tâche", false);

        when(taskMapper.creationFormToEntity(form)).thenReturn(taskEntity);
        when(taskRepository.save(taskEntity)).thenReturn(taskEntity);
        when(taskMapper.toDTO(taskEntity)).thenReturn(expectedDTO);

        TaskDTO result = taskService.createTask(form);

        verify(taskMapper).creationFormToEntity(form);
        verify(taskRepository).save(taskEntity);
        verify(taskMapper).toDTO(taskEntity);

        assertNotNull(result);
        assertEquals(1L, result.id());
        assertEquals("Nouvelle tâche", result.label());
        assertEquals("Description de la tâche", result.description());
    }

    @SneakyThrows
    @Test
    void getOneTask_nominalCase() {
        Long id = 1L;
        Task task = new Task(id, "Label", "Description", false);
        TaskDTO dto = new TaskDTO(id, "Label", "Description", false);

        when(taskRepository.findById(id)).thenReturn(Optional.of(task));
        when(taskMapper.toDTO(task)).thenReturn(dto);

        TaskDTO result = taskService.getOneTask(id);

        verify(taskRepository).findById(id);
        verify(taskMapper).toDTO(task);

        assertEquals(dto, result);
    }

    @SneakyThrows
    @Test
    void getOneTask_errorCase_whenTaskNotFound() {
        Long id = 1L;

        when(taskRepository.findById(id)).thenReturn(Optional.empty());

        NotFoundException ex = assertThrowsExactly(NotFoundException.class, () -> taskService.getOneTask(id));

        verify(taskRepository).findById(id);

        assertEquals(ex.getMessage(), String.format("No task was found with %s ID", id));
    }

}
