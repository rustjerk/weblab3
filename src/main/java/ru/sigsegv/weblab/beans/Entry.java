package ru.sigsegv.weblab.beans;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Named;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.Duration;
import java.time.LocalDateTime;

@Named
@SessionScoped
@Entity
public class Entry implements Serializable {
    @Id
    @GeneratedValue
    private Long id;

    private int x = 2;

    private float y = 1.2f;

    private float radius = 3.0f;

    private boolean isHit = false;

    private LocalDateTime creationDate;
    private Duration processingTime;

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public float getRadius() {
        return radius;
    }

    public void setRadius(float radius) {
        this.radius = radius;
    }

    public boolean isHit() {
        return isHit;
    }

    public void setHit(boolean hit) {
        isHit = hit;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public Duration getProcessingTime() {
        return processingTime;
    }

    public String getFormattedProcessingTime() {
        if (processingTime == null) return "0 с";
        return (processingTime.toNanos() / 1000) + " мкс";
    }

    public void setProcessingTime(Duration processingTime) {
        this.processingTime = processingTime;
    }

    public void reset() {
        creationDate = LocalDateTime.now();
        id = null;
    }
}
