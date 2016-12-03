package com.devstudio.entity;

import javax.persistence.*;

/**
 * Created by Vasyl on 29.11.2016.
 */
@Entity
@Table(name="vacancy")
public class Vacancy {
    @Id
    //@Column(name="vacancy_id")
    @GeneratedValue
    private int id;

    @ManyToOne
    @JoinColumn(name="job_position_id")
    private JobPosition jobPosition;

    //private int jobName;

    /* @ManyToOne@JoinColumn(name="project_id")   // projects table isn`t currently connected to this project version
    private int projectName;
    //private Project project;
    */

    private String  description;
    @ManyToOne
    @JoinColumn(name="working_time_id")
    private WorkingTime workingTime;
    private String etc;                          // the purpose of this field is not quite clear
    private byte showStatus;
    private byte activeStatus;                   //either of these two


    public Vacancy() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public JobPosition getJobPosition() {
        return jobPosition;
    }

    public void setJobPosition(JobPosition jobPosition) {
        this.jobPosition = jobPosition;
    }
    /*public int getJobName() {
        return jobName;
    }

    public void setJobName(int jobName) {
        this.jobName = jobName;
    }
*/
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

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

