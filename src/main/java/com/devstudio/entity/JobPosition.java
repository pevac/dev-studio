package com.devstudio.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 * Created by Vasyl on 28.11.2016.
 */
@Entity
public class JobPosition {
    @Id
    @GeneratedValue
    private int id;


    private String jobName;

    @OneToMany(mappedBy = "bookCategory")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}

