package com.springapp.repositories.model.service;


import com.springapp.entities.Project;
import com.springapp.repositories.model.dao.ProjectDao;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.List;

@Named
public class ProjectServiceImpl implements ProjectService{

    @Inject
    private ProjectDao projectDao;

    public Project findById(int id) {
        return projectDao.findById(id);
    }

    public List<Project> findAll() {
        return projectDao.findAll();
    }

    @Transactional
    public void save(Project project) {
        projectDao.save(project);
    }

    @Transactional
    public void delete(Project project) {
        projectDao.delete(project);
    }
}
