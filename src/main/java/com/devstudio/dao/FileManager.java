package com.devstudio.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;
import java.io.*;

/**
 * Created by Vasyl on 01.12.2016.
 */
public class FileManager {
    private String path;

    {
        path = System.getProperty("catalina.home") + File.separator + ".." + File.separator + "storage";
    }

    public void saveFile(MultipartFile file, String fileType) {

        if (!file.isEmpty()) {

            String pathToSave;
            String fileName = file.getOriginalFilename();
            pathToSave = path + File.separator + fileType + File.separator;
            File location = new File(pathToSave);
            if (!location.exists()) {
                location.mkdir();
            }

            location = new File(pathToSave + fileName);
            try {
                byte[] bytes = file.getBytes();
                BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(location));
                stream.write(bytes);
            } catch (Exception e) {
                e.printStackTrace();


            }

        }
    }
}


