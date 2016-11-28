package com.devstudio.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by Vasyl on 29.11.2016.
 */
@Entity
@Table(name="job_position")
public class JobPosition {
    @Id
    @GeneratedValue
    //@Column(name="job_position_id")
    // @OneToOne(mappedBy = "jobPosition")        //   class need to be declared as mapping class somewhere and I dont know where exactly(mapping class="com.journaldev.hibernate.model.JobPosition)
    private int id;

    private String jobName;

    public JobPosition() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }
}

