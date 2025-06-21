package com.iitb.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor            // ← Jackson needs this
@AllArgsConstructor           // ← Optional: handy for testing
@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String courseId;

    @Column(nullable = false, length = 2000)
    private String description;

    @EqualsAndHashCode.Exclude
    @ManyToMany
    @JoinTable(
            name = "course_prerequisites",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "prerequisite_id")
    )
    @JsonIgnoreProperties("prerequisites")   // ← avoid infinite recursion
    private Set<Course> prerequisites = new HashSet<>();

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("course")          // if CourseInstance serializes back
    private Set<CourseInstance> instances = new HashSet<>();

    // convenience methods
    public void addPrerequisite(Course prerequisite) {
        prerequisites.add(prerequisite);
    }
    public void removePrerequisite(Course prerequisite) {
        prerequisites.remove(prerequisite);
    }
}
