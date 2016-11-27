package com.devstudio.entity;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "customer_request")
public class CustomerRequest {
    @GeneratedValue
    @Id
    public int id;
    public Date date_regist;
    public String name_company;
    public String site_company;
    public String full_name;
    public String phone;
    public String mail;
    public String job_position;
    public String question_1;
    public String question_2;
    public String question_3;
    public String question_4;
    public String status;

    public Date getDate_regist() {
        return date_regist;
    }

    public void setDate_regist(Date date_regist) {
        this.date_regist = date_regist;
    }

    public String getName_company() {
        return name_company;
    }

    public void setName_company(String name_company) {
        this.name_company = name_company;
    }

    public String getSite_company() {
        return site_company;
    }

    public void setSite_company(String site_company) {
        this.site_company = site_company;
    }

    public String getFull_name() {
        return full_name;
    }

    public void setFull_name(String full_name) {
        this.full_name = full_name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getJob_position() {
        return job_position;
    }

    public void setJob_position(String job_position) {
        this.job_position = job_position;
    }

    public String getQuestion_1() {
        return question_1;
    }

    public void setQuestion_1(String question_1) {
        this.question_1 = question_1;
    }

    public String getQuestion_2() {
        return question_2;
    }

    public void setQuestion_2(String question_2) {
        this.question_2 = question_2;
    }

    public String getQuestion_3() {
        return question_3;
    }

    public void setQuestion_3(String question_3) {
        this.question_3 = question_3;
    }

    public String getQuestion_4() {
        return question_4;
    }

    public void setQuestion_4(String question_4) {
        this.question_4 = question_4;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getId() {

        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
