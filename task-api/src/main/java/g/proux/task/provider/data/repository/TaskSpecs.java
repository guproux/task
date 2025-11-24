package g.proux.task.provider.data.repository;

import g.proux.task.provider.data.entity.Task;
import org.springframework.data.jpa.domain.Specification;

public class TaskSpecs {

    public static Specification<Task> isCompleted(Boolean completed) {
        return (root, query, builder) -> builder.equal(root.get("completed"), completed);
    }

}
