package com.iitb.service;

import com.iitb.model.Course;
import com.iitb.repository.CourseRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course createCourse(Course course) {
        // First save the course without prerequisites
        Course savedCourse = courseRepository.save(course);
        
        if (course.getPrerequisites() != null && !course.getPrerequisites().isEmpty()) {
            // Fetch all prerequisite courses from database
            Set<Course> prerequisites = course.getPrerequisites().stream()
                .map(prereq -> courseRepository.findById(prereq.getId())
                    .orElseThrow(() -> new RuntimeException("Prerequisite course not found: " + prereq.getId())))
                .collect(Collectors.toSet());
            
            // Set the prerequisites
            savedCourse.setPrerequisites(prerequisites);
            
            // Save again with prerequisites
            return courseRepository.save(savedCourse);
        }
        
        return savedCourse;
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
            throw new IllegalArgumentException("Cannot delete course " + course.getCourseId() + " as it is a prerequisite for other courses");
        }
        courseRepository.delete(course);
    }
}
