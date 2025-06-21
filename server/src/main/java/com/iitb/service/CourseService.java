package com.iitb.service;

import com.iitb.model.Course;
import com.iitb.repository.CourseRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course createCourse(Course course) {
        validatePrerequisites(course);
        return courseRepository.save(course);
    }

    private void validatePrerequisites(Course course) {
        Set<Course> prerequisites = course.getPrerequisites();
        if (prerequisites != null && !prerequisites.isEmpty()) {
            for (Course prerequisite : prerequisites) {
                if (!courseRepository.existsById(prerequisite.getId())) {
                    throw new RuntimeException("Prerequisite course not found: " + prerequisite.getCourseId());
                }
            }
        }
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found: " + id));
    }

    public void deleteCourse(Long id) {
        Course course = getCourseById(id);
        if (courseRepository.existsByPrerequisitesContains(course)) {
            throw new RuntimeException("Cannot delete course as it is a prerequisite for other courses");
        }
        courseRepository.delete(course);
    }
}
