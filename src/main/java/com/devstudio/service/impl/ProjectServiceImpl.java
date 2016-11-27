package com.devstudio.service.impl;


import com.devstudio.service.ProjectService;
import com.devstudio.entity.Project;
import com.devstudio.dao.ProjectDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import java.util.List;

@Service("projectService")
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectDao projectDao;

   /* @Override
    public Project findById(int id) {
        return null;
    }

    @Override
    public List<Project> findAll() {
        return null;
    }

    @Override
    public void save(Project project) {

    }

    @Override
    public void delete(Project project) {

    }*/

    @Override
    public Project create(Project project) {
        return projectDao.create(project);
    }

   /* public Project findById(int id) {
        return projectDao.findById(id);
    }
*/
    public List<Project> findAll() {
        return projectDao.findAll();
    }
/*
    @Transactional
    public void save(Project project) {
        projectDao.save(project);
    }

    @Transactional
    public void delete(Project project) {
        projectDao.delete(project);
    }*/
}
