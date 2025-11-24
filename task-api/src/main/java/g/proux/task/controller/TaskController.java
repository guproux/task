package g.proux.task.controller;

import g.proux.task.controller.dto.TaskDTO;
import g.proux.task.domain.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "TaskController", description = "Task API")
@RestController
@Transactional
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/api/v1/tasks")
    @Operation(description = "Get all tasks from database.")
    public List<TaskDTO> getTasks() {
        return this.taskService.getTasks();
    }

}
