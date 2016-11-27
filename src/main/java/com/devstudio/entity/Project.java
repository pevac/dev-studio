package com.devstudio.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "project")
public class Project extends GenericEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "date_regist")
    private Date dateRegist;

    @Column(name = "project_name")
    private String projectName;

    @Column(name = "description")
    private String description;

    @Column(name = "link_url")
    private String linkUrl;

    @Column(name = "request_id")
    private String requestId;

    public Project () {
    }

    public Project(Date dateRegist, String projectName, String description, String linkUrl, String requestId) {
        this.dateRegist = dateRegist;
        this.projectName = projectName;
        this.description = description;
        this.linkUrl = linkUrl;
        this.requestId = requestId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getDateRegist() {
        return dateRegist;
    }

    public void setDateRegist(Date dateRegist) {
        this.dateRegist = dateRegist;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLinkUrl() {
        return linkUrl;
    }

    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }
}
