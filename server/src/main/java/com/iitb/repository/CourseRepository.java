package com.iitb.repository;

import com.iitb.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByPrerequisitesContains(Course course);
    Optional<Course> findByCourseId(String courseId);
}
