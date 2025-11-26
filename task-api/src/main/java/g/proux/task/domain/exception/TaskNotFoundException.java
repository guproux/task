package g.proux.task.domain.exception;

public class TaskNotFoundException extends Exception {

    private String code;

    public TaskNotFoundException(String message, String code) {
        super(message);
        this.code = code;
    }
}
