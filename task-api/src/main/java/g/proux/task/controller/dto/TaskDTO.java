package g.proux.task.controller.dto;

public record TaskDTO(
        Long id,
        String label,
        String description,
        Boolean completed
) { }
