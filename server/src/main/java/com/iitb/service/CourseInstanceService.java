package com.iitb.service;

import com.iitb.dto.CourseInstanceRequest;
import com.iitb.model.Course;
import com.iitb.model.CourseInstance;
import com.iitb.repository.CourseInstanceRepository;
import com.iitb.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CourseInstanceService {
    private final CourseInstanceRepository courseInstanceRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public CourseInstanceService(CourseInstanceRepository courseInstanceRepository,
                               CourseRepository courseRepository) {
        this.courseInstanceRepository = courseInstanceRepository;
        this.courseRepository = courseRepository;
    }

    public CourseInstance createInstance(CourseInstanceRequest request) {
        if (request.getCourseId() == null) {
            throw new IllegalArgumentException("Course ID must be specified");
        }
        
        try {
            // Try to find course by courseId (String)
            String courseIdStr = String.valueOf(request.getCourseId());
            Course course = courseRepository.findByCourseId(courseIdStr)
                    .orElseThrow(() -> new NoSuchElementException("Course not found with ID: " + courseIdStr));

            CourseInstance instance = new CourseInstance();
            instance.setYear(request.getYear());
            instance.setSemester(Integer.parseInt(request.getSemester()));
            instance.setCourse(course);
            
            return courseInstanceRepository.save(instance);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid semester format", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create course instance", e);
        }
    }

    public List<CourseInstance> getAllInstances() {
        return courseInstanceRepository.findAll();
    }

    public List<CourseInstance> getInstancesByYearSemester(int year, int semester) {
        return courseInstanceRepository.findByYearAndSemester(year, semester);
    }

    public CourseInstance getInstance(int year, int semester, Long courseId) {
        List<CourseInstance> matches =
                courseInstanceRepository.findByYearAndSemesterAndCourseId(year, semester, courseId);

        return matches.stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Course instance not found"));
    }


    public void deleteInstance(int year, int semester, Long courseId) {
        CourseInstance instance = getInstance(year, semester, courseId);
        courseInstanceRepository.delete(instance);
    }
}
