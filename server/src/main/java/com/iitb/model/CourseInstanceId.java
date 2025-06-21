package com.iitb.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class CourseInstanceId {
    private Long courseId;
    private int year;
    private int semester;

    public CourseInstanceId() {}

    public CourseInstanceId(Long courseId, int year, int semester) {
        this.courseId = courseId;
        this.year = year;
        this.semester = semester;
    }
}
