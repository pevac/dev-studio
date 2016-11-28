package com.devstudio.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 * Created by Vasyl on 28.11.2016.
 */
@Entity
public class WorkingTime {
    @Id
    @GeneratedValue
    int id;
    String busyHour;

    @OneToMany(mappedBy="workingTime")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getBusyHour() {
        return busyHour;
    }

    public void setBusyHour(String busyHour) {
        this.busyHour = busyHour;
    }
}

