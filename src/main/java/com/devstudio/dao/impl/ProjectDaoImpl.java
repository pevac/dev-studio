package com.devstudio.dao.impl;


import com.devstudio.dao.ProjectDao;
import com.devstudio.entity.Project;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Component("projectDao")
public class ProjectDaoImpl extends GenericDaoImpl<Project,Integer> implements ProjectDao{


//    public List<Project> findAll() {
//        TypedQuery<Project> query = this.em.createQuery("SELECT m FROM Project m",  Project.class);
//        List<Project> listOfProjects = query.getResultList();
//        return listOfProjects;
//    }
    /*@PersistenceContext
    private EntityManager em;*/

   /* public Project findById(int id) {
        return em.find(Project.class, id);
    }

    public List<Project> findAll() {
        TypedQuery<Project> query = em.createQuery("SELECT p FROM Project p", Project.class);
        List<Project> listProject = query.getResultList();
        return listProject;
    }

    public void save(Project project) {
        if ( project.getId() == 0) {
            em.persist(project);
        } else {
            em.merge(project);
        }
    }

    public void delete(Project project) {
        em.remove(findById(project.getId()));
    }*/
}
