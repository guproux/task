package g.proux.task.controller.dto;

import jakarta.validation.constraints.NotNull;

public record CreationTaskFormDTO(
        @NotNull(message = "Label must not be null.") String label,
        @NotNull(message = "Description must not be null.") String description
) { }
