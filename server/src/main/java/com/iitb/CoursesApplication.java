package com.iitb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@SpringBootApplication
public class CoursesApplication {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow credentials (cookies, authorization headers, etc.)
        config.setAllowCredentials(true);
        
        // Allow multiple origins for different development scenarios
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",    // Vite default port
            "http://localhost:3000",    // React dev server
            "http://localhost",         // Port 80
            "http://localhost:80",      // Explicit port 80
            "http://127.0.0.1:5173",   // Alternative localhost
            "http://127.0.0.1:3000",   // Alternative localhost
            "http://127.0.0.1"         // Alternative localhost
        ));
        
        // Allow all headers
        config.addAllowedHeader("*");
        
        // Allow all HTTP methods
        config.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
        ));
        
        // Cache preflight response for 1 hour
        config.setMaxAge(3600L);
        
        // Apply CORS configuration to all endpoints
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }

    public static void main(String[] args) {
        SpringApplication.run(CoursesApplication.class, args);
    }
}