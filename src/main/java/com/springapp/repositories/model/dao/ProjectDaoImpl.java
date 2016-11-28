package com.springapp.repositories.model.dao;

import com.springapp.entities.Project;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Repository
public class ProjectDaoImpl implements ProjectDao {

    @PersistenceContext
    private EntityManager em;

    public Project findById(int id) {
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
    }
}
