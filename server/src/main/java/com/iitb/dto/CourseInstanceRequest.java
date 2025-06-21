
package com.iitb.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CourseInstanceRequest {
    private String courseId;
    private Integer year;
    private String semester;
}
