package com.iitb.controller;
import com.iitb.dto.CourseInstanceRequest;

import com.iitb.model.CourseInstance;
import com.iitb.service.CourseInstanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/instances")
@Validated
public class CourseInstanceController {
    private final CourseInstanceService courseInstanceService;

    public CourseInstanceController(CourseInstanceService courseInstanceService) {
        this.courseInstanceService = courseInstanceService;
    }

    @PostMapping
    public ResponseEntity<CourseInstance> createInstance(
            @RequestBody CourseInstanceRequest req
    ) {
        CourseInstance created = courseInstanceService.createInstance(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<CourseInstance>> getAllInstances() {
        return ResponseEntity.ok(courseInstanceService.getAllInstances());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseInstance>> getInstancesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(courseInstanceService.getInstancesByCourse(courseId));
    }

    @GetMapping("/{year}/{semester}")
    public ResponseEntity<List<CourseInstance>> getInstancesByYearSemester(
            @PathVariable int year,
            @PathVariable int semester) {
        return ResponseEntity.ok(courseInstanceService.getInstancesByYearSemester(year, semester));
    }

    @GetMapping("/{year}/{semester}/{courseId}")
    public ResponseEntity<CourseInstance> getInstance(
            @PathVariable int year,
            @PathVariable int semester,
            @PathVariable Long courseId) {
        return ResponseEntity.ok(courseInstanceService.getInstance(year, semester, courseId));
    }

    @DeleteMapping("/{year}/{semester}/{courseId}")
    public ResponseEntity<Void> deleteInstance(
            @PathVariable int year,
            @PathVariable int semester,
            @PathVariable Long courseId) {
        courseInstanceService.deleteInstance(year, semester, courseId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{year}/{semester}/{courseId}")
    public ResponseEntity<CourseInstance> updateInstance(
            @PathVariable int year,
            @PathVariable int semester,
            @PathVariable Long courseId,
            @RequestBody CourseInstanceRequest request) {
        try {
            CourseInstance updated = courseInstanceService.updateInstance(year, semester, courseId, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }
}
