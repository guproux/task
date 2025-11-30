package g.proux.task.service;

import g.proux.task.controller.dto.TaskDTO;
import g.proux.task.provider.data.entity.Task;
import g.proux.task.provider.data.repository.TaskRepository;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import tools.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TaskIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private WebApplicationContext context;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();

        resetData();
    }

    private void resetData() {
        taskRepository.deleteAll();

        Task task1 = Task.builder().label("Label 1").description("Description 1").completed(true).build();
        Task task2 = Task.builder().label("Label 2").description("Description 2").completed(true).build();
        Task task3 = Task.builder().label("Label 3").description("Description 3").completed(false).build();
        taskRepository.saveAll(Arrays.asList(task1, task2, task3));
    }

    @SneakyThrows
    @ParameterizedTest
    @MethodSource("generateData")
    void test(Boolean completed, List<TaskDTO> expectedTasks) {
        MockHttpServletRequestBuilder builder = get("/api/v1/tasks");
        if (completed != null) {
            builder = builder.queryParam("completed", completed.toString());
        }
        builder = builder.accept(MediaType.APPLICATION_JSON);

        final String response = this.mockMvc.perform(builder)
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andReturn()
                .getResponse().getContentAsString();

        final List<TaskDTO> taskDTOs = this.deserializeJsonStringToObjectList(response, TaskDTO.class);

        assertThat(taskDTOs).isNotNull().isNotEmpty().hasSize(expectedTasks.size());
    }

    private static Stream<Arguments> generateData() {
        TaskDTO task1 = new TaskDTO(1L, "Label 1", "Description 1", true);
        TaskDTO task2 = new TaskDTO(2L, "Label 2", "Description 2", true);
        TaskDTO task3 = new TaskDTO(3L, "Label 3", "Description 3", false);

        return Stream.of(
                Arguments.of(null, Arrays.asList(task1, task2, task3)),
                Arguments.of(true, Arrays.asList(task1, task2)),
                Arguments.of(false, Collections.singletonList(task3))
        );
    }

    public <T> List<T> deserializeJsonStringToObjectList(String json, Class<T> clazz) {
        return this.objectMapper.readValue(json, this.objectMapper.getTypeFactory().constructCollectionType(List.class, clazz));
    }
}
