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
            instance.setSemester(Integer.parseInt(request.getSemester())); // Convert to int
            instance.setCourse(course);
            instance.setInstructorName(request.getInstructorName() != null ? 
                request.getInstructorName() : "IITB Faculty Name");
            
            return courseInstanceRepository.save(instance);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid semester format. Please enter a number between 1 and 2", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create course instance: " + e.getMessage(), e);
        }
    }

    public List<CourseInstance> getAllInstances() {
        return courseInstanceRepository.findAll();
    }

    public List<CourseInstance> getInstancesByCourse(Long courseId) {
        return courseInstanceRepository.findByCourseId(courseId);
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

    public CourseInstance updateInstance(int year, int semester, Long courseId, CourseInstanceRequest request) {
        CourseInstance instance = getInstance(year, semester, courseId);
        
        // Ensure course ID matches
        if (request.getCourseId() != null) {
            Long requestedCourseId = Long.parseLong(request.getCourseId());
            if (!requestedCourseId.equals(courseId)) {
                throw new IllegalArgumentException("Cannot change course ID");
            }
        }
        
        if (request.getYear() != null) {
            instance.setYear(request.getYear());
        }
        if (request.getSemester() != null) {
            instance.setSemester(Integer.parseInt(request.getSemester()));
        }
        if (request.getInstructorName() != null) {
            instance.setInstructorName(request.getInstructorName());
        }
        
        return courseInstanceRepository.save(instance);
    }
}
