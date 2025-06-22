package com.iitb.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "course_instances",
        uniqueConstraints = @UniqueConstraint(
                name = "UK_course_year_semester",
                columnNames = { "course_id", "year", "semester" }
        ))
public class CourseInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private int semester;

    @Column(nullable = true)
    private String instructorName;

    public CourseInstance(Course course, int year, int semester) {
        this.course   = course;
        this.year     = year;
        this.semester = semester;
    }
}
