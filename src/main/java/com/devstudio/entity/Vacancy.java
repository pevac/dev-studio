package com.devstudio.entity;

import javax.persistence.*;

/**
 * Created by Vasyl on 28.11.2016.
 */
@Entity
public class Vacancy {              // position???
    @Id
    @GeneratedValue
    private int id;
    private JobPosition jobPosition;
    private int jobName;             // wtf??????
    /* @ManyToOne@JoinColumn(name="project_id")
     private int projectName;
     //private Project project;
 */
    private String  description;

    //private int busyHour;            //workingHours, laborHours or time
    private WorkingTime workingTime;
    private String etc;              // wtf????
    private byte showStatus;
    private byte activeStatus;        //both



    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @ManyToOne@JoinColumn(name="job_position_id")
    public JobPosition getJobPosition() {
        return jobPosition;
    }

    public void setJobPosition(JobPosition jobPosition) {
        this.jobPosition = jobPosition;
    }

    public int getJobName() {
        return jobName;
    }

    public void setJobName(int jobName) {
        this.jobName = jobName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @ManyToOne
    @JoinColumn(name="working_time_id")
    public WorkingTime getWorkingTime() {
        return workingTime;
    }

    public void setWorkingTime(WorkingTime workingTime) {
        this.workingTime = workingTime;
    }

    public String getEtc() {
        return etc;
    }

    public void setEtc(String etc) {
        this.etc = etc;
    }

    public byte getShowStatus() {
        return showStatus;
    }

    public void setShowStatus(byte showStatus) {
        this.showStatus = showStatus;
    }

    public byte getActiveStatus() {
        return activeStatus;
    }

    public void setActiveStatus(byte activeStatus) {
        this.activeStatus = activeStatus;
    }
}

