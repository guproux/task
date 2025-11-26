package g.proux.task.controller;

import g.proux.task.controller.dto.CreationTaskFormDTO;
import g.proux.task.controller.dto.TaskDTO;
import g.proux.task.domain.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "TaskController", description = "Task API")
@RestController
@Transactional
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/api/v1/tasks")
    @Operation(description = "Get tasks with optional parameter 'completed'. By default 'completed' is null so we get all tasks from database.")
    public List<TaskDTO> getTasks(@RequestParam(value = "completed", required = false) Boolean completed) {
        return taskService.getTasks(completed);
    }

    @PostMapping("/api/v1/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(description = "Create a new task.")
    public TaskDTO createTask(@RequestBody @Valid CreationTaskFormDTO form) {
        return taskService.createTask(form);
    }

    @GetMapping("/api/v1/tasks/{taskID}")
    @Operation(description = "Get one task by its ID.")
    public TaskDTO getOneTask(@PathParam("taskID") Long taskID) {
        return taskService.getOneTask(taskID);
    }

}
