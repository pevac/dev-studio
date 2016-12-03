package com.devstudio.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;
import java.io.*;
import java.net.URL;

/**
 * Created by Vasyl on 01.12.2016.
 */
public class FileManager {
    private String path;

    public FileManager(){
        path = /*System.getProperty("catalina.home")*/"D:" + File.separator + /*".." + File.separator +*/ "storage";
    }

    public void saveFile(MultipartFile file, String fileType) {

        URL loc = FileManager.class.getProtectionDomain().getCodeSource().getLocation();
        path=(loc.getFile());
        if (!file.isEmpty()) {

            String pathToSave;
            String fileName = file.getOriginalFilename();
            pathToSave = path + File.separator +".."+File.separator+".."+File.separator+ fileType + File.separator;
            File location = new File(pathToSave);
            if (!location.exists()) {
                location.mkdirs();
            }

            location = new File(pathToSave + fileName);
            try {
                file.transferTo(location);

            } catch (Exception e) {
                e.printStackTrace();


            }

        }
    }
}


