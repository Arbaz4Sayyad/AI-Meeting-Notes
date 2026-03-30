package com.app.meetingai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class MeetingAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MeetingAiApplication.class, args);
    }
}
