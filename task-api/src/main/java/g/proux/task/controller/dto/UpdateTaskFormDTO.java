package g.proux.task.controller.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateTaskFormDTO(
        @NotNull(message = "Completed must not be null.") Boolean completed
) { }
