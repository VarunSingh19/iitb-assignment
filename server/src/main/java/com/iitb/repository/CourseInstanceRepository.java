package com.iitb.repository;

import com.iitb.model.CourseInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseInstanceRepository extends JpaRepository<CourseInstance, Long> {
    List<CourseInstance> findByYearAndSemester(int year, int semester);
    List<CourseInstance> findByYearAndSemesterAndCourseId(int year, int semester, Long courseId);
    @Query("SELECT ci FROM CourseInstance ci WHERE ci.course.id = :courseId")
    List<CourseInstance> findByCourseId(Long courseId);
}
