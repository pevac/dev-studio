package com.devstudio.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by Vasyl on 29.11.2016.
 */
@Entity
@Table(name="working_time")
public class WorkingTime {
    @Id
    @GeneratedValue
    //@OneToOne(mappedBy="workingTime") // class need to be declared as mapping class somewhere and I dont know where exactly(mapping class="com.journaldev.hibernate.model.WorkingTime
            int id;
    String busyHour;

    public WorkingTime() {}

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

