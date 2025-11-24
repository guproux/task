package g.proux.task.service;

import g.proux.task.controller.dto.CreationTaskFormDTO;
import g.proux.task.controller.dto.TaskDTO;
import g.proux.task.domain.TaskService;
import g.proux.task.provider.data.entity.Task;
import g.proux.task.provider.data.repository.TaskRepository;
import g.proux.task.mapper.TaskMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
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
    public void testGetTasks() {
        Task task1 = new Task(1L, "Tâche 1", "Description 1", false);
        Task task2 = new Task(2L, "Tâche 2", "Description 2", false);
        List<Task> taskList = Arrays.asList(task1, task2);

        when(taskRepository.findAll()).thenReturn(taskList);

        TaskDTO taskDTO1 = new TaskDTO(1L, "Tâche 1", "Description 1", false);
        TaskDTO taskDTO2 = new TaskDTO(2L, "Tâche 2", "Description 2", false);
        when(taskMapper.toDTO(task1)).thenReturn(taskDTO1);
        when(taskMapper.toDTO(task2)).thenReturn(taskDTO2);

        List<TaskDTO> result = taskService.getTasks();

        verify(taskRepository).findAll();
        verify(taskMapper, times(2)).toDTO(any(Task.class));

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Tâche 1", result.get(0).label());
        assertEquals("Tâche 2", result.get(1).label());
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

}
