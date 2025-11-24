package g.proux.task.controller.dto;

import jakarta.validation.constraints.NotNull;

public record CreationTaskFormDTO(
        @NotNull String label,
        @NotNull String description
) { }
