//package com.iitb.controller;
//
//import com.iitb.model.Course;
//import com.iitb.service.CourseService;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.validation.annotation.Validated;
//import org.springframework.web.bind.annotation.*;
//import java.util.List;
//import java.util.Set;
//
//@RestController
//@RequestMapping("/api/courses")
//@Validated
//public class CourseController {
//    private final CourseService courseService;
//
//    public CourseController(CourseService courseService) {
//        this.courseService = courseService;
//    }
//
//    @PostMapping
//    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
//        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.createCourse(course));
//    }
//
//    @GetMapping
//    public ResponseEntity<List<Course>> getAllCourses() {
//        return ResponseEntity.ok(courseService.getAllCourses());
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Course> getCourse(@PathVariable Long id) {
//        return ResponseEntity.ok(courseService.getCourseById(id));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
//        courseService.deleteCourse(id);
//        return ResponseEntity.noContent().build();
//    }
//}
package com.iitb.controller;

import com.iitb.model.Course;
import com.iitb.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")   // ← allow your Vite front‑end
@Validated
public class CourseController {
    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(courseService.createCourse(course));
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}
